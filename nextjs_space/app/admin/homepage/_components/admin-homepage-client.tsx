"use client";
import React, { useState, useEffect } from 'react';
import { Save, Loader2, Star, Image as ImageIcon } from 'lucide-react';

export default function AdminHomepageClient() {
  const [articles, setArticles] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/articles?status=published').then((r: any) => r?.json?.()),
      fetch('/api/settings').then((r: any) => r?.json?.()),
    ])
      .then(([arts, sets]: any[]) => { setArticles(arts ?? []); setSettings(sets ?? {}); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSetHero = async (articleId: string) => {
    try {
      await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHeroStory: true }),
      });
      setArticles((prev: any[]) => (prev ?? []).map((a: any) => ({ ...(a ?? {}), isHeroStory: a?.id === articleId })));
    } catch { /* empty */ }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* empty */ }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-brand-purple mb-6">Homepage Content</h1>

      {/* Ad Banner */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-heading font-bold text-brand-purple mb-4 flex items-center gap-2"><ImageIcon size={18} /> Ad Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-purple mb-1">Banner Image URL</label>
            <input value={settings?.ad_banner_image ?? ''} onChange={(e: any) => setSettings((p: any) => ({ ...(p ?? {}), ad_banner_image: e?.target?.value ?? '' }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Image URL" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-purple mb-1">Banner Link URL</label>
            <input value={settings?.ad_banner_link ?? ''} onChange={(e: any) => setSettings((p: any) => ({ ...(p ?? {}), ad_banner_link: e?.target?.value ?? '' }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="https://upload.wikimedia.org/wikipedia/commons/4/43/Standard_web_banner_ad_sizes.svg" />
          </div>
        </div>
        <button onClick={handleSaveSettings} disabled={saving} className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Banner
        </button>
        {saved && <p className="text-green-600 text-sm mt-2">Settings saved!</p>}
      </div>

      {/* Hero Story Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-heading font-bold text-brand-purple mb-4 flex items-center gap-2"><Star size={18} /> Hero Story</h2>
        <p className="text-sm text-brand-gray-dark mb-4">Select which published article should appear as the main hero story on the homepage.</p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(articles ?? []).map((a: any) => (
            <div key={a?.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${a?.isHeroStory ? 'bg-brand-purple/10 border-2 border-brand-purple' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`} onClick={() => handleSetHero(a?.id ?? '')}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${a?.isHeroStory ? 'border-brand-purple bg-brand-purple' : 'border-gray-300'}`}>
                {a?.isHeroStory && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-purple text-sm truncate">{a?.title ?? ''}</p>
                <p className="text-xs text-brand-gray-dark">{a?.category ?? ''}</p>
              </div>
              {a?.isHeroStory && <span className="px-2 py-0.5 bg-brand-neon text-brand-purple text-[10px] font-bold rounded">HERO</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
