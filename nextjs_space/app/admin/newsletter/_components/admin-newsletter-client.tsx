"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Download, Loader2, Search, RefreshCw } from 'lucide-react';

interface Sub {
  id: string;
  email: string;
  source: string;
  isActive: boolean;
  subscribedAt: string;
}

const SOURCE_COLORS: Record<string, string> = {
  'homepage-newsletter': 'bg-blue-50 text-blue-600',
  'homepage': 'bg-blue-50 text-blue-600',
  'footer': 'bg-green-50 text-green-600',
  'article': 'bg-purple-50 text-purple-600',
  'magazine': 'bg-amber-50 text-amber-600',
};

export default function AdminNewsletterClient() {
  const [subscribers, setSubscribers] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      setSubscribers(data ?? []);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const exportCSV = () => {
    const a = document.createElement('a');
    a.href = '/api/newsletter?format=csv';
    a.download = 'newsletter_subscribers.csv';
    a.click();
  };

  const filtered = search.trim()
    ? subscribers.filter(s =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.source ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  const active = subscribers.filter(s => s.isActive).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Newsletter Subscribers</h1>
          <p className="text-sm text-brand-gray-dark mt-1">{subscribers.length} total · {active} active</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportCSV} disabled={subscribers.length === 0} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple/90 disabled:opacity-50">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Search by email or source..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400"><Loader2 size={24} className="animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  <Mail size={32} className="mx-auto mb-2 text-gray-300" />
                  {search ? 'No results.' : 'No subscribers yet.'}
                </td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-brand-purple">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${SOURCE_COLORS[s.source] ?? 'bg-gray-50 text-gray-600'}`}>
                        {s.source ?? 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
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
