"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('dink_lang') as Locale | null;
      if (saved && ['en', 'es', 'pt'].includes(saved)) {
        setLocaleState(saved);
      }
    } catch {}
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('dink_lang', newLocale);
    } catch {}
  }, []);

  const t = useCallback((key: TranslationKey) => {
    return translate(key, locale);
  }, [locale]);

  // During SSR and initial hydration, always render with 'en' to match server
  const contextValue = {
    locale: mounted ? locale : 'en',
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
