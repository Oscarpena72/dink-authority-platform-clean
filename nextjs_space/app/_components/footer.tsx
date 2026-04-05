"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import SubscribeForm from '@/app/_components/subscribe-form';
import { useLanguage } from '@/lib/i18n/language-context';
import type { TranslationKey } from '@/lib/i18n/translations';
import TikTokIcon from '@/components/icons/tiktok-icon';

const FOOTER_NAV: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: 'nav.news', href: '/articles?category=news' },
  { labelKey: 'about.title', href: '/about' },
  { labelKey: 'nav.contact', href: '/contact' },
  { labelKey: 'nav.events', href: '/articles?category=events' },
];

export default function Footer() {
  const { t } = useLanguage();
  const [socials, setSocials] = useState<{ icon: any; href: string; label: string }[]>([
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: TikTokIcon, href: '#', label: 'TikTok' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then((settings: Record<string, string>) => {
        setSocials([
          { icon: Instagram, href: settings?.social_instagram ?? '#', label: 'Instagram' },
          { icon: Facebook, href: settings?.social_facebook ?? '#', label: 'Facebook' },
          { icon: TikTokIcon, href: settings?.social_tiktok ?? '#', label: 'TikTok' },
          { icon: Youtube, href: settings?.social_youtube ?? '#', label: 'YouTube' },
        ]);
      })
      .catch(() => {});
  }, []);
  return (
    <footer className="bg-brand-purple text-white">
      {/* Neon accent line at top */}
      <div className="h-1 neon-gradient" />
      <div className="max-w-[1400px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-white mb-1">DINK AUTHORITY<span className="text-brand-neon">.</span></h3>
            <p className="text-brand-neon text-xs font-bold uppercase tracking-[0.2em] mb-4">Magazine</p>
            <p className="text-white/50 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-bold text-white mb-5 uppercase text-sm tracking-wider">{t('footer.navigation')}</h3>
            <div className="flex flex-col gap-3">
              {FOOTER_NAV.map((item) => (
                <Link key={item.labelKey} href={item.href} className="text-white/50 hover:text-brand-neon transition-colors text-sm font-medium">
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-heading font-bold text-white mb-5 uppercase text-sm tracking-wider">{t('footer.connect')}</h3>
            <div className="flex items-center gap-3 mb-5">
              {socials.map((s: any) => (
                <a key={s?.label} href={s?.href ?? '#'} target="_blank" rel="noopener noreferrer" aria-label={s?.label} className="p-2.5 bg-white/5 rounded-xl hover:bg-brand-neon/15 hover:text-brand-neon transition-all border border-white/5 hover:border-brand-neon/30">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Mail size={14} className="text-brand-neon" />
              <span>info@dinkauthoritymagazine.com</span>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <SubscribeForm source="footer" variant="footer" />
          </div>
        </div>

        {/* Sponsors bar */}
        <div className="border-t border-white/5 mt-10 pt-8">
          <p className="text-white/30 text-[10px] uppercase tracking-widest text-center mb-4 font-medium">Our Sponsors & Partners</p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-40 hover:opacity-60 transition-opacity">
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">JOOLA</span>
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">SELKIRK</span>
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">FRANKLIN</span>
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">ENGAGE</span>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Dink Authority Magazine. {t('footer.rights')}</p>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
