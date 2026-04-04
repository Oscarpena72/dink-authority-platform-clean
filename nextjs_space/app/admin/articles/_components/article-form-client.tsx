"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Loader2, Eye, Crosshair, RotateCcw, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ['news', 'tips', 'pro-players', 'juniors', 'enthusiasts', 'places', 'results', 'magazine', 'editorial'];

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
    videoPosterImage: article?.videoPosterImage ?? '',
    galleryImages: article?.galleryImages ?? '[]',
    socialMediaLink: article?.socialMediaLink ?? '',
    banner1Image: article?.banner1Image ?? '',
    banner1Link: article?.banner1Link ?? '',
    banner2Image: article?.banner2Image ?? '',
    banner2Link: article?.banner2Link ?? '',
    banner3Image: article?.banner3Image ?? '',
    banner3Link: article?.banner3Link ?? '',
    metaTitle: article?.metaTitle ?? '',
    metaDescription: article?.metaDescription ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(() => {
    try { return JSON.parse(article?.galleryImages ?? '[]') || []; } catch { return []; }
  });
  const [showSeo, setShowSeo] = useState(false);
  const [showBanners, setShowBanners] = useState(false);

  useEffect(() => {
    setForm((prev: any) => ({ ...prev, galleryImages: JSON.stringify(galleryUrls.filter(Boolean)) }));
  }, [galleryUrls]);

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
        setError(data?.error ?? 'Failed to save');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = () => {
    if (galleryUrls.length < 5) setGalleryUrls([...galleryUrls, '']);
  };
  const removeGalleryImage = (i: number) => setGalleryUrls(galleryUrls.filter((_: any, idx: number) => idx !== i));
  const updateGalleryImage = (i: number, val: string) => {
    const copy = [...galleryUrls];
    copy[i] = val;
    setGalleryUrls(copy);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/admin/articles')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-heading font-bold text-brand-purple">{isEdit ? 'Edit Article' : 'New Article'}</h1>
        {isEdit && article?.slug && (
          <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-sm text-brand-purple hover:text-brand-neon transition-colors"><Eye size={14} /> Preview</a>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-brand-purple text-lg">📝 Editorial</h3>
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Title</label>
                <input name="title" value={form?.title ?? ''} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Article title" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Excerpt</label>
                <textarea name="excerpt" value={form?.excerpt ?? ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Short description" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Content <span className="text-gray-400 text-xs font-normal">(HTML supported)</span></label>
                <textarea name="content" value={form?.content ?? ''} onChange={handleChange} rows={12} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none font-mono text-sm" placeholder="Article content..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Author</label>
                <input name="authorName" value={form?.authorName ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Author name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-purple mb-2">Category</label>
                  <select name="category" value={form?.category ?? 'news'} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none">
                    {CATEGORIES.map((c: string) => (
                      <option key={c} value={c}>{c.split('-').map((w: string) => (w?.[0]?.toUpperCase?.() ?? '') + (w?.slice?.(1) ?? '')).join(' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-purple mb-2">Status</label>
                  <select name="status" value={form?.status ?? 'draft'} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-brand-purple text-lg">🖼️ Media</h3>
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">Featured Image URL</label>
                <input name="imageUrl" value={form?.imageUrl ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Photographer_Photographing_Nevada_Mountains.jpg/1280px-Photographer_Photographing_Nevada_Mountains.jpg" />
                {form?.imageUrl && (
                  <div className="mt-3 space-y-2">
                    <div
                      className="relative rounded-lg overflow-hidden bg-gray-100 cursor-crosshair border-2 border-dashed border-gray-300 hover:border-brand-neon transition-colors"
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                        setForm((prev: any) => ({ ...prev, focalPointX: Math.max(0, Math.min(100, x)), focalPointY: Math.max(0, Math.min(100, y)) }));
                      }}
                    >
                      <img src={form.imageUrl} alt="Preview" className="w-full block" style={{ maxHeight: '250px', objectFit: 'contain' }} />
                      <div className="absolute w-8 h-8 -ml-4 -mt-4 pointer-events-none" style={{ left: `${form?.focalPointX ?? 50}%`, top: `${form?.focalPointY ?? 50}%` }}>
                        <div className="w-full h-full rounded-full border-2 border-white shadow-lg bg-brand-neon/40 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-brand-neon shadow" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-brand-gray-dark">Focal: {form?.focalPointX ?? 50}% × {form?.focalPointY ?? 50}%</p>
                      <button type="button" onClick={() => setForm((prev: any) => ({ ...prev, focalPointX: 50, focalPointY: 50 }))} className="flex items-center gap-1 text-[11px] text-brand-gray-dark hover:text-brand-purple"><RotateCcw size={12} /> Reset</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-brand-purple">Gallery Images <span className="text-gray-400 text-xs font-normal">(max 5)</span></label>
                  {galleryUrls.length < 5 && (
                    <button type="button" onClick={addGalleryImage} className="flex items-center gap-1 text-xs text-brand-purple hover:text-brand-neon"><Plus size={14} /> Add</button>
                  )}
                </div>
                {galleryUrls.map((url: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={url} onChange={(e) => updateGalleryImage(i, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder={`Gallery image ${i + 1} URL`} />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="p-2 text-red-400 hover:text-red-600"><X size={16} /></button>
                  </div>
                ))}
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">🎥 Video URL <span className="text-gray-400 text-xs font-normal">(YouTube, Instagram, TikTok, Facebook)</span></label>
                <input name="videoUrl" value={form?.videoUrl ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">🖼️ Video Poster Image <span className="text-gray-400 text-xs font-normal">(opcional)</span></label>
                <input name="videoPosterImage" value={form?.videoPosterImage ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://i.ytimg.com/vi/mxMBTPEryRY/maxresdefault.jpg" />
              </div>

              {/* Social Media Link */}
              <div>
                <label className="block text-sm font-semibold text-brand-purple mb-2">🔗 Social Media Link <span className="text-gray-400 text-xs font-normal">(opcional)</span></label>
                <input name="socialMediaLink" value={form?.socialMediaLink ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://instagram.com/p/..." />
              </div>
            </div>

            {/* SEO Section (collapsible) */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button type="button" onClick={() => setShowSeo(!showSeo)} className="w-full flex items-center justify-between p-6">
                <h3 className="font-heading font-bold text-brand-purple text-lg">🔍 SEO</h3>
                {showSeo ? <ChevronUp size={20} className="text-brand-purple" /> : <ChevronDown size={20} className="text-brand-purple" />}
              </button>
              {showSeo && (
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-purple mb-2">Meta Title</label>
                    <input name="metaTitle" value={form?.metaTitle ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Custom meta title (leave empty for auto)" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-purple mb-2">Meta Description</label>
                    <textarea name="metaDescription" value={form?.metaDescription ?? ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Custom meta description (leave empty for auto)" />
                  </div>
                </div>
              )}
            </div>

            {/* Inline Sponsor Banners (collapsible) */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button type="button" onClick={() => setShowBanners(!showBanners)} className="w-full flex items-center justify-between p-6">
                <h3 className="font-heading font-bold text-brand-purple text-lg">📢 Inline Sponsor Banners</h3>
                {showBanners ? <ChevronUp size={20} className="text-brand-purple" /> : <ChevronDown size={20} className="text-brand-purple" />}
              </button>
              {showBanners && (
                <div className="px-6 pb-6 space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <p className="text-sm font-semibold text-brand-purple">Banner {n}</p>
                      <input name={`banner${n}Image`} value={(form as any)?.[`banner${n}Image`] ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Banner image URL" />
                      <input name={`banner${n}Link`} value={(form as any)?.[`banner${n}Link`] ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Banner link URL" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visibility */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-brand-purple text-lg">👁️ Visibility</h3>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isHeroStory" checked={form?.isHeroStory ?? false} onChange={handleChange} id="isHeroStory" className="rounded" />
                <label htmlFor="isHeroStory" className="text-sm text-brand-purple">Hero Article (Homepage Hero)</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" checked={form?.isFeatured ?? false} onChange={handleChange} id="isFeatured" className="rounded" />
                <label htmlFor="isFeatured" className="text-sm text-brand-purple">Featured Article (Homepage Featured)</label>
              </div>
              <p className="text-xs text-gray-400">If neither is checked, the article appears as Regular.</p>
            </div>

            {/* Save Button */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button type="submit" disabled={saving} className="w-full py-3 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Article'}
              </button>
            </div>

            {/* Image Previews */}
            {form?.imageUrl && (
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
                <h3 className="font-heading font-bold text-brand-purple text-sm">Image Previews</h3>
                <div>
                  <p className="text-[11px] font-semibold text-brand-purple mb-1">Card (4:3)</p>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.imageUrl} alt="Card preview" className="w-full h-full object-cover" style={{ objectPosition: `${form?.focalPointX ?? 50}% ${form?.focalPointY ?? 50}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-brand-purple mb-1">Hero (16:9)</p>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.imageUrl} alt="Hero preview" className="w-full h-full object-cover" style={{ objectPosition: `${form?.focalPointX ?? 50}% ${form?.focalPointY ?? 50}%` }} />
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
