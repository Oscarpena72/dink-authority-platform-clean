"use client";
import React, { useEffect, useState } from 'react';
import { Download, Users, Search, RefreshCw, Upload, CheckCircle, Loader2 } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  source: string;
  subscribedAt: string;
}

const SOURCE_COLORS: Record<string, string> = {
  'footer': 'bg-green-50 text-green-600',
  'article': 'bg-purple-50 text-purple-600',
  'magazine': 'bg-amber-50 text-amber-600',
  'homepage': 'bg-blue-50 text-blue-600',
  'popup': 'bg-pink-50 text-pink-600',
};

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const syncToBrevo = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/brevo/sync', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data.message || 'Sync complete.');
    } catch {
      setSyncResult('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const exportCSV = () => {
    const a = document.createElement('a');
    a.href = '/api/subscribers?format=csv';
    a.download = 'subscribers.csv';
    a.click();
  };

  const filtered = search.trim()
    ? subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (s.phoneNumber ?? '').includes(search) ||
        s.source.toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple">Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total subscriber{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSubscribers} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={syncToBrevo}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple text-sm font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            title="Sync all subscribers to Brevo"
          >
            {syncing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {syncing ? 'Syncing...' : 'Sync to Brevo'}
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple/90 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {syncResult && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={16} className="text-green-500 shrink-0" />
          <p className="text-sm text-green-800">{syncResult}</p>
          <button onClick={() => setSyncResult(null)} className="ml-auto text-green-400 hover:text-green-600 text-lg leading-none">&times;</button>
        </div>
      )}

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  <Users size={32} className="mx-auto mb-2 text-gray-300" />
                  {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                </td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-700">{s.name ?? '\u2014'}</td>
                    <td className="px-4 py-3 font-medium text-brand-purple">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.phoneNumber ?? '\u2014'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${SOURCE_COLORS[s.source] ?? 'bg-gray-50 text-gray-600'}`}>
                        {s.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(s.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
