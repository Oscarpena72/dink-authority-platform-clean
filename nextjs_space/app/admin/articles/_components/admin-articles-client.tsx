"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Star, Loader2, Languages, Check } from 'lucide-react';

type Article = {
  id: string;
  title?: string;
  slug?: string;
  authorName?: string;
  category?: string;
  status?: string;
  isHeroStory?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  locale?: string;
  translationOf?: string | null;
};

const LOCALE_BADGE: Record<string, { label: string; flag: string; cls: string }> = {
  en: { label: 'EN', flag: '🇺🇸', cls: 'bg-blue-100 text-blue-700' },
  es: { label: 'ES', flag: '🇪🇸', cls: 'bg-amber-100 text-amber-700' },
  pt: { label: 'PT', flag: '🇧🇷', cls: 'bg-green-100 text-green-700' },
};

export default function AdminArticlesClient() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = () => {
    fetch('/api/articles')
      .then((r: any) => {
        if (!r?.ok) throw new Error('API error');
        return r?.json?.();
      })
      .then((d: any) => setArticles(Array.isArray(d) ? d : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Map of base English article id -> { es: Article, pt: Article } for existing translations
  const translationsByBase = useMemo(() => {
    const map: Record<string, Record<string, Article>> = {};
    for (const a of articles) {
      if (a.translationOf) {
        map[a.translationOf] = map[a.translationOf] || {};
        if (a.locale) map[a.translationOf][a.locale] = a;
      }
    }
    return map;
  }, [articles]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este artículo?')) return;
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      setArticles((prev) => (prev ?? []).filter((a) => a?.id !== id));
    } catch { /* empty */ }
  };

  const handleTranslate = async (article: Article, locale: 'es' | 'pt') => {
    setMenuOpenId(null);
    setError(null);
    // If translation already exists, just open it for editing.
    const existing = translationsByBase[article.id]?.[locale];
    if (existing) {
      router.push(`/admin/articles/${existing.id}/edit`);
      return;
    }
    setTranslatingId(article.id + ':' + locale);
    try {
      const res = await fetch(`/api/articles/${article.id}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, autoTranslate: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'No se pudo crear la traducción');
      router.push(`/admin/articles/${data.id}/edit`);
    } catch (e: any) {
      setError(e?.message || 'Error al traducir');
      setTranslatingId(null);
    }
  };

  // Only English source articles get the "Translate" action.
  const isSource = (a: Article) => (a.locale ?? 'en') === 'en' && !a.translationOf;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Artículos</h1>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
          <Plus size={16} /> Nuevo Artículo
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-purple animate-spin" />
        </div>
      ) : (articles ?? []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <p className="text-brand-gray-dark">Aún no hay artículos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Título</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Idioma</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Categoría</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden lg:table-cell">Traducciones</th>
                  <th className="text-center px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Vistas</th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-purple">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(articles ?? []).map((a) => {
                  const badge = LOCALE_BADGE[a.locale ?? 'en'] ?? LOCALE_BADGE.en;
                  const existingTranslations = translationsByBase[a.id] ?? {};
                  return (
                    <tr key={a?.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {a.translationOf && <span className="text-brand-gray-dark/50" title="Traducción">↳</span>}
                          <div>
                            <p className="font-medium text-brand-purple truncate max-w-xs">{a?.title ?? 'Sin título'}</p>
                            <p className="text-xs text-brand-gray-dark">{a?.authorName ?? ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${badge.cls}`}>{badge.flag} {badge.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="px-2 py-1 bg-brand-gray text-brand-purple text-xs rounded-full capitalize">{a?.category ?? ''}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          a?.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a?.status === 'published' ? 'publicado' : 'borrador'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {isSource(a) ? (
                          <div className="flex gap-1.5">
                            {(['es', 'pt'] as const).map((loc) => {
                              const has = !!existingTranslations[loc];
                              return (
                                <span
                                  key={loc}
                                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-0.5 ${
                                    has ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                                  }`}
                                  title={has ? `Traducción a ${loc.toUpperCase()} creada` : `Sin traducción a ${loc.toUpperCase()}`}
                                >
                                  {has && <Check size={10} />}{loc.toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-brand-gray-dark/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-center text-sm text-brand-gray-dark">
                        {a?.viewCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isSource(a) && (
                            <div className="relative">
                              <button
                                onClick={() => setMenuOpenId(menuOpenId === a.id ? null : a.id)}
                                disabled={!!translatingId && translatingId.startsWith(a.id + ':')}
                                className="p-2 hover:bg-brand-neon/10 rounded text-brand-gray-dark hover:text-brand-purple disabled:opacity-50"
                                title="Traducir"
                              >
                                {translatingId && translatingId.startsWith(a.id + ':')
                                  ? <Loader2 size={16} className="animate-spin" />
                                  : <Languages size={16} />}
                              </button>
                              {menuOpenId === a.id && (
                                <div className="absolute right-0 z-20 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                                  <p className="px-3 py-2 text-[11px] uppercase tracking-wider text-brand-gray-dark bg-brand-gray/50 font-bold">Traducir a</p>
                                  {(['es', 'pt'] as const).map((loc) => {
                                    const has = !!existingTranslations[loc];
                                    const name = loc === 'es' ? 'Español' : 'Português';
                                    const flag = loc === 'es' ? '🇪🇸' : '🇧🇷';
                                    return (
                                      <button
                                        key={loc}
                                        onClick={() => handleTranslate(a, loc)}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-brand-purple hover:bg-brand-neon/10 transition-colors"
                                      >
                                        <span>{flag}</span>
                                        <span>{name}</span>
                                        {has
                                          ? <span className="ml-auto text-[10px] text-green-600 font-bold flex items-center gap-0.5"><Check size={11} /> Editar</span>
                                          : <span className="ml-auto text-[10px] text-brand-gray-dark">Crear</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                          {a?.status === 'published' && (
                            <Link href={`/articles/${a?.slug ?? ''}`} target="_blank" className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple" title="Ver">
                              <Eye size={16} />
                            </Link>
                          )}
                          <Link href={`/admin/articles/${a?.id ?? ''}/edit`} className="p-2 hover:bg-gray-100 rounded text-brand-gray-dark hover:text-brand-purple" title="Editar">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(a?.id ?? '')} className="p-2 hover:bg-red-50 rounded text-brand-gray-dark hover:text-red-500" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {translatingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3 max-w-sm text-center">
            <Loader2 size={32} className="text-brand-purple animate-spin" />
            <p className="font-semibold text-brand-purple">Creando traducción…</p>
            <p className="text-sm text-brand-gray-dark">Estamos traduciendo el contenido con IA. Esto puede tardar hasta un minuto. Podrás revisarlo y ajustarlo antes de publicar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
