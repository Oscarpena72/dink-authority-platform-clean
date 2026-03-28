"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Loader2, MapPin } from 'lucide-react';

export default function AdminJuniorsClient() {
  const [juniors, setJuniors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/juniors')
      .then((r: any) => r?.json?.())
      .then((d: any) => setJuniors(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this junior profile?')) return;
    try {
      await fetch(`/api/juniors/${id}`, { method: 'DELETE' });
      setJuniors((prev: any[]) => (prev ?? []).filter((j: any) => j?.id !== id));
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Juniors</h1>
        <Link href="/admin/juniors/new" className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
          <Plus size={16} /> New Junior
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-brand-purple animate-spin" /></div>
      ) : (juniors ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl"><p className="text-brand-gray-dark">No junior profiles yet. Create your first one!</p></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Age</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-purple">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(juniors ?? []).map((j: any) => (
                  <tr key={j?.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-purple truncate max-w-xs">{j?.name ?? 'Unnamed'}</p>
                      <p className="text-xs text-brand-gray-dark truncate">{j?.title ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-gray-600"><MapPin size={14} /> {j?.country ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{j?.age ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${j?.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {j?.status ?? 'draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {j?.status === 'published' && (
                          <Link href={`/juniors/${j?.slug ?? ''}`} target="_blank" className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple"><Eye size={16} /></Link>
                        )}
                        <Link href={`/admin/juniors/${j?.id ?? ''}/edit`} className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(j?.id ?? '')} className="p-2 hover:bg-red-50 rounded text-brand-gray-dark hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
