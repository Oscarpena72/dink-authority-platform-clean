"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2, Calendar } from 'lucide-react';

export default function AdminEventsClient() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', startDate: '', endDate: '', externalUrl: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/events').then((r: any) => r?.json?.()).then((d: any) => setEvents(d ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: any) => {
    setForm((p: any) => ({ ...(p ?? {}), [e?.target?.name ?? '']: e?.target?.value ?? '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/events/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const updated = await res.json();
        setEvents((prev: any[]) => (prev ?? []).map((e: any) => e?.id === editing ? updated : e));
      } else {
        const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const created = await res.json();
        setEvents((prev: any[]) => [...(prev ?? []), created]);
      }
      setEditing(null);
      setShowNew(false);
      setForm({ name: '', location: '', startDate: '', endDate: '', externalUrl: '', description: '' });
    } catch { /* empty */ }
    setSaving(false);
  };

  const handleEdit = (event: any) => {
    setEditing(event?.id ?? null);
    setForm({
      name: event?.name ?? '',
      location: event?.location ?? '',
      startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      externalUrl: event?.externalUrl ?? '',
      description: event?.description ?? '',
    });
    setShowNew(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' }).catch(() => {});
    setEvents((prev: any[]) => (prev ?? []).filter((e: any) => e?.id !== id));
  };

  const handleCancel = () => {
    setEditing(null);
    setShowNew(false);
    setForm({ name: '', location: '', startDate: '', endDate: '', externalUrl: '', description: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Events</h1>
        {!showNew && (
          <button onClick={() => { setShowNew(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
            <Plus size={16} /> New Event
          </button>
        )}
      </div>

      {showNew && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-heading font-bold text-brand-purple mb-4">{editing ? 'Edit Event' : 'New Event'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">Event Name</label>
              <input name="name" value={form?.name ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="Event name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">Location</label>
              <input name="location" value={form?.location ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="City, State" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">Start Date</label>
              <input type="date" name="startDate" value={form?.startDate ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-1">End Date</label>
              <input type="date" name="endDate" value={form?.endDate ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-brand-purple mb-1">External URL</label>
              <input name="externalUrl" value={form?.externalUrl ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-brand-purple mb-1">Description</label>
              <textarea name="description" value={form?.description ?? ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-brand-purple outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-brand-purple rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>
      ) : (events ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl"><p className="text-brand-gray-dark">No events yet.</p></div>
      ) : (
        <div className="space-y-3">
          {(events ?? []).map((event: any) => (
            <div key={event?.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-brand-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-purple">{event?.name ?? ''}</p>
                <p className="text-sm text-brand-gray-dark">{event?.location ?? ''} · {event?.startDate ? new Date(event.startDate).toLocaleDateString() : ''}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(event)} className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(event?.id ?? '')} className="p-2 hover:bg-red-50 rounded text-brand-gray-dark hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
