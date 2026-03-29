"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ExternalLink, Instagram, Facebook, Twitter, Youtube, Clock, Newspaper, Trophy, Heart, Users, Lightbulb } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import NewsletterSignup from '@/app/_components/newsletter-signup';
import WhatsAppButton from '@/app/_components/whatsapp-button';
import CookieBanner from '@/app/_components/cookie-banner';
import StickyBanner from '@/app/_components/sticky-banner';
import { useLanguage } from '@/lib/i18n/language-context';

interface ContentItem {
  id: string;
  title?: string;
  name?: string;
  slug: string;
  imageUrl?: string;
  focalPointX?: number;
  focalPointY?: number;
  excerpt?: string;
  category?: string;
  authorName?: string;
  publishedAt?: string;
  type: 'article' | 'tip' | 'junior';
  path: string;
}

interface CountryData {
  name: string;
  slug: string;
  flagEmoji: string;
  magazineCover?: string | null;
  magazineTitle?: string | null;
  magazineLink?: string | null;
  magazinePdfUrl?: string | null;
  bannerTopImage?: string | null;
  bannerTopLink?: string | null;
  bannerMidImage?: string | null;
  bannerMidLink?: string | null;
  bannerBottomImage?: string | null;
  bannerBottomLink?: string | null;
  stickyBannerImage?: string | null;
  stickyBannerMobileImage?: string | null;
  stickyBannerLink?: string | null;
  socialMedia: Record<string, string>;
}

