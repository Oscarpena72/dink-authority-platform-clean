"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, GripVertical, Save, X, ExternalLink } from 'lucide-react';

const COUNTRY_OPTIONS = [
  { value: 'central', label: 'Dink Central' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'mexico', label: 'México' },
  { value: 'canada', label: 'Canada' },
];

interface SponsorBanner {
  id: string;
  sponsorName: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  sortOrder: number;
  countries: string;
}

const emptyForm = {
  sponsorName: '',
  imageUrl: '',
  link: '',
  isActive: true,
  sortOrder: 0,
  countries: ['central'] as string[],
};

export default function AdminSponsorsClient() {
  const [sponsors, setSponsors] = useState<SponsorBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/sponsors?all=true');
      const data = await res.json();
      if (Array.isArray(data)) setSponsors(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchSponsors(); }, []);

  const openEdit = (s: SponsorBanner) => {
    setEditing(s.id);
    let countries: string[] = [];
    try { countries = JSON.parse(s.countries); } catch { countries = ['central']; }
    setForm({
      sponsorName: s.sponsorName,
      imageUrl: s.imageUrl,
      link: s.link,
      isActive: s.isActive,
      sortOrder: s.sortOrder,
      countries,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sortOrder: sponsors.length });
    setShowForm(true);
  };

  const toggleCountry = (val: string) => {
    setForm(prev => ({
      ...prev,
      countries: prev.countries.includes(val)
        ? prev.countries.filter(c => c !== val)
        : [...prev.countries, val],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      sponsorName: form.sponsorName,
      imageUrl: form.imageUrl,
      link: form.link,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
      countries: JSON.stringify(form.countries),
    };

    try {
      if (editing) {
        await fetch(`/api/sponsors/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        await fetch('/api/sponsors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      setShowForm(false);
      setEditing(null);
      await fetchSponsors();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este sponsor?')) return;
    await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
    await fetchSponsors();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Sponsor Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage advertising banners that appear across the site</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-purple/90 transition-colors"
        >
          <Plus size={16} /> Add Sponsor
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Sponsor' : 'New Sponsor'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor Name</label>
              <input
                value={form.sponsorName}
                onChange={e => setForm(p => ({ ...p, sponsorName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                placeholder="e.g. Coca-Cola"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                value={form.imageUrl}
                onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
              <input
                value={form.link}
                onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                placeholder="https://sponsor-website.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
              />
            </div>
          </div>

          {/* Preview */}
          {form.imageUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
              <div className="relative w-full max-w-[600px] h-[100px] bg-gray-100 rounded-lg overflow-hidden">
                <Image src={form.imageUrl} alt="Preview" fill className="object-cover" sizes="600px" />
              </div>
            </div>
          )}

          {/* Countries */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Visible in Regions</label>
            <div className="flex flex-wrap gap-3">
              {COUNTRY_OPTIONS.map(c => (
                <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.countries.includes(c.value)}
                    onChange={() => toggleCountry(c.value)}
                    className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                  />
                  <span className="text-sm text-gray-700">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Active</label>
            <button
              onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isActive ? 'bg-brand-purple' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                form.isActive ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.sponsorName || !form.imageUrl}
              className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-purple/90 transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : sponsors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No sponsor banners yet</p>
          <button onClick={openNew} className="text-brand-purple font-medium text-sm hover:underline">Add your first sponsor</button>
        </div>
      ) : (
        <div className="space-y-3">
          {sponsors.map((s) => {
            let countries: string[] = [];
            try { countries = JSON.parse(s.countries); } catch { countries = []; }
            return (
              <div key={s.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                <div className="relative w-24 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={s.imageUrl} alt={s.sponsorName} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{s.sponsorName}</span>
                    <span className={`inline-block w-2 h-2 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-400">#{s.sortOrder}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {countries.map(c => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 bg-brand-purple/10 text-brand-purple rounded-full">{c}</span>
                    ))}
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-0.5 hover:underline">
                        <ExternalLink size={10} /> Link
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="p-2 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
