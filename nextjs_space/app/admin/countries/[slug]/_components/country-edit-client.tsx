"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Globe, BookOpen, Newspaper, Users, Trophy, Lightbulb, Image as ImageIcon, Share2, Search as SearchIcon } from 'lucide-react';

const SECTION_KEYS = ['newsBox', 'proPlayersBox', 'enthusiastsBox', 'juniorsBox', 'tipsBox'] as const;
const SECTION_LABELS: Record<string, { label: string; icon: any }> = {
  newsBox: { label: 'News', icon: Newspaper },
  proPlayersBox: { label: 'Pro Players', icon: Trophy },
  enthusiastsBox: { label: 'Enthusiasts', icon: Users },
  juniorsBox: { label: 'Juniors', icon: Users },
  tipsBox: { label: 'Tips', icon: Lightbulb },
};

export default function CountryEditClient({ slug }: { slug: string }) {
  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'magazine' | 'content' | 'banners' | 'social' | 'seo'>('magazine');

  useEffect(() => {
    fetch(`/api/countries/${slug}`).then(r => r.json()).then(d => {
      if (d && !d.error) setCountry(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleChange = (field: string, value: any) => {
    setCountry((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const res = await fetch(`/api/countries/${slug}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(country),
      });
      if (res.ok) setMsg('\u2705 Saved successfully!');
      else setMsg('\u274c Error saving');
    } catch { setMsg('\u274c Error saving'); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const getBoxItems = (key: string): string[] => {
    try { return JSON.parse(country?.[key] ?? '[]'); } catch { return []; }
  };
  const setBoxItems = (key: string, items: string[]) => {
    handleChange(key, JSON.stringify(items));
  };
  const getSocial = (): Record<string, string> => {
    try { return JSON.parse(country?.socialMedia ?? '{}'); } catch { return {}; }
  };
  const setSocial = (field: string, value: string) => {
    const s = getSocial();
    s[field] = value;
    handleChange('socialMedia', JSON.stringify(s));
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!country) return <div className="text-center py-12 text-red-500">Country not found</div>;

  const TABS = [
    { id: 'magazine' as const, label: '\ud83d\udcda Magazine', icon: BookOpen },
    { id: 'content' as const, label: '\ud83d\udcf0 Content Boxes', icon: Newspaper },
    { id: 'banners' as const, label: '\ud83d\uddbc\ufe0f Banners', icon: ImageIcon },
    { id: 'social' as const, label: '\ud83d\udcf1 Social Media', icon: Share2 },
    { id: 'seo' as const, label: '\ud83d\udd0d SEO', icon: SearchIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/countries" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-purple">{country.flagEmoji} {country.name}</h1>
            <p className="text-xs text-gray-400">/{country.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm">{msg}</span>}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white rounded-lg font-bold text-sm hover:bg-brand-purple-light transition-colors disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === tab.id ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-brand-purple'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Magazine Tab */}
      {activeTab === 'magazine' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-brand-purple">\ud83d\udcda Country Magazine Edition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Magazine Title</label>
              <input value={country.magazineTitle ?? ''} onChange={e => handleChange('magazineTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="Colombia Edition — Issue 1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cover Image URL</label>
              <input value={country.magazineCover ?? ''} onChange={e => handleChange('magazineCover', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://thecarycollection.com/cdn/shop/files/2025_12_22_10_46_03_001_580x@2x.jpg?v=1766428827" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">External Link</label>
              <input value={country.magazineLink ?? ''} onChange={e => handleChange('magazineLink', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">PDF URL</label>
              <input value={country.magazinePdfUrl ?? ''} onChange={e => handleChange('magazinePdfUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://..." />
            </div>
          </div>
        </div>
      )}

      {/* Content Boxes Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {SECTION_KEYS.map(key => {
            const info = SECTION_LABELS[key];
            const items = getBoxItems(key);
            return (
              <div key={key} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-brand-purple mb-3 flex items-center gap-2">
                  <info.icon size={16} /> {info.label}
                </h3>
                <p className="text-[10px] text-gray-400 mb-3">Paste article/tip/junior URLs, one per line. Example: /articles/my-article-slug</p>
                <textarea
                  value={items.join('\n')}
                  onChange={e => setBoxItems(key, e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm font-mono"
                  placeholder="/articles/example-slug\n/tips/example-tip\n/juniors/example-junior"
                />
                <p className="text-[10px] text-gray-400 mt-1">{items.filter(Boolean).length} items</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          {[
            { label: 'Top Banner', imgKey: 'bannerTopImage', linkKey: 'bannerTopLink' },
            { label: 'Middle Banner', imgKey: 'bannerMidImage', linkKey: 'bannerMidLink' },
            { label: 'Bottom Banner', imgKey: 'bannerBottomImage', linkKey: 'bannerBottomLink' },
            { label: 'Sticky Banner (Desktop)', imgKey: 'stickyBannerImage', linkKey: 'stickyBannerLink' },
            { label: 'Sticky Banner (Mobile)', imgKey: 'stickyBannerMobileImage', linkKey: 'stickyBannerLink' },
          ].map(b => (
            <div key={b.imgKey} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-brand-purple mb-3">{b.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                  <input value={country[b.imgKey] ?? ''} onChange={e => handleChange(b.imgKey, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Link URL</label>
                  <input value={country[b.linkKey] ?? ''} onChange={e => handleChange(b.linkKey, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-brand-purple">\ud83d\udcf1 Social Media for {country.name}</h2>
          {['instagram', 'facebook', 'tiktok', 'youtube', 'twitter'].map(platform => (
            <div key={platform}>
              <label className="block text-xs text-gray-500 mb-1 capitalize">{platform}</label>
              <input value={getSocial()[platform] ?? ''} onChange={e => setSocial(platform, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
                placeholder={`https://${platform}.com/...`} />
            </div>
          ))}
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-brand-purple">\ud83d\udd0d SEO Metadata</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
            <input value={country.metaTitle ?? ''} onChange={e => handleChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm"
              placeholder="Dink Authority Colombia | Pickleball News and Community" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
            <textarea value={country.metaDescription ?? ''} onChange={e => handleChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">OG Image URL</label>
            <input value={country.ogImage ?? ''} onChange={e => handleChange('ogImage', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
