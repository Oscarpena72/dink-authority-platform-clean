"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Loader2, Eye } from 'lucide-react';

const CATEGORIES = ['news', 'pro-players', 'enthusiasts', 'results', 'events', 'gear', 'magazine', 'latam'];

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
    category: article?.category ?? 'news',
    status: article?.status ?? 'draft',
    isFeatured: article?.isFeatured ?? false,
    isHeroStory: article?.isHeroStory ?? false,
    authorName: article?.authorName ?? '',
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
              <div className="mt-3 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
