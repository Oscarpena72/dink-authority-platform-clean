"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import SubscribeForm from '@/app/_components/subscribe-form';
import { useLanguage } from '@/lib/i18n/language-context';
import type { TranslationKey } from '@/lib/i18n/translations';
import TikTokIcon from '@/components/icons/tiktok-icon';

const DEFAULT_FOOTER_NAV: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: 'nav.news', href: '/articles?category=news' },
  { labelKey: 'about.title', href: '/about' },
  { labelKey: 'nav.contact', href: '/contact' },
  { labelKey: 'nav.events', href: '/articles?category=events' },
];

interface FooterPartner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface CmsNavLink {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
}

export default function Footer() {
  const { t } = useLanguage();
  const [socials, setSocials] = useState<{ icon: any; href: string; label: string }[]>([
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: TikTokIcon, href: '#', label: 'TikTok' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]);
  const [partners, setPartners] = useState<FooterPartner[]>([]);

  /* CMS-driven footer settings */
  const [brandTitle, setBrandTitle] = useState('DINK AUTHORITY');
  const [brandSubtitle, setBrandSubtitle] = useState('Magazine');
  const [brandDescription, setBrandDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('contact@dinkauthoritymagazine.com');
  const [contactActive, setContactActive] = useState(true);
  const [subscribeTitle, setSubscribeTitle] = useState('');
  const [subscribeSubtitle, setSubscribeSubtitle] = useState('');
  const [cmsNavLinks, setCmsNavLinks] = useState<CmsNavLink[]>([]);

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
        /* Footer CMS settings */
        if (settings?.footer_brand_title) setBrandTitle(settings.footer_brand_title);
        if (settings?.footer_brand_subtitle) setBrandSubtitle(settings.footer_brand_subtitle);
        if (settings?.footer_brand_description !== undefined) setBrandDescription(settings.footer_brand_description || '');
        if (settings?.footer_contact_email) setContactEmail(settings.footer_contact_email);
        if (settings?.footer_contact_active !== undefined) setContactActive(settings.footer_contact_active !== 'false');
        if (settings?.footer_subscribe_title) setSubscribeTitle(settings.footer_subscribe_title);
        if (settings?.footer_subscribe_subtitle) setSubscribeSubtitle(settings.footer_subscribe_subtitle);
        try {
          const parsed = JSON.parse(settings?.footer_nav_links || '[]');
          if (Array.isArray(parsed) && parsed.length > 0) setCmsNavLinks(parsed.filter((l: CmsNavLink) => l.isActive));
        } catch { /* ignore */ }
      })
      .catch(() => {});

    fetch('/api/footer-partners')
      .then(res => res.json())
      .then((data: FooterPartner[]) => {
        if (Array.isArray(data)) setPartners(data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-brand-purple text-white">
      {/* Neon accent line at top */}
      <div className="h-1 neon-gradient" />
      <div className="max-w-[1400px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand identity */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-white mb-1">{brandTitle}<span className="text-brand-neon">.</span></h3>
            <p className="text-brand-neon text-xs font-bold uppercase tracking-[0.2em] mb-4">{brandSubtitle}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-3">
              {brandDescription || t('footer.description')}
            </p>
            <Link href="/about" className="text-brand-neon text-sm font-medium hover:underline transition-colors">
              {t('about.title')} →
            </Link>
          </div>

          {/* Navigation — CMS or fallback */}
          <div>
            <h3 className="font-heading font-bold text-white mb-5 uppercase text-sm tracking-wider">{t('footer.navigation')}</h3>
            <div className="flex flex-col gap-3">
              {cmsNavLinks.length > 0 ? (
                cmsNavLinks.map((link) => (
                  <Link key={link.id} href={link.url} className="text-white/50 hover:text-brand-neon transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                ))
              ) : (
                DEFAULT_FOOTER_NAV.map((item) => (
                  <Link key={item.labelKey} href={item.href} className="text-white/50 hover:text-brand-neon transition-colors text-sm font-medium">
                    {t(item.labelKey)}
                  </Link>
                ))
              )}
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
            {contactActive && (
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Mail size={14} className="text-brand-neon" />
                <span>{contactEmail}</span>
              </div>
            )}
          </div>

          {/* Subscribe — CMS overrides for title/subtitle */}
          <div>
            <SubscribeForm source="footer" variant="footer" overrideTitle={subscribeTitle || undefined} overrideSubtitle={subscribeSubtitle || undefined} />
          </div>
        </div>

        {/* Sponsors bar — dynamic from CMS */}
        {partners.length > 0 && (
          <div className="border-t border-white/5 mt-10 pt-8">
            <p className="text-white/30 text-[10px] uppercase tracking-widest text-center mb-5 font-medium">Our Sponsors &amp; Partners</p>
            <div className="flex items-center justify-center gap-8 md:gap-10 flex-wrap">
              {partners.map(p => {
                const logoImg = (
                  <div className="relative h-8 w-24 sm:h-9 sm:w-28 opacity-50 hover:opacity-90 transition-opacity grayscale hover:grayscale-0">
                    <Image
                      src={p.logoUrl}
                      alt={p.name}
                      fill
                      className="object-contain brightness-200"
                      unoptimized
                    />
                  </div>
                );
                return p.websiteUrl ? (
                  <a key={p.id} href={p.websiteUrl} target="_blank" rel="noopener noreferrer" title={p.name}>
                    {logoImg}
                  </a>
                ) : (
                  <div key={p.id} title={p.name}>{logoImg}</div>
                );
              })}
            </div>
          </div>
        )}

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
