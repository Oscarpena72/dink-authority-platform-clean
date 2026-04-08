"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Save, X, ExternalLink, Upload, GripVertical, Eye, EyeOff } from 'lucide-react';

/* ───────── types ───────── */
interface FooterPartner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface NavLink {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
}

type Tab = 'partners' | 'branding' | 'navigation' | 'contact' | 'subscribe';

const TABS: { key: Tab; label: string }[] = [
  { key: 'partners', label: 'Sponsors / Partners' },
  { key: 'branding', label: 'Branding' },
  { key: 'navigation', label: 'Navigation Links' },
  { key: 'contact', label: 'Contact' },
  { key: 'subscribe', label: 'Stay Connected' },
];

const emptyPartnerForm = { name: '', logoUrl: '', websiteUrl: '', isActive: true, sortOrder: 0 };

export default function AdminFooterPartnersClient() {
  const [activeTab, setActiveTab] = useState<Tab>('partners');

  /* ── Partners state ── */
  const [partners, setPartners] = useState<FooterPartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ ...emptyPartnerForm });
  const [savingPartner, setSavingPartner] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Settings state (branding, contact, subscribe, nav links) ── */
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [branding, setBranding] = useState({ title: 'DINK AUTHORITY', subtitle: 'Magazine', description: '' });
  const [contact, setContact] = useState({ email: 'contact@dinkauthoritymagazine.com', isActive: true });
  const [subscribe, setSubscribe] = useState({ title: 'Stay Connected', subtitle: 'Get updates, new editions & event alerts.' });
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkForm, setLinkForm] = useState({ label: '', url: '', sortOrder: 0, isActive: true });

  /* ───────── Fetch partners ───────── */
  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/footer-partners?all=true');
      const data = await res.json();
      if (Array.isArray(data)) setPartners(data);
    } catch { /* ignore */ }
    setLoadingPartners(false);
  };

  /* ───────── Fetch settings ───────── */
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const s: Record<string, string> = await res.json();
      setBranding({
        title: s.footer_brand_title ?? 'DINK AUTHORITY',
        subtitle: s.footer_brand_subtitle ?? 'Magazine',
        description: s.footer_brand_description ?? '',
      });
      setContact({
        email: s.footer_contact_email ?? 'contact@dinkauthoritymagazine.com',
        isActive: s.footer_contact_active !== 'false',
      });
      setSubscribe({
        title: s.footer_subscribe_title ?? 'Stay Connected',
        subtitle: s.footer_subscribe_subtitle ?? 'Get updates, new editions & event alerts.',
      });
      try {
        const parsed = JSON.parse(s.footer_nav_links || '[]');
        if (Array.isArray(parsed)) setNavLinks(parsed);
      } catch {
        setNavLinks([]);
      }
    } catch { /* ignore */ }
    setLoadingSettings(false);
  };

  useEffect(() => {
    fetchPartners();
    fetchSettings();
  }, []);

  /* ───────── Save settings helper ───────── */
  const saveSettings = async (payload: Record<string, string>) => {
    setSavingSettings(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed.');
    }
    setSavingSettings(false);
  };

  /* ───────── Partner handlers ───────── */
  const openEditPartner = (p: FooterPartner) => {
    setEditingPartner(p.id);
    setPartnerForm({ name: p.name, logoUrl: p.logoUrl, websiteUrl: p.websiteUrl || '', isActive: p.isActive, sortOrder: p.sortOrder });
    setShowPartnerForm(true);
  };

  const openNewPartner = () => {
    setEditingPartner(null);
    const maxOrder = partners.length > 0 ? Math.max(...partners.map(p => p.sortOrder)) : -1;
    setPartnerForm({ ...emptyPartnerForm, sortOrder: maxOrder + 1 });
    setShowPartnerForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/direct', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setPartnerForm(prev => ({ ...prev, logoUrl: url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed.');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSavePartner = async () => {
    if (!partnerForm.name.trim() || !partnerForm.logoUrl.trim()) { alert('Name and Logo are required.'); return; }
    setSavingPartner(true);
    try {
      const payload = { name: partnerForm.name.trim(), logoUrl: partnerForm.logoUrl.trim(), websiteUrl: partnerForm.websiteUrl.trim() || null, isActive: partnerForm.isActive, sortOrder: Number(partnerForm.sortOrder) || 0 };
      if (editingPartner) {
        await fetch(`/api/footer-partners/${editingPartner}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch('/api/footer-partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setShowPartnerForm(false);
      setEditingPartner(null);
      await fetchPartners();
    } catch { alert('Save failed.'); }
    setSavingPartner(false);
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try { await fetch(`/api/footer-partners/${id}`, { method: 'DELETE' }); await fetchPartners(); } catch { /* ignore */ }
  };

  /* ───────── Nav link handlers ───────── */
  const openNewLink = () => {
    setEditingLink(null);
    const maxOrder = navLinks.length > 0 ? Math.max(...navLinks.map(l => l.sortOrder)) : -1;
    setLinkForm({ label: '', url: '', sortOrder: maxOrder + 1, isActive: true });
    setShowLinkForm(true);
  };

  const openEditLink = (link: NavLink) => {
    setEditingLink(link.id);
    setLinkForm({ label: link.label, url: link.url, sortOrder: link.sortOrder, isActive: link.isActive });
    setShowLinkForm(true);
  };

  const handleSaveLink = async () => {
    if (!linkForm.label.trim() || !linkForm.url.trim()) { alert('Label and URL are required.'); return; }
    let updated: NavLink[];
    if (editingLink) {
      updated = navLinks.map(l => l.id === editingLink ? { ...l, label: linkForm.label.trim(), url: linkForm.url.trim(), sortOrder: linkForm.sortOrder, isActive: linkForm.isActive } : l);
    } else {
      const newLink: NavLink = { id: Date.now().toString(), label: linkForm.label.trim(), url: linkForm.url.trim(), sortOrder: linkForm.sortOrder, isActive: linkForm.isActive };
      updated = [...navLinks, newLink];
    }
    updated.sort((a, b) => a.sortOrder - b.sortOrder);
    setNavLinks(updated);
    setShowLinkForm(false);
    setEditingLink(null);
    await saveSettings({ footer_nav_links: JSON.stringify(updated) });
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    const updated = navLinks.filter(l => l.id !== id);
    setNavLinks(updated);
    await saveSettings({ footer_nav_links: JSON.stringify(updated) });
  };

  /* ───────── loading ───────── */
  const loading = loadingPartners || loadingSettings;
  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Footer Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all footer content from a single place — partners, branding, navigation, contact & subscribe section.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-brand-purple shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════ TAB: Partners ═══════ */}
      {activeTab === 'partners' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Manage the sponsor & partner logos shown in the website footer.</p>
            <button onClick={openNewPartner} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-medium">
              <Plus size={16} /> Add Partner
            </button>
          </div>

          {showPartnerForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">{editingPartner ? 'Edit Partner' : 'New Partner'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                  <input type="text" value={partnerForm.name} onChange={e => setPartnerForm(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="e.g. JOOLA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (optional)</label>
                  <input type="url" value={partnerForm.websiteUrl} onChange={e => setPartnerForm(prev => ({ ...prev, websiteUrl: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="https://example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo *</label>
                  <div className="flex items-center gap-4">
                    {partnerForm.logoUrl && (
                      <div className="relative h-16 w-32 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                        <Image src={partnerForm.logoUrl} alt="Logo preview" fill className="object-contain" unoptimized />
                      </div>
                    )}
                    <div className="flex-1">
                      <input type="url" value={partnerForm.logoUrl} onChange={e => setPartnerForm(prev => ({ ...prev, logoUrl: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple mb-2" placeholder="Logo URL or upload below" />
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 text-xs text-brand-purple hover:underline font-medium">
                        <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload logo'}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Recommended: transparent PNG, white or light logo for dark footer background.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={partnerForm.sortOrder} onChange={e => setPartnerForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={partnerForm.isActive} onChange={e => setPartnerForm(prev => ({ ...prev, isActive: e.target.checked }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-purple" />
                  </label>
                  <span className="text-sm text-gray-700">Active</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <button onClick={handleSavePartner} disabled={savingPartner} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50">
                  <Save size={16} /> {savingPartner ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setShowPartnerForm(false); setEditingPartner(null); }} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2 text-sm">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {partners.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No footer partners yet.</p>
              <button onClick={openNewPartner} className="text-brand-purple hover:underline text-sm font-medium">Add your first partner</button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Order</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Logo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">URL</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {partners.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 w-16"><div className="flex items-center gap-1"><GripVertical size={14} className="text-gray-300" />{p.sortOrder}</div></td>
                      <td className="px-4 py-3"><div className="relative h-10 w-24 bg-gray-900 rounded overflow-hidden flex items-center justify-center p-1"><Image src={p.logoUrl} alt={p.name} fill className="object-contain" unoptimized /></div></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                        {p.websiteUrl ? (
                          <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-purple hover:underline"><ExternalLink size={12} />{(() => { try { return new URL(p.websiteUrl).hostname; } catch { return p.websiteUrl; } })()}</a>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center"><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditPartner(p)} className="p-1.5 text-gray-400 hover:text-brand-purple transition-colors" title="Edit"><Pencil size={15} /></button>
                          <button onClick={() => handleDeletePartner(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════ TAB: Branding ═══════ */}
      {activeTab === 'branding' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-1">Footer Branding</h2>
          <p className="text-sm text-gray-500 mb-6">Edit the brand block shown at the left side of the footer.</p>
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Title</label>
              <input type="text" value={branding.title} onChange={e => setBranding(prev => ({ ...prev, title: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="DINK AUTHORITY" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Subtitle</label>
              <input type="text" value={branding.subtitle} onChange={e => setBranding(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Magazine" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={branding.description} onChange={e => setBranding(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="A short description of the brand..." />
              <p className="text-xs text-gray-400 mt-1">If empty, the default i18n description is used.</p>
            </div>
          </div>
          {/* Preview */}
          <div className="mt-6 p-5 bg-brand-purple rounded-xl">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Preview</p>
            <h3 className="font-heading font-bold text-2xl text-white mb-1">{branding.title || 'DINK AUTHORITY'}<span className="text-brand-neon">.</span></h3>
            <p className="text-brand-neon text-xs font-bold uppercase tracking-[0.2em] mb-3">{branding.subtitle || 'Magazine'}</p>
            {branding.description && <p className="text-white/50 text-sm leading-relaxed">{branding.description}</p>}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => saveSettings({ footer_brand_title: branding.title, footer_brand_subtitle: branding.subtitle, footer_brand_description: branding.description })}
              disabled={savingSettings}
              className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50"
            >
              <Save size={16} /> {savingSettings ? 'Saving...' : 'Save Branding'}
            </button>
          </div>
        </div>
      )}

      {/* ═══════ TAB: Navigation Links ═══════ */}
      {activeTab === 'navigation' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Edit the navigation links displayed in the footer.</p>
            <button onClick={openNewLink} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-medium">
              <Plus size={16} /> Add Link
            </button>
          </div>

          {showLinkForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">{editingLink ? 'Edit Link' : 'New Link'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                  <input type="text" value={linkForm.label} onChange={e => setLinkForm(prev => ({ ...prev, label: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="e.g. News" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input type="text" value={linkForm.url} onChange={e => setLinkForm(prev => ({ ...prev, url: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="/articles?category=news" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={linkForm.sortOrder} onChange={e => setLinkForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={linkForm.isActive} onChange={e => setLinkForm(prev => ({ ...prev, isActive: e.target.checked }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-purple" />
                  </label>
                  <span className="text-sm text-gray-700">Active</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <button onClick={handleSaveLink} disabled={savingSettings} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50">
                  <Save size={16} /> {savingSettings ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setShowLinkForm(false); setEditingLink(null); }} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2 text-sm">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {navLinks.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No custom navigation links yet. Default i18n links will be used.</p>
              <button onClick={openNewLink} className="text-brand-purple hover:underline text-sm font-medium">Add your first link</button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Order</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Label</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">URL</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {navLinks.map(link => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 w-16"><div className="flex items-center gap-1"><GripVertical size={14} className="text-gray-300" />{link.sortOrder}</div></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{link.label}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{link.url}</td>
                      <td className="px-4 py-3 text-center"><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${link.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{link.isActive ? 'Active' : 'Hidden'}</span></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditLink(link)} className="p-1.5 text-gray-400 hover:text-brand-purple transition-colors" title="Edit"><Pencil size={15} /></button>
                          <button onClick={() => handleDeleteLink(link.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════ TAB: Contact ═══════ */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-1">Contact Information</h2>
          <p className="text-sm text-gray-500 mb-6">Configure the contact email displayed in the footer.</p>
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={contact.email} onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="contact@dinkauthoritymagazine.com" />
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={contact.isActive} onChange={e => setContact(prev => ({ ...prev, isActive: e.target.checked }))} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-purple" />
              </label>
              <span className="text-sm text-gray-700">Show email in footer</span>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => saveSettings({ footer_contact_email: contact.email, footer_contact_active: String(contact.isActive) })}
              disabled={savingSettings}
              className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50"
            >
              <Save size={16} /> {savingSettings ? 'Saving...' : 'Save Contact'}
            </button>
          </div>
        </div>
      )}

      {/* ═══════ TAB: Stay Connected ═══════ */}
      {activeTab === 'subscribe' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-1">Stay Connected Section</h2>
          <p className="text-sm text-gray-500 mb-6">Customize the title and subtitle of the subscribe block in the footer.</p>
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={subscribe.title} onChange={e => setSubscribe(prev => ({ ...prev, title: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Stay Connected" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={subscribe.subtitle} onChange={e => setSubscribe(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Get updates, new editions & event alerts." />
            </div>
          </div>
          {/* Preview */}
          <div className="mt-6 p-5 bg-brand-purple rounded-xl">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Preview</p>
            <h3 className="font-heading font-bold text-white mb-1 uppercase text-sm tracking-wider">{subscribe.title || 'Stay Connected'}</h3>
            <p className="text-white/50 text-sm">{subscribe.subtitle || 'Get updates, new editions & event alerts.'}</p>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => saveSettings({ footer_subscribe_title: subscribe.title, footer_subscribe_subtitle: subscribe.subtitle })}
              disabled={savingSettings}
              className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50"
            >
              <Save size={16} /> {savingSettings ? 'Saving...' : 'Save Subscribe Text'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
