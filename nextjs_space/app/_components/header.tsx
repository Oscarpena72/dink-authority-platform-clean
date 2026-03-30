"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Globe, Instagram, Facebook, Twitter, Youtube, ChevronRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/language-context';
import { LOCALE_LABELS, LOCALE_NAMES, Locale } from '@/lib/i18n/translations';
import type { TranslationKey } from '@/lib/i18n/translations';

const NAV_ITEMS: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: 'nav.news', href: '/articles?category=news' },
  { labelKey: 'nav.proPlayers', href: '/articles?category=pro-players' },
  { labelKey: 'nav.juniors', href: '/juniors' },
  { labelKey: 'nav.tips', href: '/tips' },
  { labelKey: 'nav.enthusiasts', href: '/articles?category=enthusiasts' },
  { labelKey: 'nav.results', href: '/articles?category=results' },
  { labelKey: 'nav.events', href: '/articles?category=events' },
  { labelKey: 'nav.gear', href: '/articles?category=gear' },
  { labelKey: 'nav.magazine', href: '/magazine' },
  { labelKey: 'nav.shop', href: '/shop' },
];

const WORLD_COUNTRIES = [
  { name: 'Colombia', slug: 'colombia', flag: '🇨🇴' },
  { name: 'Canada', slug: 'canada', flag: '🇨🇦' },
  { name: 'Mexico', slug: 'mexico', flag: '🇲🇽' },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const LOCALES: Locale[] = ['en', 'es', 'pt'];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [worldOpen, setWorldOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();

  // Close lang dropdown on outside click (bubble phase)
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    // Use setTimeout to avoid the current click event triggering close immediately
    const id = setTimeout(() => {
      document.addEventListener('click', handler);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('click', handler);
    };
  }, [langOpen]);

  // Close world dropdown on outside click
  useEffect(() => {
    if (!worldOpen) return;
    const handler = (e: MouseEvent) => {
      if (worldRef.current && !worldRef.current.contains(e.target as Node)) setWorldOpen(false);
    };
    const id = setTimeout(() => { document.addEventListener('click', handler); }, 0);
    return () => { clearTimeout(id); document.removeEventListener('click', handler); };
  }, [worldOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery?.trim()) {
      router.push(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-brand-purple text-white relative z-[60]">
        <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s: any) => (
              <a key={s?.label} href={s?.href ?? '#'} aria-label={s?.label ?? 'social'} className="hover:text-brand-neon transition-colors">
                <s.icon size={15} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hidden sm:block text-white/70 hover:text-brand-neon transition-colors text-[11px] uppercase tracking-wider font-medium">{t('nav.contact')}</Link>
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 hover:text-brand-neon transition-colors font-medium" aria-label="Language selector">
                <Globe size={13} />
                <span className="text-[11px] uppercase tracking-wider">{LOCALE_LABELS[locale]}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-brand-purple-light rounded-lg shadow-2xl z-[9999] border border-white/10 overflow-hidden">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setLocale(loc); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                        locale === loc
                          ? 'text-brand-neon bg-brand-neon/10'
                          : 'text-white hover:bg-white/5 hover:text-brand-neon'
                      }`}
                    >
                      {locale === loc ? '✓ ' : ''}{LOCALE_NAMES[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo + nav on ONE row */}
      <header className="sticky top-0 z-50 bg-brand-purple shadow-2xl shadow-black/30">
        {/* Neon accent line at top */}
        <div className="h-[3px] neon-gradient" />
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center py-[14px] gap-4">
            {/* Logo — responsive height, auto width, no background */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/dink-authority-logo-white.png"
                alt="Dink Authority Magazine"
                width={200}
                height={42}
                className="h-[46px] md:h-[54px] lg:h-[68px] w-auto object-contain drop-shadow-[0_0_15px_rgba(57,255,20,0.15)]"
                priority
              />
            </Link>

            {/* Desktop navigation — same row */}
            <nav className="hidden lg:flex items-center gap-0 flex-1 min-w-0 justify-center">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className="relative px-3 xl:px-4 py-2 text-[12px] xl:text-[13px] font-bold text-white/80 hover:text-brand-neon uppercase tracking-wider font-heading transition-all group whitespace-nowrap"
                >
                  {t(item.labelKey)}
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-neon scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
              {/* Dink Authority World dropdown */}
              <div className="relative" ref={worldRef}>
                <button
                  onClick={() => setWorldOpen(!worldOpen)}
                  className="relative px-3 xl:px-4 py-2 text-[12px] xl:text-[13px] font-bold text-white/80 hover:text-brand-neon uppercase tracking-wider font-heading transition-all group flex items-center gap-1 whitespace-nowrap"
                >
                  DA World
                  <ChevronDown size={12} className={`transition-transform ${worldOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-neon scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
                {worldOpen && (
                  <div className="absolute right-0 mt-0 w-52 bg-brand-purple-light rounded-lg shadow-2xl z-[9999] border border-white/10 overflow-hidden">
                    {WORLD_COUNTRIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${c.slug}`}
                        onClick={() => setWorldOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:text-brand-neon transition-colors"
                      >
                        <span className="text-lg">{c.flag}</span>
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right actions: search, newsletter, mobile hamburger */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-auto lg:ml-0">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-white/80 hover:text-brand-neon transition-colors rounded-lg hover:bg-white/5" aria-label="Search">
                <Search size={20} />
              </button>
              <a href="#newsletter" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-neon-dim transition-all shadow-lg shadow-brand-neon/20">
                {t('nav.newsletter')}
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white hover:text-brand-neon transition-colors" aria-label="Menu">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-brand-purple-dark border-t border-white/10">
            <form onSubmit={handleSearch} className="max-w-[1400px] mx-auto px-4 py-3 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e?.target?.value ?? '')}
                placeholder={t('search.placeholder')}
                className="flex-1 px-4 py-2.5 rounded-lg bg-brand-purple-light text-white placeholder-white/40 border border-white/15 focus:border-brand-neon focus:outline-none focus:ring-1 focus:ring-brand-neon/50"
                autoFocus
              />
              <button type="submit" className="px-6 py-2.5 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-colors">
                {t('search.button')}
              </button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden bg-brand-purple-dark border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-0.5 max-h-[calc(100vh-140px)] overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-white hover:text-brand-neon hover:bg-white/5 rounded-lg transition-all font-heading uppercase text-sm font-bold tracking-wide flex items-center justify-between"
                >
                  {t(item.labelKey)}
                  <ChevronRight size={16} className="text-white/30" />
                </Link>
              ))}
              {/* Dink Authority World - Mobile */}
              <div className="mt-2 pt-2 border-t border-white/10">
                <span className="px-4 py-2 text-[11px] text-white/40 uppercase tracking-widest font-bold block">Dink Authority World</span>
                {WORLD_COUNTRIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-white hover:text-brand-neon hover:bg-white/5 rounded-lg transition-all font-heading text-sm font-bold tracking-wide flex items-center gap-3"
                  >
                    <span className="text-lg">{c.flag}</span>
                    {c.name}
                    <ChevronRight size={16} className="text-white/30 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
