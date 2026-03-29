"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Loader2, Eye, Crosshair, RotateCcw } from 'lucide-react';

const CATEGORIES = ['news', 'pro-players', 'enthusiasts', 'results', 'events', 'gear', 'tips', 'places', 'editorial', 'magazine', 'latam'];

interface ArticleFormProps {
  article?: any;
}

export default function ArticleFormClient({ article }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!article;
  const [form, setForm] = useState({
    title: article?.title ?? '',
    content: article?.content ?? '',
    excerpt: article?.excerpt ?? '',
    imageUrl: article?.imageUrl ?? '',
    focalPointX: article?.focalPointX ?? 50,
    focalPointY: article?.focalPointY ?? 50,
    category: article?.category ?? 'news',
    status: article?.status ?? 'draft',
    isFeatured: article?.isFeatured ?? false,
    isHeroStory: article?.isHeroStory ?? false,
    authorName: article?.authorName ?? '',
    videoUrl: article?.videoUrl ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e?.target ?? {};
    setForm((prev: any) => ({ ...(prev ?? {}), [name ?? '']: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/articles/${article?.id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? 'Failed to save article');
      }
    } catch {
      setError('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-heading font-bold text-brand-purple">
          {isEdit ? 'Edit Article' : 'New Article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Title</label>
            <input name="title" value={form?.title ?? ''} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-lg font-heading" placeholder="Article title..." />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Content (HTML supported)</label>
            <textarea name="content" value={form?.content ?? ''} onChange={handleChange} rows={20} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none font-mono text-sm" placeholder="Write your article content here... HTML tags are supported." />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-brand-purple mb-2">Excerpt</label>
            <textarea name="excerpt" value={form?.excerpt ?? ''} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Short summary for previews..." />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-brand-purple mb-4">Publish</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Status</label>
                <select name="status" value={form?.status ?? 'draft'} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Category</label>
                <select name="category" value={form?.category ?? 'news'} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none">
                  {CATEGORIES.map((c: string) => (
                    <option key={c} value={c}>{c.split('-').map((w: string) => (w?.[0]?.toUpperCase?.() ?? '') + (w?.slice?.(1) ?? '')).join(' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Author Name</label>
                <input name="authorName" value={form?.authorName ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Author name" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">🎥 Video URL <span className="text-gray-400 text-xs font-normal">(YouTube, Instagram, TikTok, Facebook)</span></label>
                <input name="videoUrl" value={form?.videoUrl ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..." />
                <p className="text-[10px] text-gray-400 mt-1">Platform is auto-detected from the URL</p>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" checked={form?.isFeatured ?? false} onChange={handleChange} id="isFeatured" className="rounded" />
                <label htmlFor="isFeatured" className="text-sm text-brand-purple">Featured Article</label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="isHeroStory" checked={form?.isHeroStory ?? false} onChange={handleChange} id="isHeroStory" className="rounded" />
                <label htmlFor="isHeroStory" className="text-sm text-brand-purple">Hero Story (Homepage)</label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <button type="submit" disabled={saving} className="w-full mt-6 py-3 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-brand-purple mb-4">Featured Image</h3>
            <input name="imageUrl" value={form?.imageUrl ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Image URL" />
            {form?.imageUrl && (
              <div className="mt-4 space-y-3">
                {/* Focal Point Picker */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple">
                    <Crosshair size={14} className="text-brand-neon" />
                    Focal Point — click on image
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((prev: any) => ({ ...prev, focalPointX: 50, focalPointY: 50 }))}
                    className="flex items-center gap-1 text-[11px] text-brand-gray-dark hover:text-brand-purple transition-colors"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
                <div
                  className="relative rounded-lg overflow-hidden bg-gray-100 cursor-crosshair border-2 border-dashed border-gray-300 hover:border-brand-neon transition-colors"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    setForm((prev: any) => ({ ...prev, focalPointX: Math.max(0, Math.min(100, x)), focalPointY: Math.max(0, Math.min(100, y)) }));
                  }}
                >
                  <img src={form.imageUrl} alt="Preview" className="w-full block" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                  {/* Focal point indicator */}
                  <div
                    className="absolute w-8 h-8 -ml-4 -mt-4 pointer-events-none"
                    style={{ left: `${form?.focalPointX ?? 50}%`, top: `${form?.focalPointY ?? 50}%` }}
                  >
                    <div className="w-full h-full rounded-full border-2 border-white shadow-lg bg-brand-neon/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-brand-neon shadow" />
                    </div>
                    {/* Crosshair lines */}
                    <div className="absolute left-1/2 top-0 w-px h-full bg-white/60 -translate-x-1/2 pointer-events-none" style={{ height: '200%', top: '-50%' }} />
                    <div className="absolute top-1/2 left-0 h-px w-full bg-white/60 -translate-y-1/2 pointer-events-none" style={{ width: '200%', left: '-50%' }} />
                  </div>
                </div>
                <p className="text-[11px] text-brand-gray-dark text-center">
                  Focal: {form?.focalPointX ?? 50}% × {form?.focalPointY ?? 50}%
                </p>

                {/* Preview: Card 4:3 */}
                <div>
                  <p className="text-[11px] font-semibold text-brand-purple mb-1">Card Preview (4:3)</p>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.imageUrl} alt="Card preview" className="w-full h-full object-cover" style={{ objectPosition: `${form?.focalPointX ?? 50}% ${form?.focalPointY ?? 50}%` }} />
                  </div>
                </div>

                {/* Preview: Hero 16:9 */}
                <div>
                  <p className="text-[11px] font-semibold text-brand-purple mb-1">Hero Preview (16:9)</p>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.imageUrl} alt="Hero preview" className="w-full h-full object-cover" style={{ objectPosition: `${form?.focalPointX ?? 50}% ${form?.focalPointY ?? 50}%` }} />
                  </div>
                </div>

                {/* Preview: Social 1200x630 */}
                <div>
                  <p className="text-[11px] font-semibold text-brand-purple mb-1">Social Preview (1200×630)</p>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '1200/630' }}>
                    <img src={form.imageUrl} alt="Social preview" className="w-full h-full object-cover" style={{ objectPosition: `${form?.focalPointX ?? 50}% ${form?.focalPointY ?? 50}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
