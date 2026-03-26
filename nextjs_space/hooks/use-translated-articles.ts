"use client";
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';

interface ArticleWithTranslation {
  id: string;
  title: string;
  excerpt?: string | null;
  [key: string]: any;
}

/**
 * Hook that returns articles with translated titles/excerpts when locale != 'en'.
 * Uses batch API with persistent DB cache.
 */
export function useTranslatedArticles<T extends ArticleWithTranslation>(articles: T[]): T[] {
  const { locale } = useLanguage();
  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; excerpt: string }>>({});
  const fetchedRef = useRef<string>(''); // Track what we've fetched to avoid re-fetching

  useEffect(() => {
    if (locale === 'en' || !articles || articles.length === 0) {
      setTranslatedMap({});
      fetchedRef.current = '';
      return;
    }

    // Build a cache key to avoid re-fetching same set
    const cacheKey = `${locale}:${articles.map(a => a.id).sort().join(',')}`;
    if (fetchedRef.current === cacheKey) return;
    fetchedRef.current = cacheKey;

    const controller = new AbortController();

    const fetchTranslations = async () => {
      try {
        const res = await fetch('/api/translate/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articles: articles.map(a => ({ id: a.id, title: a.title, excerpt: a.excerpt || '' })),
            locale,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          setTranslatedMap(data.translations || {});
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Translation fetch error:', err);
        }
      }
    };

    fetchTranslations();
    return () => controller.abort();
  }, [locale, articles]);

  // If English or no translations, return original
  if (locale === 'en' || Object.keys(translatedMap).length === 0) return articles;

  // Merge translations into articles
  return articles.map(article => {
    const tr = translatedMap[article.id];
    if (!tr) return article;
    return {
      ...article,
      title: tr.title || article.title,
      excerpt: tr.excerpt || article.excerpt,
    };
  });
}
