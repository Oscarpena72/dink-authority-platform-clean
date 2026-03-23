"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Globe, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
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
      {/* Top bar */}
      <div className="bg-brand-purple text-white">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s: any) => (
              <a key={s?.label} href={s?.href ?? '#'} aria-label={s?.label ?? 'social'} className="hover:text-brand-neon transition-colors">
                <s.icon size={16} />
              </a>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 hover:text-brand-neon transition-colors" aria-label="Language selector">
              <Globe size={14} />
              <span>EN</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-brand-purple-light rounded shadow-xl z-50 border border-white/10">
                <button onClick={() => setLangOpen(false)} className="w-full px-3 py-2 text-left text-white font-semibold text-xs border-b border-white/10 bg-brand-neon/10 rounded-t hover:bg-brand-neon/20">✓ English (Active)</button>
                <div className="px-3 py-2 text-white/50 text-xs cursor-not-allowed">Español (Coming soon)</div>
                <div className="px-3 py-2 text-white/50 text-xs cursor-not-allowed">Português (Coming soon)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-brand-purple-dark/95 backdrop-blur-md shadow-lg">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-10 w-48 md:h-12 md:w-56">
              <Image src="/images/logo.png" alt="Dink Authority Magazine" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item: any) => (
              <Link
                key={item?.label}
                href={item?.href ?? '#'}
                className="px-3 py-2 text-sm font-semibold text-white hover:text-brand-neon transition-colors uppercase tracking-wide font-heading"
              >
                {item?.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-white hover:text-brand-neon transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white hover:text-brand-neon transition-colors" aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-brand-purple border-t border-brand-purple-light">
            <form onSubmit={handleSearch} className="max-w-[1200px] mx-auto px-4 py-3 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e?.target?.value ?? '')}
                placeholder="Search articles, players, events..."
                className="flex-1 px-4 py-2 rounded bg-brand-purple-light text-white placeholder-white/50 border border-white/20 focus:border-brand-neon focus:outline-none"
                autoFocus
              />
              <button type="submit" className="px-6 py-2 bg-brand-neon text-brand-purple font-bold rounded hover:bg-brand-neon-dim transition-colors">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden bg-brand-purple border-t border-brand-purple-light">
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item: any) => (
                <Link
                  key={item?.label}
                  href={item?.href ?? '#'}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-white hover:text-brand-neon hover:bg-brand-purple-light rounded transition-all font-heading uppercase text-sm font-semibold tracking-wide"
                >
                  {item?.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
