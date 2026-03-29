"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, Edit, Plus, Check, X } from 'lucide-react';

export default function AdminCountriesClient() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/countries').then(r => r.json()).then(d => { setCountries(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple">🌍 Dink Authority World</h1>
          <p className="text-sm text-gray-500 mt-1">Manage country editions</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {countries.map((c: any) => (
            <Link key={c.id} href={`/admin/countries/${c.slug}`}
              className="flex items-center justify-between bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{c.flagEmoji}</span>
                <div>
                  <h3 className="font-bold text-brand-purple text-lg">{c.name}</h3>
                  <p className="text-xs text-gray-400">/{c.slug} · {c.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.isActive ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><Check size={12} /> Active</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full"><X size={12} /> Inactive</span>
                )}
                <Edit size={16} className="text-gray-400" />
              </div>
            </Link>
          ))}
          {countries.length === 0 && (
            <div className="text-center py-12 text-gray-400">No countries configured yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
