"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

export default function AdminTipAuthorsClient() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', photoUrl: '', bio: '' });
  const [saving, setSaving] = useState(false);

  const fetchAuthors = () => {
    fetch('/api/tip-authors')
      .then((r) => r?.json?.())
      .then((d) => setAuthors(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAuthors(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', photoUrl: '', bio: '' });
    setShowForm(true);
  };

  const openEdit = (author: any) => {
    setEditing(author);
    setForm({ name: author?.name ?? '', photoUrl: author?.photoUrl ?? '', bio: author?.bio ?? '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/tip-authors/${editing.id}` : '/api/tip-authors';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        setShowForm(false);
        fetchAuthors();
      }
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this author? Tips assigned to them will lose their author reference.')) return;
    try {
      await fetch(`/api/tip-authors/${id}`, { method: 'DELETE' });
      setAuthors((prev) => prev.filter((a) => a?.id !== id));
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Tip Authors</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
          <Plus size={16} /> New Author
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-brand-purple">{editing ? 'Edit Author' : 'New Author'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo URL</label>
              <input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://images.pexels.com/photos/20000981/pexels-photo-20000981/free-photo-of-portrait-of-an-african-man.jpeg" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bio</label>
              <input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Short bio..." />
            </div>
            <div className="md:col-span-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-purple animate-spin" />
        </div>
      ) : (authors ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <p className="text-brand-gray-dark">No tip authors yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(authors ?? []).map((author: any) => (
            <div key={author?.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {author?.photoUrl ? (
                  <Image src={author.photoUrl} alt={author?.name ?? ''} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
                    {(author?.name ?? '?')[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-brand-purple truncate">{author?.name ?? 'Unnamed'}</h3>
                {author?.bio && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{author.bio}</p>}
                <p className="text-xs text-gray-400 mt-1">{author?._count?.tips ?? 0} tips</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(author)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-purple">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(author?.id ?? '')} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
