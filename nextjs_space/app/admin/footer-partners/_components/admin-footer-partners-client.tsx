"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Save, X, ExternalLink, Upload, GripVertical } from 'lucide-react';

interface FooterPartner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm = {
  name: '',
  logoUrl: '',
  websiteUrl: '',
  isActive: true,
  sortOrder: 0,
};

export default function AdminFooterPartnersClient() {
  const [partners, setPartners] = useState<FooterPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/footer-partners?all=true');
      const data = await res.json();
      if (Array.isArray(data)) setPartners(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchPartners(); }, []);

  const openEdit = (p: FooterPartner) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl || '',
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    const maxOrder = partners.length > 0 ? Math.max(...partners.map(p => p.sortOrder)) : -1;
    setForm({ ...emptyForm, sortOrder: maxOrder + 1 });
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const presignRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: true }),
      });
      const { uploadUrl, publicUrl, headers: uploadHeaders } = await presignRes.json();
      const reqHeaders: Record<string, string> = { 'Content-Type': file.type };
      if (uploadHeaders) {
        Object.entries(uploadHeaders).forEach(([k, v]) => { reqHeaders[k] = v as string; });
      }
      await fetch(uploadUrl, { method: 'PUT', headers: reqHeaders, body: file });
      setForm(prev => ({ ...prev, logoUrl: publicUrl }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.logoUrl.trim()) {
      alert('Name and Logo are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim(),
        websiteUrl: form.websiteUrl.trim() || null,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editing) {
        await fetch(`/api/footer-partners/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/footer-partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      setEditing(null);
      await fetchPartners();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      await fetch(`/api/footer-partners/${id}`, { method: 'DELETE' });
      await fetchPartners();
    } catch { /* ignore */ }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Partners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the sponsor & partner logos shown in the website footer.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Partner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Partner' : 'New Partner'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                placeholder="e.g. JOOLA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (optional)</label>
              <input
                type="url"
                value={form.websiteUrl}
                onChange={e => setForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                placeholder="https://example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo *</label>
              <div className="flex items-center gap-4">
                {form.logoUrl && (
                  <div className="relative h-16 w-32 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    <Image src={form.logoUrl} alt="Logo preview" fill className="object-contain" unoptimized />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="url"
                    value={form.logoUrl}
                    onChange={e => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple mb-2"
                    placeholder="Logo URL or upload below"
                  />
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs text-brand-purple hover:underline font-medium"
                  >
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Upload logo'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Recommended: transparent PNG, white or light logo for dark footer background.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={e => setForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-purple" />
              </label>
              <span className="text-sm text-gray-700">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2 text-sm"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {partners.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-4">No footer partners yet.</p>
          <button onClick={openNew} className="text-brand-purple hover:underline text-sm font-medium">Add your first partner</button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Logo</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">URL</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500 w-16">
                    <div className="flex items-center gap-1">
                      <GripVertical size={14} className="text-gray-300" />
                      {p.sortOrder}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-24 bg-gray-900 rounded overflow-hidden flex items-center justify-center p-1">
                      <Image src={p.logoUrl} alt={p.name} fill className="object-contain" unoptimized />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                    {p.websiteUrl ? (
                      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-purple hover:underline">
                        <ExternalLink size={12} />
                        {new URL(p.websiteUrl).hostname}
                      </a>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-brand-purple transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
