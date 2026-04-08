"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Loader2, Copy, Check, Image as ImageIcon } from 'lucide-react';

export default function AdminMediaClient() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/media').then((r: any) => r?.json?.()).then((d: any) => setMedia(d ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: any) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Upload file directly via server (works on both Vercel Blob and S3)
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload/direct', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err?.error ?? `Upload failed: ${uploadRes.status}`);
      }
      const { url, cloud_storage_path } = await uploadRes.json();

      // Save media record
      const mediaRes = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          cloudStoragePath: cloud_storage_path ?? null,
          url,
          mimeType: file.type,
          size: file.size,
          isPublic: true,
        }),
      });
      const newMedia = await mediaRes.json();
      setMedia((prev: any[]) => [newMedia, ...(prev ?? [])]);
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setUploading(false);
      if (fileRef?.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    await fetch(`/api/media?id=${id}`, { method: 'DELETE' }).catch(() => {});
    setMedia((prev: any[]) => (prev ?? []).filter((m: any) => m?.id !== id));
  };

  const handleCopy = (url: string) => {
    navigator?.clipboard?.writeText?.(url ?? '');
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Media Library</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload File'}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>
      ) : (media ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <ImageIcon size={48} className="text-brand-gray-dark mx-auto mb-4" />
          <p className="text-brand-gray-dark">No media files yet. Upload your first image!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(media ?? []).map((item: any) => (
            <div key={item?.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                {item?.url && <Image src={item.url} alt={item?.altText ?? item?.fileName ?? ''} fill className="object-cover" />}
              </div>
              <div className="p-3">
                <p className="text-xs text-brand-purple font-medium truncate">{item?.fileName ?? ''}</p>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => handleCopy(item?.url ?? '')} className="flex-1 flex items-center justify-center gap-1 p-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    {copied === item?.url ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    {copied === item?.url ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button onClick={() => handleDelete(item?.id ?? '')} className="p-1.5 hover:bg-red-50 rounded text-brand-gray-dark hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
