"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Download, Search, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  'new': 'bg-blue-100 text-blue-700',
  'read': 'bg-gray-100 text-gray-600',
  'replied': 'bg-green-100 text-green-700',
  'archived': 'bg-yellow-100 text-yellow-700',
};

const SOURCE_COLORS: Record<string, string> = {
  'contact-form': 'bg-indigo-50 text-indigo-600',
  'popup': 'bg-pink-50 text-pink-600',
  'other': 'bg-gray-50 text-gray-600',
};

export default function AdminContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setContacts(data ?? []);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const exportCSV = () => {
    const a = document.createElement('a');
    a.href = '/api/contact?format=csv';
    a.download = 'contacts.csv';
    a.click();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch { /* empty */ }
  };

  const filtered = search.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.subject ?? '').toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  const newCount = contacts.filter(c => c.status === 'new').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Contact Submissions</h1>
          <p className="text-sm text-brand-gray-dark mt-1">{contacts.length} total {newCount > 0 && <span className="text-blue-600 font-semibold">· {newCount} new</span>}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportCSV} disabled={contacts.length === 0} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple/90 disabled:opacity-50">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Search by name, email, subject, or message..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400">{search ? 'No results.' : 'No contact submissions yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className={`bg-white rounded-xl border ${c.status === 'new' ? 'border-blue-200' : 'border-gray-200'} overflow-hidden`}>
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50"
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-brand-purple">{c.name}</span>
                    <span className="text-gray-400 text-xs">{c.email}</span>
                    {c.phone && <span className="text-gray-400 text-xs">· {c.phone}</span>}
                  </div>
                  {c.subject && <p className="text-sm text-gray-600 mt-0.5">{c.subject}</p>}
                  {expandedId !== c.id && <p className="text-xs text-gray-400 mt-1 truncate">{c.message}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${SOURCE_COLORS[c.source] ?? 'bg-gray-50 text-gray-600'}`}>
                    {c.source}
                  </span>
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${STATUS_COLORS[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {expandedId === c.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>
              {expandedId === c.id && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap mt-3 mb-4">{c.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">Mark as:</span>
                    {['new', 'read', 'replied', 'archived'].map(st => (
                      <button
                        key={st}
                        onClick={(e) => { e.stopPropagation(); updateStatus(c.id, st); }}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${c.status === st ? STATUS_COLORS[st] + ' ring-1 ring-current' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
