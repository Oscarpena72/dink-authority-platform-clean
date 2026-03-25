"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Loader2, Globe, MessageCircle, Instagram, Facebook, Twitter, Youtube, Settings, LayoutPanelLeft, Eye, EyeOff } from 'lucide-react';

function SlotConfig({ slotNum, settings, onChange }: { slotNum: number; settings: Record<string, string>; onChange: (key: string, val: string) => void }) {
  const prefix = `sidebar_slot${slotNum}`;
  const enabled = settings?.[`${prefix}_enabled`] === 'true';
  const imageUrl = settings?.[`${prefix}_image`] ?? '';
  const link = settings?.[`${prefix}_link`] ?? '';
  const label = settings?.[`${prefix}_label`] ?? '';

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
          <input value={link} onChange={(e: any) => onChange(`${prefix}_link`, e?.target?.value ?? '')} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none text-sm" placeholder="https://..." />
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