/* ─── Ad Banner ─── */
function AdBanner({ image, link }: { image?: string | null; link?: string | null }) {
  if (!image) return null;
  return (
    <div className="max-w-[1400px] mx-auto px-4 my-8">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium text-center mb-1">Sponsored</p>
      <a href={link || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative w-full h-[70px] md:h-[100px]">
          <Image src={image} alt="Advertisement" fill className="object-cover" />
        </div>
      </a>
    </div>
  );
}

/* ─── Content Card ─── */
function ContentCard({ item }: { item: ContentItem }) {
  const displayTitle = item.title || item.name || '';
  return (
    <Link href={item.path} className="group block">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 h-full">
        <div className="relative aspect-[4/3] bg-gray-100">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={displayTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: `${item.focalPointX ?? 50}% ${item.focalPointY ?? 50}%` }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-neon/10 flex items-center justify-center text-brand-purple/40 text-4xl font-bold">DA</div>
          )}
          {item.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-purple/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">{item.category}</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-brand-purple text-sm leading-tight group-hover:text-brand-neon transition-colors line-clamp-2">{displayTitle}</h3>
          {item.excerpt && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{item.excerpt}</p>}
          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
            {item.authorName && <span>{item.authorName}</span>}
            {item.publishedAt && (
              <span className="flex items-center gap-1"><Clock size={10} />{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Content Section with icon + divider ─── */
function ContentSection({ title, items, icon }: { title: string; items: ContentItem[]; icon: React.ReactNode }) {
  if (!items.length) return null;
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-brand-purple/20 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => <ContentCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}

/* ─── TikTok SVG icon ─── */
function TikTokIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.81a4.83 4.83 0 01-1-.12z"/></svg>;
}
const SOCIAL_ICONS: Record<string, any> = { instagram: Instagram, facebook: Facebook, twitter: Twitter, youtube: Youtube, tiktok: TikTokIcon };

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function CountryPageClient({ country, newsItems, proItems, enthItems, juniorItems, tipItems }: {
  country: CountryData;
  newsItems: ContentItem[];
  proItems: ContentItem[];
  enthItems: ContentItem[];
  juniorItems: ContentItem[];
  tipItems: ContentItem[];
}) {
  const { t } = useLanguage();
  const hasSocial = Object.values(country.socialMedia).some(v => v);
  const hasStickyBanner = !!(country.stickyBannerImage);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* ╔══════════════════════════════════════╗
            ║  1. MAGAZINE HERO — Editorial piece  ║
            ╚══════════════════════════════════════╝ */}
        <section className="pt-16 pb-12 md:pt-20 md:pb-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center">
                <BookOpen size={20} className="text-brand-neon" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">
                  {country.flagEmoji} Dink Authority {country.name}
                </h2>
                <p className="text-brand-gray-dark text-sm mt-0.5">Digital Edition – Dink Authority World</p>
              </div>
            </div>

            {/* Magazine card — full-width editorial layout */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="bg-brand-gray rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Cover image — 3:4 portrait */}
                  <div className="relative aspect-[3/4] bg-brand-purple-light">
                    {country.magazineCover ? (
                      <Image src={country.magazineCover} alt={country.magazineTitle || `Dink Authority ${country.name}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-purple">
                        <BookOpen size={64} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-brand-neon text-brand-purple-dark text-[11px] font-bold uppercase tracking-widest rounded shadow-lg">
                        {country.flagEmoji} Current Issue
                      </span>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <span className="text-brand-purple text-xs font-bold uppercase tracking-widest mb-3">Dink Authority World</span>
                    <h1 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-brand-purple mb-4 leading-tight">
                      Dink Authority<br /><span className="text-brand-neon">{country.name}</span>
                    </h1>
                    {country.magazineTitle && (
                      <p className="text-brand-gray-dark text-base md:text-lg leading-relaxed mb-8">{country.magazineTitle}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      {country.magazineLink && (
                        <a href={country.magazineLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg">
                          <BookOpen size={16} /> Read Digital Edition
                        </a>
                      )}
                      {country.magazinePdfUrl && (
                        <a href={country.magazinePdfUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-purple/30 text-brand-purple font-bold rounded-lg hover:border-brand-neon hover:text-brand-neon transition-all text-sm uppercase tracking-wider">
                          <ExternalLink size={16} /> Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════╗
            ║  2. TOP BANNER                       ║
            ╚══════════════════════════════════════╝ */}
        <AdBanner image={country.bannerTopImage} link={country.bannerTopLink} />

        {/* ╔══════════════════════════════════════╗
            ║  3. NEWS                             ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.news')} items={newsItems} icon={<Newspaper size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  4. PRO PLAYERS                      ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.proPlayers')} items={proItems} icon={<Trophy size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  5. MID BANNER                       ║
            ╚══════════════════════════════════════╝ */}
        <AdBanner image={country.bannerMidImage} link={country.bannerMidLink} />

        {/* ╔══════════════════════════════════════╗
            ║  6. ENTHUSIASTS                      ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.enthusiasts')} items={enthItems} icon={<Heart size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  7. JUNIORS                          ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.juniors')} items={juniorItems} icon={<Users size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  8. TIPS                             ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.tips')} items={tipItems} icon={<Lightbulb size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  9. BOTTOM BANNER                    ║
            ╚══════════════════════════════════════╝ */}
        <AdBanner image={country.bannerBottomImage} link={country.bannerBottomLink} />

        {/* ╔══════════════════════════════════════╗
            ║  10. SOCIAL MEDIA                    ║
            ╚══════════════════════════════════════╝ */}
        {hasSocial && (
          <section className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="bg-gradient-to-r from-brand-purple to-brand-purple-light rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">{country.flagEmoji} Follow Dink Authority {country.name}</h2>
              <p className="text-white/60 text-sm mb-6">Stay connected with the local pickleball community</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {Object.entries(country.socialMedia).filter(([, v]) => v).map(([platform, url]) => {
                  const IconComp = SOCIAL_ICONS[platform];
                  if (!IconComp) return null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-brand-neon/20 flex items-center justify-center text-white hover:text-brand-neon transition-all">
                      {platform === 'tiktok' ? <IconComp /> : <IconComp size={22} />}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ╔══════════════════════════════════════╗
            ║  11. COMMUNITY CTA                   ║
            ╚══════════════════════════════════════╝ */}
        <section className="max-w-[1400px] mx-auto px-4 py-10">
          <Link href="/community" className="block bg-gradient-to-r from-brand-neon/10 to-brand-purple/5 rounded-2xl p-8 md:p-12 text-center hover:shadow-lg transition-all border border-brand-neon/20">
            <p className="text-brand-purple text-xs uppercase tracking-widest font-bold mb-2">{t('country.ctaTagline')}</p>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-brand-purple">{t('country.ctaCorrespondent')}</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">{t('country.ctaCorrespondentDesc')}</p>
            <span className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-brand-purple text-white font-bold rounded-lg text-sm hover:bg-brand-purple-light transition-colors">
              {t('country.ctaLearnMore')} <ArrowRight size={16} />
            </span>
          </Link>
        </section>

        {/* ╔══════════════════════════════════════╗
            ║  12. NEWSLETTER                      ║
            ╚══════════════════════════════════════╝ */}
        <NewsletterSignup />
      </main>

      {/* ╔══════════════════════════════════════╗
          ║  13. FOOTER                          ║
          ╚══════════════════════════════════════╝ */}
      <Footer />

      {/* Sticky banner spacer + component */}
      {hasStickyBanner && <div className="h-[100px] md:h-[90px]" />}
      {hasStickyBanner && (
        <StickyBanner
          desktopImage={country.stickyBannerImage!}
          mobileImage={country.stickyBannerMobileImage || country.stickyBannerImage!}
          link={country.stickyBannerLink || ''}
          newTab={true}
          closeEnabled={true}
        />
      )}

      <WhatsAppButton phoneNumber="" />
      <CookieBanner />
    </div>
  );
}