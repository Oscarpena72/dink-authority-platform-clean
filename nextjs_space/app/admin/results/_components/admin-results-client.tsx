"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Pencil, Trash2, Save, X } from 'lucide-react';

interface ResultItem {
  id: string;
  tournamentName: string;
  division: string;
  winner: string;
  runnerUp: string;
  score: string | null;
  location: string | null;
  date: string;
  externalUrl: string | null;
}

const EMPTY_FORM = {
  tournamentName: '', division: 'Men\'s Singles', winner: '', runnerUp: '', score: '', location: '', date: '', externalUrl: '',
};

const DIVISIONS = ['Men\'s Singles', 'Women\'s Singles', 'Men\'s Doubles', 'Women\'s Doubles', 'Mixed Doubles'];

export default function AdminResultsClient() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/results').then(r => r.json()).then(d => { setResults(d ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingId ? `/api/results/${editingId}` : '/api/results';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        const updated = await fetch('/api/results').then(r => r.json());
        setResults(updated ?? []);
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    } catch { /* empty */ }
    setSaving(false);
  };

  const handleEdit = (result: ResultItem) => {
    setForm({
      tournamentName: result?.tournamentName ?? '',
      division: result?.division ?? '',
      winner: result?.winner ?? '',
      runnerUp: result?.runnerUp ?? '',
      score: result?.score ?? '',
      location: result?.location ?? '',
      date: result?.date ? new Date(result.date).toISOString().split('T')[0] : '',
      externalUrl: result?.externalUrl ?? '',
    });
    setEditingId(result?.id ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this result?')) return;
    await fetch(`/api/results/${id}`, { method: 'DELETE' });
    setResults(prev => (prev ?? []).filter(r => r?.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-brand-gray-dark">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy size={24} className="text-brand-accent" />
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Tournament Results</h1>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue-light text-sm">
          <Plus size={16} /> Add Result
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-purple mb-4">{editingId ? 'Edit Result' : 'New Result'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Tournament Name" value={form.tournamentName} onChange={e => setForm(p => ({ ...p, tournamentName: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
            <select value={form.division} onChange={e => setForm(p => ({ ...p, division: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none">
              {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input placeholder="Winner" value={form.winner} onChange={e => setForm(p => ({ ...p, winner: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
            <input placeholder="Runner-Up" value={form.runnerUp} onChange={e => setForm(p => ({ ...p, runnerUp: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
            <input placeholder="Score (e.g. 11-5, 11-7)" value={form.score} onChange={e => setForm(p => ({ ...p, score: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
            <input placeholder="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
            <input placeholder="External URL (optional)" value={form.externalUrl} onChange={e => setForm(p => ({ ...p, externalUrl: e?.target?.value ?? '' }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-blue focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue-light text-sm disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 text-sm">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {(results ?? []).length === 0 ? (
          <p className="p-8 text-center text-brand-gray-dark">No results yet. Add your first tournament result.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-brand-purple">Tournament</th>
                <th className="px-4 py-3 text-left font-bold text-brand-purple hidden md:table-cell">Division</th>
                <th className="px-4 py-3 text-left font-bold text-brand-purple">Winner</th>
                <th className="px-4 py-3 text-left font-bold text-brand-purple hidden md:table-cell">Score</th>
                <th className="px-4 py-3 text-left font-bold text-brand-purple hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-bold text-brand-purple">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(results ?? []).map((r: ResultItem) => (
                <tr key={r?.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r?.tournamentName ?? ''}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{r?.division ?? ''}</td>
                  <td className="px-4 py-3 font-bold text-brand-purple">{r?.winner ?? ''}</td>
                  <td className="px-4 py-3 font-mono hidden md:table-cell">{r?.score ?? '-'}</td>
                  <td className="px-4 py-3 text-brand-gray-dark hidden md:table-cell">{r?.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(r)} className="p-1.5 text-brand-blue hover:bg-brand-blue/10 rounded"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(r?.id ?? '')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
