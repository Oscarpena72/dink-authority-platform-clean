"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

interface JuniorFormProps {
  junior?: any;
}

export default function JuniorFormClient({ junior }: JuniorFormProps) {
  const router = useRouter();
  const isEdit = !!junior;
  const [form, setForm] = useState({
    name: junior?.name ?? '',
    title: junior?.title ?? '',
    excerpt: junior?.excerpt ?? '',
    featuredImage: junior?.featuredImage ?? '',
    country: junior?.country ?? '',
    age: junior?.age ?? '',
    publishDate: junior?.publishDate ? new Date(junior.publishDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    content: junior?.content ?? '',
    banner2Image: junior?.banner2Image ?? '',
    banner2Link: junior?.banner2Link ?? '',
    banner3Image: junior?.banner3Image ?? '',
    banner3Link: junior?.banner3Link ?? '',
    instagramVideoUrl: junior?.instagramVideoUrl ?? '',
    status: junior?.status ?? 'draft',
    language: junior?.language ?? 'en',
    metaTitle: junior?.metaTitle ?? '',
    metaDescription: junior?.metaDescription ?? '',
  });
  const [gallery, setGallery] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(junior?.galleryImages ?? '[]');
      setGallery(Array.isArray(parsed) ? parsed : []);
    } catch { setGallery([]); }
  }, [junior?.galleryImages]);

  const handleChange = (e: any) => {
    const { name, value } = e?.target ?? {};
    setForm((prev: any) => ({ ...(prev ?? {}), [name ?? '']: value }));
  };

  const addGalleryImage = () => {
    if (gallery.length >= 5) return;
    setGallery([...gallery, '']);
  };
  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...gallery]; updated[index] = value; setGallery(updated);
  };
  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, galleryImages: JSON.stringify(gallery.filter(Boolean)) };
      const url = isEdit ? `/api/juniors/${junior?.id}` : '/api/juniors';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { router.push('/admin/juniors'); router.refresh(); }
      else { const data = await res.json().catch(() => ({})); setError(data?.error ?? 'Failed to save'); }
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-heading font-bold text-brand-purple">{isEdit ? 'Edit Junior' : 'New Junior'}</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Player Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-lg font-heading" placeholder="e.g. Rex Thais" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Title / Headline *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-base" placeholder="e.g. The Rising Star of Junior Pickleball" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-sm" placeholder="Brief summary..." />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Content (HTML supported)</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={20} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none font-mono text-sm" placeholder="Write the story/interview content... HTML tags are supported." />
          </div>

          {/* Instagram Video */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-purple mb-4">📷 Instagram Video</h3>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Instagram Video URL</label>
              <input name="instagramVideoUrl" value={form.instagramVideoUrl} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://www.instagram.com/reel/..." />
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-brand-purple">📸 Gallery (max 5)</h3>
              {gallery.length < 5 && (
                <button type="button" onClick={addGalleryImage} className="flex items-center gap-1 text-xs text-brand-purple hover:text-brand-purple-light font-semibold">
                  <Plus size={14} /> Add Image
                </button>
              )}
            </div>
            <div className="space-y-2">
              {gallery.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input value={img} onChange={(e) => updateGalleryImage(i, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Image URL..." />
                  <button type="button" onClick={() => removeGalleryImage(i)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Banners */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-purple mb-4">📌 Banners (3 slots within article)</h3>
            <div className="mb-4 p-3 bg-brand-purple/5 rounded-lg border border-brand-purple/10">
              <p className="text-xs font-semibold text-brand-purple mb-1">Banner 1 — Latest Edition (fixed)</p>
              <p className="text-[11px] text-gray-500">This banner is generated automatically from the current magazine edition. It cannot be edited.</p>
            </div>
            {[2, 3].map((n) => (
              <div key={n} className="mb-4 last:mb-0">
                <p className="text-xs text-gray-500 font-semibold mb-2">Banner {n} — Editable</p>
                <div className="grid grid-cols-2 gap-3">
                  <input name={`banner${n}Image`} value={(form as any)[`banner${n}Image`]} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Banner image URL" />
                  <input name={`banner${n}Link`} value={(form as any)[`banner${n}Link`]} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Click-through URL" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-purple mb-4">Publish</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Publish Date</label>
                <input type="datetime-local" name="publishDate" value={form.publishDate} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Language</label>
                <select name="language" value={form.language} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-purple mb-4">Player Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Country</label>
                <input name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="e.g. United States" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Age</label>
                <input name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="e.g. 14" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Featured Image URL</label>
                <input name="featuredImage" value={form.featuredImage} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Photographer_Photographing_Nevada_Mountains.jpg/330px-Photographer_Photographing_Nevada_Mountains.jpg" />
              </div>
              {form.featuredImage && (
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                  <img src={form.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-purple mb-4">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
                <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="SEO title (optional)" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="SEO description (optional)" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-xl hover:bg-brand-purple-light transition-colors font-semibold disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : (isEdit ? 'Update Junior' : 'Create Junior')}
          </button>
        </div>
      </form>
    </div>
  );
}
