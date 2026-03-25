"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Loader2, Globe, MessageCircle, Instagram, Facebook, Twitter, Youtube, Settings, LayoutPanelLeft, Eye, EyeOff, ExternalLink, MonitorSmartphone } from 'lucide-react';

function SlotConfig({ slotNum, settings, onChange }: { slotNum: number; settings: Record<string, string>; onChange: (key: string, val: string) => void }) {
  const prefix = `sidebar_slot${slotNum}`;
  const enabled = settings?.[`${prefix}_enabled`] === 'true';
  const imageUrl = settings?.[`${prefix}_image`] ?? '';
  const link = settings?.[`${prefix}_link`] ?? '';
  const label = settings?.[`${prefix}_label`] ?? '';
  const newTab = settings?.[`${prefix}_newtab`] === 'true';

  return (
    <div className={`rounded-lg border p-4 transition-all ${enabled ? 'border-brand-neon/40 bg-brand-neon/5' : 'border-gray-200 bg-gray-50/50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-brand-purple text-sm">Slot {slotNum} — Sponsor / Promo</h3>
        <button type="button" onClick={() => onChange(`${prefix}_enabled`, enabled ? 'false' : 'true')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${enabled ? 'bg-brand-neon/20 text-brand-purple' : 'bg-gray-200 text-brand-gray-dark'}`}>
          {enabled ? <><Eye size={12} /> Active</> : <><EyeOff size={12} /> Inactive</>}
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-brand-purple mb-1">Label (optional)</label>
          <input value={label} onChange={(e: any) => onChange(`${prefix}_label`, e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="e.g. Sponsored by JOOLA" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-purple mb-1">Image URL</label>
          <input value={imageUrl} onChange={(e: any) => onChange(`${prefix}_image`, e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://thumbs.dreamstime.com/b/sponsor-label-isolated-sign-158937500.jpg" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-purple mb-1">Link URL</label>
          <input value={link} onChange={(e: any) => onChange(`${prefix}_link`, e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://thumbs.dreamstime.com/b/sponsor-sticker-sponsor-rectangular-label-isolated-white-background-sponsor-sticker-sponsor-label-303039058.jpg" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onChange(`${prefix}_newtab`, newTab ? 'false' : 'true')}
            className={`relative w-9 h-5 rounded-full transition-colors ${newTab ? 'bg-brand-neon/60' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${newTab ? 'translate-x-4' : ''}`} />
          </button>
          <span className="text-xs text-brand-gray-dark flex items-center gap-1"><ExternalLink size={11} /> Open in new tab</span>
        </div>
        {imageUrl && (
          <div className="relative w-full aspect-[3/4] max-w-[200px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <Image src={imageUrl} alt={label || `Slot ${slotNum} preview`} fill className="object-contain" sizes="200px" onError={(e: any) => { if (e?.target) e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r: any) => r?.json?.()).then((d: any) => setSettings(d ?? {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((p: any) => ({ ...(p ?? {}), [key]: value }));
  };

  const handleSave = async () => {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save All
        </button>
      </div>
      {saved && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">Settings saved successfully!</div>}

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading font-bold text-brand-purple mb-4 flex items-center gap-2"><Settings size={18} /> General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">Site Name</label>
              <input value={settings?.site_name ?? ''} onChange={(e: any) => handleChange('site_name', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Dink Authority Magazine" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">Site Description</label>
              <input value={settings?.site_description ?? ''} onChange={(e: any) => handleChange('site_description', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="The Voice of Pickleball" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">Contact Email</label>
              <input value={settings?.contact_email ?? ''} onChange={(e: any) => handleChange('contact_email', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="info@dinkauthoritymagazine.com" />
            </div>
          </div>
        </div>

        {/* Article Sidebar */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading font-bold text-brand-purple mb-2 flex items-center gap-2"><LayoutPanelLeft size={18} /> Article Sidebar</h2>
          <p className="text-sm text-brand-gray-dark mb-4">Configure the sponsor/promo slots that appear in article pages. Slot 1 always shows the current magazine cover automatically.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SlotConfig slotNum={2} settings={settings} onChange={handleChange} />
            <SlotConfig slotNum={3} settings={settings} onChange={handleChange} />
          </div>
        </div>

        {/* Sticky Bottom Banner */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading font-bold text-brand-purple mb-2 flex items-center gap-2"><MonitorSmartphone size={18} /> Sticky Bottom Banner</h2>
          <p className="text-sm text-brand-gray-dark mb-4">A fixed advertising banner at the bottom of article pages. Desktop: 970×90px, Mobile: 320×100px.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-brand-purple">Banner Status</span>
              <button type="button" onClick={() => handleChange('sticky_banner_active', settings?.sticky_banner_active === 'true' ? 'false' : 'true')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${settings?.sticky_banner_active === 'true' ? 'bg-brand-neon/20 text-brand-purple' : 'bg-gray-200 text-brand-gray-dark'}`}>
                {settings?.sticky_banner_active === 'true' ? <><Eye size={12} /> Active</> : <><EyeOff size={12} /> Inactive</>}
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Desktop Image URL (970×90)</label>
              <input value={settings?.sticky_banner_image_desktop ?? ''} onChange={(e: any) => handleChange('sticky_banner_image_desktop', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://www.shutterstock.com/shutterstock/photos/1315572647/display_1500/stock-vector-download-this-elegant-banner-collection-ad-banner-templates-eps-file-easy-to-edit-vector-1315572647.jpg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Mobile Image URL (320×100)</label>
              <input value={settings?.sticky_banner_image_mobile ?? ''} onChange={(e: any) => handleChange('sticky_banner_image_mobile', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://d212k0qo5yzg53.cloudfront.net/wp-content/uploads/20170124173806/example-digital-mobile-mobile-expandable-sticky-banner-in-app-browser.jpg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-purple mb-1">Link URL</label>
              <input value={settings?.sticky_banner_link ?? ''} onChange={(e: any) => handleChange('sticky_banner_link', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://cdn.dribbble.com/userupload/15862528/file/still-204c62a4a723cad3714c83392255814d.png?format=webp&resize=400x300&vertical=center" />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleChange('sticky_banner_newtab', settings?.sticky_banner_newtab === 'true' ? 'false' : 'true')}
                  className={`relative w-9 h-5 rounded-full transition-colors ${settings?.sticky_banner_newtab === 'true' ? 'bg-brand-neon/60' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings?.sticky_banner_newtab === 'true' ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-xs text-brand-gray-dark flex items-center gap-1"><ExternalLink size={11} /> Open in new tab</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleChange('sticky_banner_close_enabled', settings?.sticky_banner_close_enabled === 'true' ? 'false' : 'true')}
                  className={`relative w-9 h-5 rounded-full transition-colors ${settings?.sticky_banner_close_enabled !== 'false' ? 'bg-brand-neon/60' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings?.sticky_banner_close_enabled !== 'false' ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-xs text-brand-gray-dark">Close button enabled</span>
              </div>
            </div>
            {(settings?.sticky_banner_image_desktop || settings?.sticky_banner_image_mobile) && (
              <div className="flex gap-4 flex-wrap">
                {settings?.sticky_banner_image_desktop && (
                  <div>
                    <p className="text-[10px] font-semibold text-brand-gray-dark mb-1">Desktop Preview</p>
                    <div className="relative w-[300px] h-[28px] rounded overflow-hidden bg-gray-100 border border-gray-200">
                      <Image src={settings.sticky_banner_image_desktop} alt="Desktop banner preview" fill className="object-cover" sizes="300px" onError={(e: any) => { if (e?.target) e.target.style.display = 'none'; }} />
                    </div>
                  </div>
                )}
                {settings?.sticky_banner_image_mobile && (
                  <div>
                    <p className="text-[10px] font-semibold text-brand-gray-dark mb-1">Mobile Preview</p>
                    <div className="relative w-[160px] h-[50px] rounded overflow-hidden bg-gray-100 border border-gray-200">
                      <Image src={settings.sticky_banner_image_mobile} alt="Mobile banner preview" fill className="object-cover" sizes="160px" onError={(e: any) => { if (e?.target) e.target.style.display = 'none'; }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading font-bold text-brand-purple mb-4 flex items-center gap-2"><MessageCircle size={18} /> WhatsApp</h2>
          <div>
            <label className="block text-sm font-semibold text-brand-purple mb-1">WhatsApp Number (international format, no +)</label>
            <input value={settings?.whatsapp_number ?? ''} onChange={(e: any) => handleChange('whatsapp_number', e?.target?.value ?? '')} className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="15551234567" />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading font-bold text-brand-purple mb-4 flex items-center gap-2"><Globe size={18} /> Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Instagram size={18} className="text-brand-gray-dark flex-shrink-0" />
              <input value={settings?.social_instagram ?? ''} onChange={(e: any) => handleChange('social_instagram', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Instagram URL" />
            </div>
            <div className="flex items-center gap-3">
              <Facebook size={18} className="text-brand-gray-dark flex-shrink-0" />
              <input value={settings?.social_facebook ?? ''} onChange={(e: any) => handleChange('social_facebook', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Facebook URL" />
            </div>
            <div className="flex items-center gap-3">
              <Twitter size={18} className="text-brand-gray-dark flex-shrink-0" />
              <input value={settings?.social_twitter ?? ''} onChange={(e: any) => handleChange('social_twitter', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Twitter/X URL" />
            </div>
            <div className="flex items-center gap-3">
              <Youtube size={18} className="text-brand-gray-dark flex-shrink-0" />
              <input value={settings?.social_youtube ?? ''} onChange={(e: any) => handleChange('social_youtube', e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="YouTube URL" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
