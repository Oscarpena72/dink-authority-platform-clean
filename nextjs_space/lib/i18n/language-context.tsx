"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Locale, t as translate, TranslationKey } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: TranslationKey) => translate(key, 'en'),
});

// The URL path is the source of truth for the active locale.
// `/es*` -> es, `/pt*` -> pt, anything else -> en.
function localeFromPath(pathname: string | null): Locale {
  if (!pathname) return 'en';
  const seg = pathname.split('/')[1];
  if (seg === 'es') return 'es';
  if (seg === 'pt') return 'pt';
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const urlLocale = localeFromPath(pathname);
  const [mounted, setMounted] = useState(false);
  // Optional in-page override (e.g. the top-bar language selector) that lasts
  // only until the next navigation, so the URL always wins on route changes.
  const [override, setOverride] = useState<Locale | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Whenever the route's locale changes, drop any in-page override so the URL
  // is authoritative. This fixes the menu "sticking" in Spanish/Portuguese when
  // navigating back to an English route.
  useEffect(() => {
    setOverride(null);
  }, [urlLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setOverride(newLocale);
  }, []);

  // During SSR and initial hydration always render with 'en' to match the
  // server output and avoid hydration mismatches. After mount the locale is
  // derived from the URL (plus any transient in-page override).
  const effectiveLocale: Locale = mounted ? (override ?? urlLocale) : 'en';

  const t = useCallback(
    (key: TranslationKey) => translate(key, effectiveLocale),
    [effectiveLocale],
  );

  const contextValue = {
    locale: effectiveLocale,
    setLocale,
    t: mounted ? t : (key: TranslationKey) => translate(key, 'en'),
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
