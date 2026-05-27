"use client";
import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Sparkles, RefreshCw, Link2, Globe, Share2, Eye, EyeOff, Tag, Loader2, Check, AlertCircle } from 'lucide-react';

interface SeoSearchControlProps {
  form: any;
  setForm: (fn: (prev: any) => any) => void;
  isEdit: boolean;
  articleSlug?: string;
}

function charIndicator(len: number, min: number, max: number) {
  if (len === 0) return { color: 'text-gray-400', bg: 'bg-gray-100', label: 'Empty' };
  if (len < min) return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Too short' };
  if (len > max) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Too long' };
  return { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Good' };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-{2,}/g, '-');
}

export default function SeoSearchControl({ form, setForm, isEdit, articleSlug }: SeoSearchControlProps) {
  const [expanded, setExpanded] = useState(true);
  const [showOg, setShowOg] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [genSuccess, setGenSuccess] = useState(false);
  const [kwInput, setKwInput] = useState('');

  // Parse secondary keywords from JSON string
  const secondaryKws: string[] = (() => {
    try { return JSON.parse(form?.secondaryKeywords || '[]') || []; } catch { return []; }
  })();

  const seoTitle = form?.metaTitle || '';
  const seoDesc = form?.metaDescription || '';
  const slug = form?.slug || '';
  const titleIndicator = charIndicator(seoTitle.length, 30, 60);
  const descIndicator = charIndicator(seoDesc.length, 120, 160);

  // Google preview values
  const previewTitle = seoTitle || form?.title || 'Page Title';
  const previewDesc = seoDesc || form?.excerpt || 'Add a meta description to control how this article appears in search results.';
  const previewSlug = slug || articleSlug || slugify(form?.title || 'article-slug');
  const siteUrl = 'dinkauthoritymagazine.com';

  const handleFieldChange = useCallback((name: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  }, [setForm]);

  const handleGenerateSlug = () => {
    if (form?.title) {
      handleFieldChange('slug', slugify(form.title));
    }
  };

  const handleAddKeyword = () => {
    const kw = kwInput.trim();
    if (kw && !secondaryKws.includes(kw)) {
      const updated = [...secondaryKws, kw];
      handleFieldChange('secondaryKeywords', JSON.stringify(updated));
      setKwInput('');
    }
  };

  const handleRemoveKeyword = (idx: number) => {
    const updated = secondaryKws.filter((_: string, i: number) => i !== idx);
    handleFieldChange('secondaryKeywords', JSON.stringify(updated));
  };

  const handleGenerateSuggestions = async () => {
    setGenerating(true);
    setGenError('');
    setGenSuccess(false);
    try {
      const res = await fetch('/api/seo-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form?.title || '',
          excerpt: form?.excerpt || '',
          content: form?.content || '',
          category: form?.category || 'news',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to generate suggestions');
      }
      const suggestions = await res.json();
      setForm((prev: any) => ({
        ...prev,
        metaTitle: suggestions.seoTitle || prev.metaTitle,
        metaDescription: suggestions.seoDescription || prev.metaDescription,
        ogTitle: suggestions.ogTitle || prev.ogTitle,
        ogDescription: suggestions.ogDescription || prev.ogDescription,
        focusKeyword: suggestions.focusKeyword || prev.focusKeyword,
        secondaryKeywords: Array.isArray(suggestions.secondaryKeywords)
          ? JSON.stringify(suggestions.secondaryKeywords)
          : prev.secondaryKeywords,
        // Only suggest slug for new articles or if slug is empty
        ...(!isEdit || !prev.slug ? { slug: suggestions.slug || prev.slug } : {}),
      }));
      setGenSuccess(true);
      setShowOg(true);
      setShowKeywords(true);
      setTimeout(() => setGenSuccess(false), 3000);
    } catch (err: any) {
      setGenError(err?.message || 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-brand-purple" />
          <h3 className="font-heading font-bold text-brand-purple text-lg">SEO & Search Control</h3>
        </div>
        {expanded ? <ChevronUp size={20} className="text-brand-purple" /> : <ChevronDown size={20} className="text-brand-purple" />}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Generate SEO Suggestions Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateSuggestions}
              disabled={generating || !form?.title}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {generating ? (
                <Loader2 size={15} className="animate-spin" />
              ) : genSuccess ? (
                <Check size={15} />
              ) : (
                <Sparkles size={15} />
              )}
              {generating ? 'Generating…' : genSuccess ? 'Applied!' : 'Generate SEO Suggestions'}
            </button>
            {genError && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {genError}
              </span>
            )}
            {!form?.title && (
              <span className="text-xs text-gray-400">Add a title first</span>
            )}
          </div>

          {/* SEO Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-brand-purple">SEO Title</label>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${titleIndicator.bg} ${titleIndicator.color}`}>
                {seoTitle.length}/60 · {titleIndicator.label}
              </span>
            </div>
            <input
              name="metaTitle"
              value={seoTitle}
              onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 outline-none text-sm transition-all"
              placeholder="Custom title for search engines (leave empty to use article title)"
            />
            <p className="text-[11px] text-gray-400 mt-1">This title appears in Google results. Independent from the editorial title above.</p>
          </div>

          {/* SEO Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-brand-purple">SEO Description</label>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${descIndicator.bg} ${descIndicator.color}`}>
                {seoDesc.length}/160 · {descIndicator.label}
              </span>
            </div>
            <textarea
              name="metaDescription"
              value={seoDesc}
              onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 outline-none text-sm transition-all resize-none"
              placeholder="Compelling description for search results (leave empty to use excerpt)"
            />
            <p className="text-[11px] text-gray-400 mt-1">Independent from the excerpt. This is what appears under the title in Google.</p>
          </div>

          {/* URL Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-brand-purple flex items-center gap-1.5">
                <Link2 size={14} /> URL Slug
              </label>
              <button
                type="button"
                onClick={handleGenerateSlug}
                disabled={!form?.title}
                className="text-xs text-brand-purple hover:text-brand-neon transition-colors flex items-center gap-1 disabled:opacity-40"
              >
                <RefreshCw size={12} /> Auto-generate
              </button>
            </div>
            <div className="flex items-center gap-0 rounded-lg border border-gray-200 focus-within:border-brand-purple focus-within:ring-1 focus-within:ring-brand-purple/20 overflow-hidden transition-all">
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-2.5 border-r border-gray-200 whitespace-nowrap select-none">/news/</span>
              <input
                value={form?.slug || ''}
                onChange={(e) => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-{2,}/g, '-'))}
                className="flex-1 px-3 py-2.5 outline-none text-sm font-mono"
                placeholder={slugify(form?.title || 'article-url-slug')}
              />
            </div>
            {isEdit && articleSlug && (
              <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={11} />
                Changing the slug of a published article will break existing links. Use with caution.
              </p>
            )}
            {!isEdit && (
              <p className="text-[11px] text-gray-400 mt-1">Leave empty for auto-generated slug. Custom slugs help with SEO.</p>
            )}
          </div>

          {/* Google Search Preview */}
          <div>
            <label className="text-sm font-semibold text-brand-purple mb-2 block flex items-center gap-1.5">
              <Eye size={14} /> Google Search Preview
            </label>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="max-w-[600px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-brand-purple/10 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-brand-purple">D</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{siteUrl}</p>
                    <p className="text-[11px] text-gray-400 font-mono">…/{previewSlug}</p>
                  </div>
                </div>
                <h4 className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer font-normal" style={{ fontFamily: 'arial, sans-serif' }}>
                  {previewTitle.length > 60 ? previewTitle.slice(0, 57) + '...' : previewTitle}
                </h4>
                <p className="text-sm text-[#4d5156] leading-relaxed mt-0.5" style={{ fontFamily: 'arial, sans-serif' }}>
                  {previewDesc.length > 160 ? previewDesc.slice(0, 157) + '...' : previewDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* OG / Social Section (sub-collapsible) */}
          <div>
            <button
              type="button"
              onClick={() => setShowOg(!showOg)}
              className="flex items-center gap-2 text-sm font-semibold text-brand-purple hover:text-brand-purple-light transition-colors"
            >
              <Share2 size={14} />
              Social Media Overrides (Open Graph)
              {showOg ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showOg && (
              <div className="mt-3 space-y-4 pl-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">OG Title</label>
                    <span className="text-[11px] text-gray-400">{(form?.ogTitle || '').length}/60</span>
                  </div>
                  <input
                    value={form?.ogTitle || ''}
                    onChange={(e) => handleFieldChange('ogTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                    placeholder={seoTitle || form?.title || 'Falls back to SEO Title → Article Title'}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Used when shared on Facebook, WhatsApp, iMessage. Leave empty to use SEO Title.</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">OG Description</label>
                    <span className="text-[11px] text-gray-400">{(form?.ogDescription || '').length}/160</span>
                  </div>
                  <textarea
                    value={form?.ogDescription || ''}
                    onChange={(e) => handleFieldChange('ogDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm resize-none"
                    placeholder={seoDesc || form?.excerpt || 'Falls back to SEO Description → Excerpt'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Noindex Toggle */}
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => handleFieldChange('noindex', !form?.noindex)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                form?.noindex ? 'bg-red-400' : 'bg-emerald-400'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form?.noindex ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
            <div>
              <span className="text-sm font-semibold text-brand-purple flex items-center gap-1.5">
                {form?.noindex ? <EyeOff size={14} className="text-red-400" /> : <Eye size={14} className="text-emerald-500" />}
                {form?.noindex ? 'Hidden from Search Engines' : 'Visible to Search Engines'}
              </span>
              <p className="text-[11px] text-gray-400">Enable noindex to prevent this article from appearing in Google.</p>
            </div>
          </div>

          {/* Keywords Section (sub-collapsible) */}
          <div>
            <button
              type="button"
              onClick={() => setShowKeywords(!showKeywords)}
              className="flex items-center gap-2 text-sm font-semibold text-brand-purple hover:text-brand-purple-light transition-colors"
            >
              <Tag size={14} />
              Focus & Secondary Keywords
              {showKeywords ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showKeywords && (
              <div className="mt-3 space-y-4 pl-1">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Focus Keyword</label>
                  <input
                    value={form?.focusKeyword || ''}
                    onChange={(e) => handleFieldChange('focusKeyword', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                    placeholder="e.g., pickleball tournament results"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">The primary keyword this article should rank for.</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Secondary Keywords</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={kwInput}
                      onChange={(e) => setKwInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); } }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                      placeholder="Add a keyword and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      disabled={!kwInput.trim()}
                      className="px-3 py-2 bg-gray-100 text-brand-purple text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40"
                    >
                      Add
                    </button>
                  </div>
                  {secondaryKws.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {secondaryKws.map((kw: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-purple/5 text-brand-purple text-xs font-medium rounded-full"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(idx)}
                            className="text-brand-purple/40 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
