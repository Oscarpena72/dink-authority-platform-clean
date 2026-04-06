"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Cookie, BarChart3, Megaphone, Shield, Download, Search, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ConsentRecord {
  id: string;
  sessionId: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  ipHash: string | null;
  consentVersion: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  analyticsAccepted: number;
  marketingAccepted: number;
  analyticsRejected: number;
  marketingRejected: number;
  last30Days: {
    total: number;
    analyticsAccepted: number;
    marketingAccepted: number;
  };
}

export default function AdminConsentClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cookie-consent');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setStats(data.stats);
      setRecords(data.records || []);
    } catch (err) {
      console.error('Error fetching consent data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(r =>
      r.sessionId.toLowerCase().includes(q) ||
      (r.ipHash || '').toLowerCase().includes(q)
    );
  }, [records, search]);

  const handleExportCSV = () => {
    window.open('/api/cookie-consent?format=csv', '_blank');
  };

  const pctAnalytics = stats && stats.total > 0 ? Math.round((stats.analyticsAccepted / stats.total) * 100) : 0;
  const pctMarketing = stats && stats.total > 0 ? Math.round((stats.marketingAccepted / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cookie className="text-brand-purple" size={28} />
            Cookie Consent
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registros de consentimiento y preferencias de cookies de los visitantes
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield size={20} className="text-brand-purple" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Consents</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Últimos 30 días: {stats.last30Days.total}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Analytics Accepted</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.analyticsAccepted}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${pctAnalytics}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-500">{pctAnalytics}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Megaphone size={20} className="text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Marketing Accepted</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.marketingAccepted}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${pctMarketing}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-500">{pctMarketing}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock size={20} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Last 30 Days</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Analytics</span>
                <span className="font-semibold text-gray-900">{stats.last30Days.analyticsAccepted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Marketing</span>
                <span className="font-semibold text-gray-900">{stats.last30Days.marketingAccepted}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Desglose de Consentimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                <Shield size={28} className="text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">Essential</p>
              <p className="text-sm text-gray-500">Siempre activas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.total} <span className="text-sm text-gray-400">(100%)</span></p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
                <BarChart3 size={28} className="text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">Analytics</p>
              <div className="flex justify-center gap-4 mt-1">
                <span className="text-sm"><CheckCircle size={14} className="inline text-green-500 mr-1" />{stats.analyticsAccepted}</span>
                <span className="text-sm"><XCircle size={14} className="inline text-red-400 mr-1" />{stats.analyticsRejected}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-2">
                <Megaphone size={28} className="text-orange-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">Marketing</p>
              <div className="flex justify-center gap-4 mt-1">
                <span className="text-sm"><CheckCircle size={14} className="inline text-green-500 mr-1" />{stats.marketingAccepted}</span>
                <span className="text-sm"><XCircle size={14} className="inline text-red-400 mr-1" />{stats.marketingRejected}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-semibold text-gray-900">Registros Recientes ({filtered.length})</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por Session ID o IP Hash..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-72 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando registros...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {records.length === 0 ? 'No hay registros de consentimiento aún. Los registros aparecerán cuando los visitantes interactúen con el banner de cookies.' : 'Sin resultados para la búsqueda.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Session ID</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Essential</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Analytics</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Marketing</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">IP Hash</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden lg:table-cell">Version</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {r.sessionId.slice(0, 20)}...
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckCircle size={16} className="inline text-green-500" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.analytics
                        ? <CheckCircle size={16} className="inline text-green-500" />
                        : <XCircle size={16} className="inline text-red-400" />
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.marketing
                        ? <CheckCircle size={16} className="inline text-green-500" />
                        : <XCircle size={16} className="inline text-red-400" />
                      }
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-xs text-gray-500">{r.ipHash?.slice(0, 12) || '—'}...</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{r.consentVersion}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {new Date(r.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre este sistema</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Las preferencias del usuario se guardan en <strong>localStorage</strong> del navegador para respuesta inmediata.</li>
          <li>• Cada consentimiento se registra en la <strong>base de datos</strong> (tabla CookieConsent) para auditoría interna.</li>
          <li>• El <strong>Session ID</strong> es un identificador técnico anónimo generado por el navegador.</li>
          <li>• El <strong>IP Hash</strong> es un hash parcial no reversible — no almacenamos IPs completas.</li>
          <li>• Las cookies <strong>esenciales</strong> siempre están activas (sesión, preferencias, funcionamiento básico).</li>
          <li>• Las cookies de <strong>analytics</strong> y <strong>marketing</strong> requieren consentimiento explícito del usuario.</li>
        </ul>
      </div>
    </div>
  );
}
