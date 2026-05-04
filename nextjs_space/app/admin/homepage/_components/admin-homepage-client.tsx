"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Star, Image as ImageIcon, Link2, Zap, ChevronDown, Eye, ArrowRight, FileText, Globe, Calendar, Tag, Type, AlignLeft, MousePointer } from 'lucide-react';
import Image from 'next/image';

const HERO_LINK_TYPES = [
  { value: 'article', label: 'Article', icon: FileText },
  { value: 'section', label: 'Section', icon: Globe },
  { value: 'magazine', label: 'Magazine Edition', icon: FileText },
  { value: 'custom', label: 'Custom URL', icon: Link2 },
] as const;

const SECTION_OPTIONS = [
  { value: '/players?category=pro-players', label: 'Pro Players' },
  { value: '/players?category=juniors', label: 'Juniors' },
  { value: '/tips', label: 'Tips' },
  { value: '/players?category=enthusiasts', label: 'Enthusiasts' },
  { value: '/news?category=results', label: 'Results' },
  { value: '/news?category=events', label: 'Events' },
  { value: '/places', label: 'Places' },
  { value: '/magazine', label: 'Magazine' },
  { value: '/shop', label: 'Shop' },
  { value: '/news', label: 'News & Editorial' },
  { value: '/community', label: 'Community' },
];

interface HeroSettings {
  hero_mode: string;
  hero_image_url: string;
  hero_label: string;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_url: string;
  hero_button2_text: string;
  hero_button2_url: string;
  hero_link_type: string;
  hero_article_id: string;
  hero_section_path: string;
  hero_magazine_id: string;
  hero_custom_url: string;
  hero_focal_x: string;
  hero_focal_y: string;
  [key: string]: string;
}

const EMPTY_HERO: HeroSettings = {
  hero_mode: 'article',
  hero_image_url: '',
  hero_label: '',
  hero_title: '',
  hero_subtitle: '',
  hero_button_text: 'Read Full Story',
  hero_button_url: '',
  hero_button2_text: '',
  hero_button2_url: '',
  hero_link_type: 'article',
  hero_article_id: '',
  hero_section_path: '',
  hero_magazine_id: '',
  hero_custom_url: '',
  hero_focal_x: '50',
  hero_focal_y: '50',
};

