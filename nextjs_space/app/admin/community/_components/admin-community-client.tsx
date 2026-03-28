"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Download, RefreshCw, Trash2, Eye, Mail, Phone, MapPin, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface Correspondent {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  address: string | null;
  zipCode: string | null;
  phone: string | null;
  email: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminCommunityClient() {
  const [records, setRecords] = useState<Correspondent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/community/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    try {
      const res = await fetch(`/api/community/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleExport = () => {
    window.open('/api/community?format=csv', '_blank');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center">
            <Users size={20} className="text-brand-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Correspondents</h1>
            <p className="text-sm text-gray-500">{records.length} registration{records.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRecords} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light text-sm font-medium">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No registrations yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Summary Row */}
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-gray-900">{r.firstName} {r.lastName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><Mail size={12} /> {r.email}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {r.city}, {r.state}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(r.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                  {expandedId === r.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === r.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div><span className="font-medium text-gray-500">Phone:</span> <span className="text-gray-900">{r.phone || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Address:</span> <span className="text-gray-900">{r.address || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Zip Code:</span> <span className="text-gray-900">{r.zipCode || 'N/A'}</span></div>
                    {r.facebookUrl && <div><span className="font-medium text-gray-500">Facebook:</span> <a href={r.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{r.facebookUrl}</a></div>}
                    {r.instagramUrl && <div><span className="font-medium text-gray-500">Instagram:</span> <a href={r.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{r.instagramUrl}</a></div>}
                    {r.tiktokUrl && <div><span className="font-medium text-gray-500">TikTok:</span> <a href={r.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline break-all">{r.tiktokUrl}</a></div>}
                  </div>
                  {r.message && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-500 text-sm">Message:</span>
                      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{r.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
