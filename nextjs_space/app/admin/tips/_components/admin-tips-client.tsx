"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';

export default function AdminTipsClient() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tips')
      .then((r: any) => r?.json?.())
      .then((d: any) => setTips(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tip?')) return;
    try {
      await fetch(`/api/tips/${id}`, { method: 'DELETE' });
      setTips((prev: any[]) => (prev ?? []).filter((t: any) => t?.id !== id));
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Tips</h1>
        <Link href="/admin/tips/new" className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
          <Plus size={16} /> New Tip
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-purple animate-spin" />
        </div>
      ) : (tips ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <p className="text-brand-gray-dark">No tips yet. Create your first tip!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-purple">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(tips ?? []).map((tip: any) => (
                  <tr key={tip?.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-purple truncate max-w-xs">{tip?.title ?? 'Untitled'}</p>
                      <p className="text-xs text-brand-gray-dark">{tip?.publishDate ? new Date(tip.publishDate).toLocaleDateString() : ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600">{tip?.authorName || tip?.author?.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-brand-gray text-brand-purple text-xs rounded-full capitalize">{tip?.category ?? ''}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${tip?.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {tip?.status ?? 'draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {tip?.status === 'published' && (
                          <Link href={`/tips/${tip?.slug ?? ''}`} target="_blank" className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple">
                            <Eye size={16} />
                          </Link>
                        )}
                        <Link href={`/admin/tips/${tip?.id ?? ''}/edit`} className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(tip?.id ?? '')} className="p-2 hover:bg-red-50 rounded text-brand-gray-dark hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
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