export default function AdminHomepageClient() {
  const [articles, setArticles] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [allSettings, setAllSettings] = useState<Record<string, string>>({});
  const [hero, setHero] = useState<HeroSettings>({ ...EMPTY_HERO });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bannerSettings, setBannerSettings] = useState<Record<string, string>>({});
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerSaved, setBannerSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/articles?status=published').then((r) => r?.json?.()),
      fetch('/api/settings').then((r) => r?.json?.()),
      fetch('/api/magazine').then((r) => r?.json?.()),
    ])
      .then(([arts, sets, mags]) => {
        setArticles(arts ?? []);
        setEditions(mags ?? []);
        const s = sets ?? {};
        setAllSettings(s);
        setBannerSettings({ ad_banner_image: s.ad_banner_image ?? '', ad_banner_link: s.ad_banner_link ?? '' });
        // Populate hero from settings
        const h: HeroSettings = { ...EMPTY_HERO };
        for (const key of Object.keys(EMPTY_HERO)) {
          if (s[key] !== undefined && s[key] !== '') h[key] = s[key];
        }
        setHero(h);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateHero = useCallback((key: string, value: string) => {
    setHero((p) => ({ ...p, [key]: value }));
  }, []);

  // When link type changes, auto-derive button_url
  const getResolvedUrl = useCallback(() => {
    const lt = hero.hero_link_type;
    if (lt === 'article' && hero.hero_article_id) {
      const art = articles.find((a: any) => a?.id === hero.hero_article_id);
      return art ? `/news/${art.slug}` : '';
    }
    if (lt === 'section') return hero.hero_section_path;
    if (lt === 'magazine' && hero.hero_magazine_id) {
      const ed = editions.find((e: any) => e?.id === hero.hero_magazine_id);
      return ed?.slug ? `/magazine/${ed.slug}` : '/magazine';
    }
    if (lt === 'custom') return hero.hero_custom_url;
    return '';
  }, [hero, articles, editions]);

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      // Auto-set hero_button_url from resolved URL
      const resolvedUrl = getResolvedUrl();
      const toSave: Record<string, string> = {};
      for (const key of Object.keys(EMPTY_HERO)) {
        toSave[key] = hero[key] ?? '';
      }
      toSave.hero_button_url = resolvedUrl || hero.hero_button_url;

      // If mode is 'article' and link_type is 'article', also set isHeroStory on selected article
      if (hero.hero_mode === 'article' && hero.hero_link_type === 'article' && hero.hero_article_id) {
        try {
          await fetch(`/api/articles/${hero.hero_article_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isHeroStory: true }),
          });
          setArticles((prev) => prev.map((a: any) => ({ ...a, isHeroStory: a?.id === hero.hero_article_id })));
        } catch { /* */ }
      }

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* */ }
    setSaving(false);
  };

  const handleSaveBanner = async () => {
    setBannerSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerSettings),
      });
      setBannerSaved(true);
      setTimeout(() => setBannerSaved(false), 3000);
    } catch { /* */ }
    setBannerSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>;

  const resolvedUrl = getResolvedUrl();
  const isCustomMode = hero.hero_mode === 'custom';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-brand-purple">Homepage Content</h1>

      {/* Ad Banner Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-heading font-bold text-brand-purple mb-4 flex items-center gap-2"><ImageIcon size={18} /> Ad Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-purple mb-1">Banner Image URL</label>
            <input value={bannerSettings?.ad_banner_image ?? ''} onChange={(e) => setBannerSettings((p) => ({ ...p, ad_banner_image: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Image URL" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-purple mb-1">Banner Link URL</label>
            <input value={bannerSettings?.ad_banner_link ?? ''} onChange={(e) => setBannerSettings((p) => ({ ...p, ad_banner_link: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://kinsta.com/wp-content/uploads/2020/05/examples-of-banner-advertisements-1-1.png" />
          </div>
        </div>
        <button onClick={handleSaveBanner} disabled={bannerSaving} className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
          {bannerSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Banner
        </button>
        {bannerSaved && <p className="text-green-600 text-sm mt-2">✅ Banner saved!</p>}
      </div>

      {/* ===== HERO STORY MODULE ===== */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-bold text-brand-purple text-lg flex items-center gap-2"><Star size={18} className="text-brand-neon" /> Hero Story — Editorial Module</h2>
          <p className="text-sm text-brand-gray-dark mt-1">Configure the main hero section of the homepage. Choose between an article or custom editorial content.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-3">
            {[
              { key: 'article', label: '📰 From Article', desc: 'Use a published article as hero' },
              { key: 'custom', label: '✨ Custom Editorial', desc: 'Full control: image, text, link destination' },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => updateHero('hero_mode', m.key)}
                className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                  hero.hero_mode === m.key
                    ? 'border-brand-purple bg-brand-purple/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-brand-purple text-sm">{m.label}</div>
                <div className="text-xs text-brand-gray-dark mt-1">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* ===== ARTICLE MODE ===== */}
          {!isCustomMode && (
            <div className="space-y-4">
              <h3 className="font-bold text-brand-purple text-sm flex items-center gap-2"><FileText size={14} /> Select Hero Article</h3>
              <div className="space-y-2 max-h-72 overflow-y-auto border border-gray-100 rounded-lg p-2">
                {articles.map((a: any) => (
                  <div
                    key={a?.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      hero.hero_article_id === a?.id
                        ? 'bg-brand-purple/10 border-2 border-brand-purple'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => {
                      updateHero('hero_article_id', a?.id ?? '');
                      updateHero('hero_link_type', 'article');
                    }}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${hero.hero_article_id === a?.id ? 'border-brand-purple bg-brand-purple' : 'border-gray-300'}`}>
                      {hero.hero_article_id === a?.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-purple text-sm truncate">{a?.title ?? ''}</p>
                      <p className="text-xs text-brand-gray-dark">{a?.category ?? ''}</p>
                    </div>
                    {hero.hero_article_id === a?.id && <span className="px-2 py-0.5 bg-brand-neon text-brand-purple text-[10px] font-bold rounded">HERO</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CUSTOM EDITORIAL MODE ===== */}
          {isCustomMode && (
            <div className="space-y-6">
              {/* Hero Content Fields */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-brand-purple text-sm flex items-center gap-2"><Type size={14} /> Hero Content</h3>
                
                {/* Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><ImageIcon size={12} /> Hero Image URL</label>
                  <input
                    value={hero.hero_image_url}
                    onChange={(e) => updateHero('hero_image_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                    placeholder="https://... (paste image URL)"
                  />
                  {hero.hero_image_url && (
                    <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-gray-200 max-w-md">
                      <Image src={hero.hero_image_url} alt="Hero preview" fill className="object-cover" sizes="400px" />
                    </div>
                  )}
                </div>

                {/* Focal Point */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1">Focal Point X (%)</label>
                    <input
                      type="number" min="0" max="100"
                      value={hero.hero_focal_x}
                      onChange={(e) => updateHero('hero_focal_x', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1">Focal Point Y (%)</label>
                    <input
                      type="number" min="0" max="100"
                      value={hero.hero_focal_y}
                      onChange={(e) => updateHero('hero_focal_y', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><Tag size={12} /> Label / Category</label>
                  <input
                    value={hero.hero_label}
                    onChange={(e) => updateHero('hero_label', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                    placeholder="e.g. CHAMPIONS, EXCLUSIVE, BREAKING"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><Type size={12} /> Title</label>
                  <input
                    value={hero.hero_title}
                    onChange={(e) => updateHero('hero_title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm font-bold"
                    placeholder="THE KINGS OF NAPLES"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><AlignLeft size={12} /> Subtitle</label>
                  <textarea
                    value={hero.hero_subtitle}
                    onChange={(e) => updateHero('hero_subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm resize-none"
                    rows={2}
                    placeholder="US Open Pickleball 2026 Champions"
                  />
                </div>

                {/* Button Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><MousePointer size={12} /> Button Text</label>
                    <input
                      value={hero.hero_button_text}
                      onChange={(e) => updateHero('hero_button_text', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                      placeholder="Read Full Story"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><MousePointer size={12} /> Secondary Button Text <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      value={hero.hero_button2_text}
                      onChange={(e) => updateHero('hero_button2_text', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                      placeholder="View Magazine"
                    />
                  </div>
                </div>
                {hero.hero_button2_text && (
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1 flex items-center gap-1"><Link2 size={12} /> Secondary Button URL</label>
                    <input
                      value={hero.hero_button2_url}
                      onChange={(e) => updateHero('hero_button2_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                      placeholder="/magazine or https://..."
                    />
                  </div>
                )}
              </div>

              {/* Link Destination */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-brand-purple text-sm flex items-center gap-2"><Link2 size={14} /> Link Destination</h3>
                <p className="text-xs text-brand-gray-dark">Where should the hero button take the user?</p>

                {/* Link Type Selector */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {HERO_LINK_TYPES.map((lt) => {
                    const Icon = lt.icon;
                    return (
                      <button
                        key={lt.value}
                        onClick={() => updateHero('hero_link_type', lt.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all text-sm ${
                          hero.hero_link_type === lt.value
                            ? 'border-brand-purple bg-brand-purple/5 font-bold text-brand-purple'
                            : 'border-gray-200 hover:border-gray-300 text-brand-gray-dark'
                        }`}
                      >
                        <Icon size={14} />
                        {lt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Conditional fields based on link type */}
                {hero.hero_link_type === 'article' && (
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1">Select Article</label>
                    <select
                      value={hero.hero_article_id}
                      onChange={(e) => updateHero('hero_article_id', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm bg-white"
                    >
                      <option value="">— Choose an article —</option>
                      {articles.map((a: any) => (
                        <option key={a?.id} value={a?.id}>{a?.title} ({a?.category})</option>
                      ))}
                    </select>
                  </div>
                )}

                {hero.hero_link_type === 'section' && (
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1">Select Section</label>
                    <select
                      value={hero.hero_section_path}
                      onChange={(e) => updateHero('hero_section_path', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm bg-white"
                    >
                      <option value="">— Choose a section —</option>
                      {SECTION_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {hero.hero_link_type === 'magazine' && (
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1">Select Magazine Edition</label>
                    <select
                      value={hero.hero_magazine_id}
                      onChange={(e) => updateHero('hero_magazine_id', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm bg-white"
                    >
                      <option value="">— Choose an edition —</option>
                      {editions.map((ed: any) => (
                        <option key={ed?.id} value={ed?.id}>{ed?.title} {ed?.issueNumber ? `(#${ed.issueNumber})` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}

                {hero.hero_link_type === 'custom' && (
                  <div>
                    <label className="block text-xs font-semibold text-brand-purple mb-1">Custom URL</label>
                    <input
                      value={hero.hero_custom_url}
                      onChange={(e) => updateHero('hero_custom_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                      placeholder="/pro-players or https://example.com/page"
                    />
                  </div>
                )}

                {/* Resolved URL Preview */}
                {resolvedUrl && (
                  <div className="flex items-center gap-2 bg-brand-purple/5 px-3 py-2 rounded-lg">
                    <Link2 size={14} className="text-brand-purple" />
                    <span className="text-xs text-brand-purple font-medium">Destination:</span>
                    <code className="text-xs text-brand-neon bg-brand-purple-dark px-2 py-0.5 rounded">{resolvedUrl}</code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live Preview */}
          {isCustomMode && hero.hero_image_url && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Eye size={14} className="text-brand-purple" />
                <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Live Preview</span>
              </div>
              <div className="relative aspect-[16/9] bg-brand-purple-dark overflow-hidden">
                <Image
                  src={hero.hero_image_url}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                  style={{ objectPosition: `${hero.hero_focal_x ?? 50}% ${hero.hero_focal_y ?? 50}%` }}
                  sizes="800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-dark via-brand-purple-dark/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="max-w-xl">
                    {hero.hero_label && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-neon text-brand-purple-dark text-[10px] font-bold uppercase tracking-widest rounded mb-3">
                        <Zap size={10} className="fill-current" />
                        {hero.hero_label}
                      </span>
                    )}
                    {hero.hero_title && (
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight mb-2">
                        {hero.hero_title}
                      </h2>
                    )}
                    {hero.hero_subtitle && (
                      <p className="text-white/75 text-sm mb-3">{hero.hero_subtitle}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {hero.hero_button_text && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg text-xs uppercase tracking-wider">
                          {hero.hero_button_text} <ArrowRight size={12} />
                        </span>
                      )}
                      {hero.hero_button2_text && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-white/40 text-white font-bold rounded-lg text-xs uppercase tracking-wider">
                          {hero.hero_button2_text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveHero}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors font-bold disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Hero Configuration
            </button>
            {saved && <span className="text-green-600 font-semibold text-sm">✅ Hero saved successfully!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
