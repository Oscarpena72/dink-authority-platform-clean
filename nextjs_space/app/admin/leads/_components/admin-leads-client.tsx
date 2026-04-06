"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Mail, MessageSquare, Download, Loader2, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SubData {
  id: string;
  email: string;
  name?: string | null;
  phoneNumber?: string | null;
  source: string;
  subscribedAt: string;
}

interface NewsletterData {
  id: string;
  email: string;
  source?: string;
  isActive: boolean;
  subscribedAt: string;
}

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  source?: string;
  status: string;
  createdAt: string;
}

const SOURCE_COLORS: Record<string, string> = {
  'footer': 'bg-green-500',
  'article': 'bg-purple-500',
  'homepage-newsletter': 'bg-blue-500',
  'homepage': 'bg-blue-500',
  'magazine': 'bg-amber-500',
  'contact-form': 'bg-indigo-500',
  'popup': 'bg-pink-500',
};

export default function AdminLeadsClient() {
  const [subscribers, setSubscribers] = useState<SubData[]>([]);
  const [newsletter, setNewsletter] = useState<NewsletterData[]>([]);
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/subscribers').then(r => r.json()).then(d => setSubscribers(d?.subscribers ?? [])),
      fetch('/api/newsletter').then(r => r.json()).then(d => setNewsletter(d ?? [])),
      fetch('/api/contact').then(r => r.json()).then(d => setContacts(d ?? [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Source breakdown across all data
  const sourceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    subscribers.forEach(s => map.set(s.source, (map.get(s.source) ?? 0) + 1));
    newsletter.forEach(s => map.set(s.source ?? 'homepage', (map.get(s.source ?? 'homepage') ?? 0) + 1));
    contacts.forEach(c => map.set(c.source ?? 'contact-form', (map.get(c.source ?? 'contact-form') ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [subscribers, newsletter, contacts]);

  const totalLeads = subscribers.length + newsletter.length + contacts.length;

  // Unique emails
  const uniqueEmails = useMemo(() => {
    const set = new Set<string>();
    subscribers.forEach(s => set.add(s.email.toLowerCase()));
    newsletter.forEach(s => set.add(s.email.toLowerCase()));
    contacts.forEach(c => set.add(c.email.toLowerCase()));
    return set.size;
  }, [subscribers, newsletter, contacts]);

  // Recent 30 days
  const recentCount = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const count = [
      ...subscribers.filter(s => new Date(s.subscribedAt) >= cutoff),
      ...newsletter.filter(s => new Date(s.subscribedAt) >= cutoff),
      ...contacts.filter(c => new Date(c.createdAt) >= cutoff),
    ];
    return count.length;
  }, [subscribers, newsletter, contacts]);

  // Recent activity timeline (last 10)
  const recentActivity = useMemo(() => {
    const all: { type: string; email: string; source: string; date: string; name?: string }[] = [
      ...subscribers.map(s => ({ type: 'subscriber', email: s.email, source: s.source, date: s.subscribedAt, name: s.name ?? undefined })),
      ...newsletter.map(s => ({ type: 'newsletter', email: s.email, source: s.source ?? 'homepage', date: s.subscribedAt })),
      ...contacts.map(c => ({ type: 'contact', email: c.email, source: c.source ?? 'contact-form', date: c.createdAt, name: c.name })),
    ];
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [subscribers, newsletter, contacts]);

  const exportAllCSV = () => {
    const header = 'Type,Name,Email,Phone,Source,Date';
    const rows = [
      ...subscribers.map(s => `"Subscriber","${s.name ?? ''}","${s.email}","${s.phoneNumber ?? ''}","${s.source}","${new Date(s.subscribedAt).toISOString()}"`),
      ...newsletter.map(s => `"Newsletter","","${s.email}","","${s.source ?? 'homepage'}","${new Date(s.subscribedAt).toISOString()}"`),
      ...contacts.map(c => `"Contact","${c.name}","${c.email}","${c.phone ?? ''}","${c.source ?? 'contact-form'}","${new Date(c.createdAt).toISOString()}"`),
    ];
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_leads_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Leads & CRM Overview</h1>
          <p className="text-sm text-brand-gray-dark mt-1">Unified view of all captured data</p>
        </div>
        <button onClick={exportAllCSV} disabled={totalLeads === 0} className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark text-sm font-bold rounded-lg hover:bg-brand-neon-dim disabled:opacity-50">
          <Download size={16} /> Export All CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-brand-neon" />
            <span className="text-xs font-medium text-gray-500">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-brand-purple">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-500">Unique Emails</span>
          </div>
          <p className="text-2xl font-bold text-brand-purple">{uniqueEmails}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-xs font-medium text-gray-500">Last 30 Days</span>
          </div>
          <p className="text-2xl font-bold text-brand-purple">{recentCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-indigo-500" />
            <span className="text-xs font-medium text-gray-500">New Contacts</span>
          </div>
          <p className="text-2xl font-bold text-brand-purple">{contacts.filter(c => c.status === 'new').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-heading font-bold text-brand-purple text-sm mb-4">Data Modules</h3>
          <div className="space-y-2">
            <Link href="/admin/subscribers" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-brand-purple">Subscribers</p>
                  <p className="text-xs text-gray-400">Magazine subscriptions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-purple">{subscribers.length}</span>
                <ArrowRight size={14} className="text-gray-400" />
              </div>
            </Link>
            <Link href="/admin/newsletter" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-brand-purple">Newsletter</p>
                  <p className="text-xs text-gray-400">Email newsletter</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-purple">{newsletter.length}</span>
                <ArrowRight size={14} className="text-gray-400" />
              </div>
            </Link>
            <Link href="/admin/contacts" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-brand-purple">Contact Form</p>
                  <p className="text-xs text-gray-400">Messages & inquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-purple">{contacts.length}</span>
                <ArrowRight size={14} className="text-gray-400" />
              </div>
            </Link>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-heading font-bold text-brand-purple text-sm mb-4">Source Breakdown</h3>
          {sourceBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {sourceBreakdown.map(([source, count]) => (
                <div key={source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{source}</span>
                    <span className="text-xs font-bold text-brand-purple">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${SOURCE_COLORS[source] ?? 'bg-gray-400'}`}
                      style={{ width: `${Math.max((count / totalLeads) * 100, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-heading font-bold text-brand-purple text-sm mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'subscriber' ? 'bg-green-500' : item.type === 'newsletter' ? 'bg-blue-500' : 'bg-indigo-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">
                      <strong>{item.name ?? item.email}</strong>
                      <span className="text-gray-400"> · {item.type}</span>
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {item.source} · {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Where is data stored */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <h3 className="font-heading font-bold text-brand-purple text-sm mb-3">🗄️ Where Your Data is Stored</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-brand-purple">Subscribers</p>
            <p className="text-gray-600">DB Table: <code className="bg-white px-1.5 py-0.5 rounded text-xs">Subscriber</code></p>
            <p className="text-gray-500 text-xs mt-1">Sources: Footer, Article page, Magazine</p>
          </div>
          <div>
            <p className="font-semibold text-brand-purple">Newsletter</p>
            <p className="text-gray-600">DB Table: <code className="bg-white px-1.5 py-0.5 rounded text-xs">NewsletterSubscriber</code></p>
            <p className="text-gray-500 text-xs mt-1">Sources: Homepage newsletter section</p>
          </div>
          <div>
            <p className="font-semibold text-brand-purple">Contact Form</p>
            <p className="text-gray-600">DB Table: <code className="bg-white px-1.5 py-0.5 rounded text-xs">ContactSubmission</code></p>
            <p className="text-gray-500 text-xs mt-1">Sources: /contact page form</p>
          </div>
        </div>
      </div>
    </div>
  );
}
