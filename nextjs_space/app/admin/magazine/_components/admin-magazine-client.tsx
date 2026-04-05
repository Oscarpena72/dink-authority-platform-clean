"use client";
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Save, X, Star, Upload, FileText, ExternalLink, Image as ImageIcon, Settings } from 'lucide-react';
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
  countries: string;
}

interface CountryOption {
  key: string;
  label: string;
}

const BUILT_IN_COUNTRIES: CountryOption[] = [
  { key: 'central', label: 'Dink Central (Main Site)' },
];

const EMPTY_FORM = {
  title: '', issueNumber: '', coverUrl: '', description: '', externalUrl: '', pdfUrl: '', pdfCloudPath: '', pdfPageCount: '', isCurrent: false, publishDate: '', countries: ['central'] as string[],
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

  // Banner settings
  const [showBanner, setShowBanner] = useState(false);
  const [bannerForm, setBannerForm] = useState({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '' });
  const [savingBanner, setSavingBanner] = useState(false);

  // Hero settings
  const [showHero, setShowHero] = useState(false);
  const [heroForm, setHeroForm] = useState({ headline: '', description: '', buttonText: '', buttonLink: '', backgroundWord: '', backgroundImage: '', enabled: 'true' });
  const [savingHero, setSavingHero] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  // Dynamic country list from DB
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>(BUILT_IN_COUNTRIES);

  useEffect(() => {
    fetch('/api/magazine').then(r => r.json()).then(d => { setEditions(d ?? []); setLoading(false); }).catch(() => setLoading(false));

    // Fetch countries from DB
    fetch('/api/countries').then(r => r.json()).then((countries: any[]) => {
      const dbCountries = (countries ?? []).filter((c: any) => c?.isActive).map((c: any) => ({
        key: c.slug,
        label: `Dink ${c.name}`,
      }));
      setCountryOptions([...BUILT_IN_COUNTRIES, ...dbCountries]);
    }).catch(() => {});

    // Fetch banner + hero settings
    fetch('/api/settings').then(r => r.json()).then((s: any) => {
      setBannerForm({
        image: s?.magazine_banner_image ?? '',
        title: s?.magazine_banner_title ?? '',
        subtitle: s?.magazine_banner_subtitle ?? '',
        buttonText: s?.magazine_banner_button_text ?? '',
        buttonLink: s?.magazine_banner_button_link ?? '',
      });
      setHeroForm({
        headline: s?.magazine_hero_headline ?? '',
        description: s?.magazine_hero_description ?? '',
        buttonText: s?.magazine_hero_button_text ?? '',
        buttonLink: s?.magazine_hero_button_link ?? '',
        backgroundWord: s?.magazine_hero_background_word ?? '',
        backgroundImage: s?.magazine_hero_background_image ?? '',
        enabled: s?.magazine_hero_enabled ?? 'true',
      });
    }).catch(() => {});
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Please select a PDF file'); return; }

    setUploading(true);
    setUploadProgress('Getting upload URL...');

    try {
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: 'application/pdf', isPublic: false }),
      });
      const { uploadUrl, cloud_storage_path } = await presignedRes.json();

      setUploadProgress('Uploading PDF...');

      const url = new URL(uploadUrl);
      const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders') ?? '';
      const headers: Record<string, string> = { 'Content-Type': 'application/pdf' };
      if (signedHeaders.includes('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers, body: file });
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

  const toggleCountry = (key: string) => {
    setForm(p => {
      const current = p.countries ?? [];
      return { ...p, countries: current.includes(key) ? current.filter(c => c !== key) : [...current, key] };
    });
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
    let parsedCountries: string[] = ['central'];
    try { parsedCountries = JSON.parse(ed?.countries || '["central"]'); } catch {}
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
      countries: parsedCountries,
    });
    setEditingId(ed?.id ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this edition?')) return;
    await fetch(`/api/magazine/${id}`, { method: 'DELETE' });
    setEditions(prev => (prev ?? []).filter(e => e?.id !== id));
  };

  const handleSaveBanner = async () => {
    setSavingBanner(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazine_banner_image: bannerForm.image,
          magazine_banner_title: bannerForm.title,
          magazine_banner_subtitle: bannerForm.subtitle,
          magazine_banner_button_text: bannerForm.buttonText,
          magazine_banner_button_link: bannerForm.buttonLink,
        }),
      });
    } catch { /* empty */ }
    setSavingBanner(false);
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazine_hero_headline: heroForm.headline,
          magazine_hero_description: heroForm.description,
          magazine_hero_button_text: heroForm.buttonText,
          magazine_hero_button_link: heroForm.buttonLink,
          magazine_hero_background_word: heroForm.backgroundWord,
          magazine_hero_background_image: heroForm.backgroundImage,
          magazine_hero_enabled: heroForm.enabled,
        }),
      });
    } catch { /* empty */ }
    setSavingHero(false);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroImage(true);
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
      setHeroForm(prev => ({ ...prev, backgroundImage: publicUrl }));
    } catch (err) {
      console.error('Hero image upload failed:', err);
      alert('Upload failed. Please try again.');
    }
    setUploadingHeroImage(false);
    if (heroImageInputRef.current) heroImageInputRef.current.value = '';
  };

  const parseCountries = (c: string): string[] => {
    try { return JSON.parse(c || '[]'); } catch { return []; }
  };

  if (loading) return <div className="p-8 text-center text-brand-gray-dark">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-brand-neon" />
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Magazine Editions</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setShowHero(!showHero); setShowBanner(false); }} className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg text-sm ${showHero ? 'bg-brand-neon text-brand-purple-dark' : 'bg-brand-purple text-white hover:bg-brand-purple-light'}`}>
            <Settings size={16} /> Hero
          </button>
          <button onClick={() => { setShowBanner(!showBanner); setShowHero(false); }} className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg text-sm ${showBanner ? 'bg-brand-neon text-brand-purple-dark' : 'bg-brand-purple text-white hover:bg-brand-purple-light'}`}>
            <ImageIcon size={16} /> Banner
          </button>
          <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim text-sm">
            <Plus size={16} /> Add Edition
          </button>
        </div>
      </div>

      {/* Hero Settings */}
      {showHero && (
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-purple mb-1 flex items-center gap-2">
            <Settings size={18} /> Magazine Hero Settings
          </h2>
          <p className="text-xs text-brand-gray-dark mb-4">Configure the hero section that appears at the top of the Magazine page.</p>

          {/* Enable/Disable toggle */}
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={heroForm.enabled === 'true'}
                onChange={e => setHeroForm(p => ({ ...p, enabled: e.target.checked ? 'true' : 'false' }))}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-brand-neon transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm font-semibold text-brand-purple">
              Hero {heroForm.enabled === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Headline</label>
              <input
                placeholder="e.g. Subscribe to Dink Authority Magazine"
                value={heroForm.headline}
                onChange={e => setHeroForm(p => ({ ...p, headline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Background Word (large typography)</label>
              <input
                placeholder="e.g. Pickleball Magazine"
                value={heroForm.backgroundWord}
                onChange={e => setHeroForm(p => ({ ...p, backgroundWord: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-purple mb-1">Description / Subheadline</label>
              <textarea
                placeholder="e.g. Browse all editions of Dink Authority Magazine. Click any cover to read online."
                value={heroForm.description}
                onChange={e => setHeroForm(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Button Text</label>
              <input
                placeholder="e.g. Subscribe Now"
                value={heroForm.buttonText}
                onChange={e => setHeroForm(p => ({ ...p, buttonText: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Button Link</label>
              <input
                placeholder="e.g. https://stripe.com/..."
                value={heroForm.buttonLink}
                onChange={e => setHeroForm(p => ({ ...p, buttonLink: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none"
              />
            </div>
          </div>

          {/* Hero Background Image */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-brand-purple mb-1">Hero Background Image</label>
            <div className="flex items-center gap-3">
              <input
                placeholder="Image URL (or upload below)"
                value={heroForm.backgroundImage}
                onChange={e => setHeroForm(p => ({ ...p, backgroundImage: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none"
              />
              <input ref={heroImageInputRef} type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
              <button
                onClick={() => heroImageInputRef.current?.click()}
                disabled={uploadingHeroImage}
                className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white font-medium rounded-lg hover:bg-brand-purple-light text-sm disabled:opacity-50 whitespace-nowrap"
              >
                <Upload size={14} /> {uploadingHeroImage ? 'Uploading...' : 'Upload'}
              </button>
              {heroForm.backgroundImage && (
                <button
                  onClick={() => setHeroForm(p => ({ ...p, backgroundImage: '' }))}
                  className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 text-sm"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            {heroForm.backgroundImage && (
              <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroForm.backgroundImage} alt="Hero background preview" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Recommended: 1400×400px or wider. This image will be the hero section background. Leave empty for the default purple background.</p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSaveHero} disabled={savingHero} className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim text-sm disabled:opacity-50">
              <Save size={16} /> {savingHero ? 'Saving...' : 'Save Hero'}
            </button>
            <button onClick={() => setShowHero(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 text-sm">
              <X size={16} /> Close
            </button>
          </div>
        </div>
      )}

      {/* Banner Settings */}
      {showBanner && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-purple mb-4 flex items-center gap-2">
            <ImageIcon size={18} /> Subscription Banner Settings
          </h2>
          <p className="text-xs text-brand-gray-dark mb-4">This banner appears at the top of the /magazine page. Configure the image, text, and Stripe link.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Banner Image URL" value={bannerForm.image} onChange={e => setBannerForm(p => ({ ...p, image: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Button Link (e.g. Stripe URL)" value={bannerForm.buttonLink} onChange={e => setBannerForm(p => ({ ...p, buttonLink: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Banner Title" value={bannerForm.title} onChange={e => setBannerForm(p => ({ ...p, title: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Banner Subtitle" value={bannerForm.subtitle} onChange={e => setBannerForm(p => ({ ...p, subtitle: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
            <input placeholder="Button Text (e.g. Subscribe Now)" value={bannerForm.buttonText} onChange={e => setBannerForm(p => ({ ...p, buttonText: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSaveBanner} disabled={savingBanner} className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim text-sm disabled:opacity-50">
              <Save size={16} /> {savingBanner ? 'Saving...' : 'Save Banner'}
            </button>
            <button onClick={() => setShowBanner(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 text-sm">
              <X size={16} /> Close
            </button>
          </div>
        </div>
      )}

      {/* Edition Form */}
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

          {/* Country visibility checkboxes */}
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <span className="font-semibold text-sm text-brand-purple block mb-2">🌍 Show on these sites:</span>
            <div className="flex flex-wrap gap-4">
              {countryOptions.map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(form.countries ?? []).includes(opt.key)}
                    onChange={() => toggleCountry(opt.key)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-neon focus:ring-brand-neon"
                  />
                  <span className="text-sm font-medium text-brand-purple">{opt.label}</span>
                </label>
              ))}
            </div>
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

      {/* Editions list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(editions ?? []).length === 0 ? (
          <p className="col-span-full p-8 text-center text-brand-gray-dark bg-white rounded-xl border border-gray-200">No editions yet. Add your first magazine edition.</p>
        ) : (
          (editions ?? []).map((ed: EditionItem) => {
            const edCountries = parseCountries(ed?.countries);
            return (
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
                {/* Country tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {edCountries.map(c => (
                    <span key={c} className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-[10px] font-bold rounded uppercase">
                      {c === 'central' ? '🌐 Central' : `🏳️ ${c}`}
                    </span>
                  ))}
                </div>
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
            );
          })
        )}
      </div>
    </div>
  );
}
