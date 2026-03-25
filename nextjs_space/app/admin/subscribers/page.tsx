"use client";
import React, { useEffect, useState } from 'react';
import { Download, Users, Search, RefreshCw } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  phoneNumber: string | null;
  source: string;
  subscribedAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const exportCSV = () => {
    const a = document.createElement('a');
    a.href = '/api/subscribers?format=csv';
    a.download = 'subscribers.csv';
    a.click();
  };

  const filtered = search.trim()
    ? subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.phoneNumber ?? '').includes(search) ||
        s.source.toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple">Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total subscriber{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSubscribers} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple/90 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email, phone, or source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  <Users size={32} className="mx-auto mb-2 text-gray-300" />
                  {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                </td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-brand-purple">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phoneNumber ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        s.source === 'article'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-green-50 text-green-600'
                      }`}>
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
