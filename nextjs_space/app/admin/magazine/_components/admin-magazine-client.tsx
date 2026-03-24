"use client";
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Save, X, Star, Upload, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EditionItem {
  id: string;
  title: string;
  slug: string | null;
  issueNumber: string | null;
  coverUrl: string | null;
  description: string | null;
  pdfUrl: string | null;
  pdfCloudPath: string | null;
  pdfPageCount: number | null;
  externalUrl: string | null;
  isCurrent: boolean;
  publishDate: string;
}

const EMPTY_FORM = {
  title: '', issueNumber: '', coverUrl: '', description: '', externalUrl: '', pdfUrl: '', pdfCloudPath: '', pdfPageCount: '', isCurrent: false, publishDate: '',
};

export default function AdminMagazineClient() {
  const [editions, setEditions] = useState<EditionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/magazine').then(r => r.json()).then(d => { setEditions(d ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Please select a PDF file'); return; }

    setUploading(true);
    setUploadProgress('Getting upload URL...');

    try {
      // Get presigned URL
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: 'application/pdf', isPublic: false }),
      });
      const { uploadUrl, cloud_storage_path } = await presignedRes.json();

      setUploadProgress('Uploading PDF...');

      // Check if Content-Disposition is in signed headers
      const url = new URL(uploadUrl);
      const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders') ?? '';
      const headers: Record<string, string> = { 'Content-Type': 'application/pdf' };
      if (signedHeaders.includes('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      // Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      setUploadProgress('PDF uploaded successfully!');
      setForm(p => ({ ...p, pdfCloudPath: cloud_storage_path, pdfUrl: '' }));

      setTimeout(() => setUploadProgress(''), 3000);
    } catch (err: any) {
      setUploadProgress('Upload failed: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingId ? `/api/magazine/${editingId}` : '/api/magazine';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        const updated = await fetch('/api/magazine').then(r => r.json());
        setEditions(updated ?? []);
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    } catch { /* empty */ }
    setSaving(false);
  };

  const handleEdit = (ed: EditionItem) => {
    setForm({
      title: ed?.title ?? '',
      issueNumber: ed?.issueNumber ?? '',
      coverUrl: ed?.coverUrl ?? '',
      description: ed?.description ?? '',
      externalUrl: ed?.externalUrl ?? '',
      pdfUrl: ed?.pdfUrl ?? '',
      pdfCloudPath: ed?.pdfCloudPath ?? '',
      pdfPageCount: ed?.pdfPageCount ? String(ed.pdfPageCount) : '',
      isCurrent: ed?.isCurrent ?? false,
      publishDate: ed?.publishDate ? new Date(ed.publishDate).toISOString().split('T')[0] : '',
    });
    setEditingId(ed?.id ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this edition?')) return;
    await fetch(`/api/magazine/${id}`, { method: 'DELETE' });
    setEditions(prev => (prev ?? []).filter(e => e?.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-brand-gray-dark">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-brand-neon" />
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Magazine Editions</h1>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim text-sm">
          <Plus size={16} /> Add Edition
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-purple mb-4">{editingId ? 'Edit Edition' : 'New Edition'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Issue Number (e.g. Issue #12)" value={form.issueNumber} onChange={e => setForm(p => ({ ...p, issueNumber: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Cover Image URL" value={form.coverUrl} onChange={e => setForm(p => ({ ...p, coverUrl: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="External URL (optional heyzine/issuu link)" value={form.externalUrl} onChange={e => setForm(p => ({ ...p, externalUrl: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input type="date" value={form.publishDate} onChange={e => setForm(p => ({ ...p, publishDate: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Page Count (optional)" type="number" value={form.pdfPageCount} onChange={e => setForm(p => ({ ...p, pdfPageCount: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <label className="flex items-center gap-2 px-3 py-2">
              <input type="checkbox" checked={form.isCurrent} onChange={e => setForm(p => ({ ...p, isCurrent: e?.target?.checked ?? false }))} className="w-4 h-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
              <span className="text-sm font-medium">Mark as Current Issue</span>
            </label>
          </div>

          {/* PDF Upload Section */}
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={18} className="text-brand-purple" />
              <span className="font-semibold text-sm text-brand-purple">PDF Magazine File</span>
            </div>
            {form.pdfCloudPath ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-600 font-medium">✓ PDF uploaded</span>
                <button onClick={() => { setForm(p => ({ ...p, pdfCloudPath: '', pdfUrl: '' })); }} className="text-xs text-red-500 underline">Remove</button>
              </div>
            ) : (
              <div>
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white font-medium rounded-lg hover:bg-brand-purple-light text-sm disabled:opacity-50">
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload PDF'}
                </button>
              </div>
            )}
            {uploadProgress && <p className="text-xs mt-2 text-brand-gray-dark">{uploadProgress}</p>}
            <p className="text-xs text-gray-400 mt-2">Upload the PDF to enable the built-in flipbook viewer. Without PDF, the edition will link to the external URL.</p>
          </div>

          <div className="mt-4">
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e?.target?.value ?? '' }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim text-sm disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 text-sm">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(editions ?? []).length === 0 ? (
          <p className="col-span-full p-8 text-center text-brand-gray-dark bg-white rounded-xl border border-gray-200">No editions yet. Add your first magazine edition.</p>
        ) : (
          (editions ?? []).map((ed: EditionItem) => (
            <div key={ed?.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  {ed?.issueNumber && <span className="text-brand-purple text-xs font-bold uppercase tracking-wider">{ed.issueNumber}</span>}
                  <h3 className="font-heading font-bold text-brand-purple">{ed?.title ?? ''}</h3>
                </div>
                {ed?.isCurrent && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-accent/10 text-brand-accent text-[10px] font-bold rounded uppercase"><Star size={10} /> Current</span>
                )}
              </div>
              <p className="text-brand-gray-dark text-xs mb-2">
                {ed?.publishDate ? new Date(ed.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
              </p>
              {ed?.pdfCloudPath && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded mb-2">
                  <FileText size={10} /> PDF Uploaded
                </span>
              )}
              {ed?.description && <p className="text-brand-gray-dark text-sm line-clamp-2 mb-3">{ed.description}</p>}
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(ed)} className="p-1.5 text-brand-purple hover:bg-brand-purple/10 rounded"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(ed?.id ?? '')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                {ed?.slug && (ed?.pdfCloudPath || ed?.pdfUrl) && (
                  <Link href={`/magazine/${ed.slug}`} className="p-1.5 text-brand-neon hover:bg-brand-neon/10 rounded" title="View Flipbook">
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
