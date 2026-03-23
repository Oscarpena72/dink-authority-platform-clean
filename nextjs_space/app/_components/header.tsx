"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Globe, Instagram, Facebook, Twitter, Youtube, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'News', href: '/articles?category=news' },
  { label: 'Pro Players', href: '/articles?category=pro-players' },
  { label: 'Enthusiasts', href: '/articles?category=enthusiasts' },
  { label: 'Results', href: '/articles?category=results' },
  { label: 'Events', href: '/articles?category=events' },
  { label: 'Gear', href: '/articles?category=gear' },
  { label: 'Magazine', href: '/articles?category=magazine' },
  { label: 'LATAM', href: '/articles?category=latam' },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();

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
      <div className="bg-brand-purple text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s: any) => (
              <a key={s?.label} href={s?.href ?? '#'} aria-label={s?.label ?? 'social'} className="hover:text-brand-neon transition-colors">
                <s.icon size={15} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hidden sm:block text-white/70 hover:text-brand-neon transition-colors text-[11px] uppercase tracking-wider font-medium">Contact</Link>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 hover:text-brand-neon transition-colors font-medium" aria-label="Language selector">
                <Globe size={13} />
                <span className="text-[11px] uppercase tracking-wider">EN</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-brand-purple-light rounded-lg shadow-2xl z-50 border border-white/10 overflow-hidden">
                  <button onClick={() => setLangOpen(false)} className="w-full px-4 py-2.5 text-left text-white font-semibold text-xs border-b border-white/10 bg-brand-blue/20 hover:bg-brand-blue/30">✓ English</button>
                  <div className="px-4 py-2.5 text-white/40 text-xs cursor-not-allowed">Español (Coming soon)</div>
                  <div className="px-4 py-2.5 text-white/40 text-xs cursor-not-allowed">Português (Coming soon)</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo */}
      <header className="sticky top-0 z-50 bg-brand-purple-dark shadow-2xl shadow-black/20">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Logo + search row */}
          <div className="flex items-center justify-between py-3 md:py-4">
            <Link href="/" className="flex-shrink-0 group">
              <div className="relative h-12 w-56 md:h-16 md:w-72 lg:h-[72px] lg:w-80">
                <Image src="/images/logo.png" alt="Dink Authority Magazine" fill className="object-contain drop-shadow-lg" priority />
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 text-white/80 hover:text-brand-neon transition-colors rounded-lg hover:bg-white/5" aria-label="Search">
                <Search size={22} />
              </button>
              <Link href="/articles" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-blue-light transition-all shadow-lg shadow-brand-blue/20">
                Subscribe
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 text-white hover:text-brand-neon transition-colors" aria-label="Menu">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Navigation bar - sports ticker style */}
          <nav className="hidden lg:block border-t border-white/10">
            <div className="flex items-center gap-0">
              {NAV_ITEMS.map((item: any) => (
                <Link
                  key={item?.label}
                  href={item?.href ?? '#'}
                  className="relative px-4 py-3 text-[13px] font-bold text-white/80 hover:text-white uppercase tracking-wider font-heading transition-all group"
                >
                  {item?.label}
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-brand-purple border-t border-white/10">
            <form onSubmit={handleSearch} className="max-w-[1400px] mx-auto px-4 py-3 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e?.target?.value ?? '')}
                placeholder="Search articles, players, events..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-brand-purple-light text-white placeholder-white/40 border border-white/15 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue/50"
                autoFocus
              />
              <button type="submit" className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue-light transition-colors">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden bg-brand-purple border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-0.5">
              {NAV_ITEMS.map((item: any) => (
                <Link
                  key={item?.label}
                  href={item?.href ?? '#'}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-white hover:text-brand-neon hover:bg-white/5 rounded-lg transition-all font-heading uppercase text-sm font-bold tracking-wide flex items-center justify-between"
                >
                  {item?.label}
                  <ChevronRight size={16} className="text-white/30" />
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
