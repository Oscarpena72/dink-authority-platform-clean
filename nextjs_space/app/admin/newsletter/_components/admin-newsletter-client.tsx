"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Download, Loader2 } from 'lucide-react';

export default function AdminNewsletterClient() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/newsletter').then((r: any) => r?.json?.()).then((d: any) => setSubscribers(d ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const csv = 'Email,Subscribed At,Active\n' + (subscribers ?? []).map((s: any) => `${s?.email ?? ''},${s?.subscribedAt ?? ''},${s?.isActive ?? ''}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Newsletter Subscribers</h1>
          <p className="text-sm text-brand-gray-dark mt-1">{(subscribers ?? []).length} total subscribers</p>
        </div>
        <button onClick={exportCSV} disabled={(subscribers ?? []).length === 0} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-purple" /></div>
      ) : (subscribers ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <Mail size={48} className="text-brand-gray-dark mx-auto mb-4" />
          <p className="text-brand-gray-dark">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-brand-purple">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Subscribed</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-purple">Status</th>
              </tr>
            </thead>
            <tbody>
              {(subscribers ?? []).map((s: any) => (
                <tr key={s?.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-brand-purple">{s?.email ?? ''}</td>
                  <td className="px-4 py-3 text-brand-gray-dark hidden md:table-cell">{s?.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${s?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
