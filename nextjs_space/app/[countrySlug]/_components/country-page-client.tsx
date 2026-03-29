"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ExternalLink, Instagram, Facebook, Twitter, Youtube, Clock } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import NewsletterSignup from '@/app/_components/newsletter-signup';
import WhatsAppButton from '@/app/_components/whatsapp-button';
import CookieBanner from '@/app/_components/cookie-banner';
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

function AdBanner({ image, link, label }: { image?: string | null; link?: string | null; label?: string }) {
  if (!image) return null;
  return (
    <div className="max-w-[1400px] mx-auto px-4 my-6">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-1">{label || 'Sponsored'}</p>
      <a href={link || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative w-full h-[70px] md:h-[100px]">
          <Image src={image} alt="Advertisement" fill className="object-cover" />
        </div>
      </a>
    </div>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  const displayTitle = item.title || item.name || '';
  const href = item.path;
  return (
    <Link href={href} className="group block">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
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

function ContentSection({ title, items, icon }: { title: string; items: ContentItem[]; icon?: React.ReactNode }) {
  if (!items.length) return null;
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-heading font-bold text-brand-purple">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-brand-purple/20 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item) => <ContentCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.81a4.83 4.83 0 01-1-.12z"/></svg>;
}
const SOCIAL_ICONS: Record<string, any> = { instagram: Instagram, facebook: Facebook, twitter: Twitter, youtube: Youtube, tiktok: TikTokIcon };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero: Country Branding + Magazine */}
      <section className="bg-gradient-to-br from-brand-purple via-brand-purple-dark to-brand-purple-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-[200px] leading-none">{country.flagEmoji}</div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Magazine Cover */}
            {country.magazineCover ? (
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0">
                <div className="relative w-[220px] h-[300px] md:w-[280px] md:h-[380px] rounded-xl overflow-hidden shadow-2xl shadow-black/40 border-2 border-white/20">
                  <Image src={country.magazineCover} alt={country.magazineTitle || 'Magazine'} fill className="object-cover" />
                </div>
              </motion.div>
            ) : null}

            {/* Country Title + Magazine Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <span className="text-4xl">{country.flagEmoji}</span>
                <span className="text-brand-neon text-xs uppercase tracking-widest font-bold">Dink Authority World</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight">
                Dink Authority<br /><span className="text-brand-neon">{country.name}</span>
              </h1>
              {country.magazineTitle && (
                <p className="text-white/70 text-lg mt-4">{country.magazineTitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-6 justify-center md:justify-start">
                {country.magazineLink && (
                  <a href={country.magazineLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all shadow-lg">
                    <BookOpen size={18} /> Read Digital Edition
                  </a>
                )}
                {country.magazinePdfUrl && (
                  <a href={country.magazinePdfUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-bold rounded-lg hover:border-brand-neon hover:text-brand-neon transition-all">
                    <ExternalLink size={18} /> Download PDF
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Banner */}
      <AdBanner image={country.bannerTopImage} link={country.bannerTopLink} />

      {/* Content Sections */}
      <ContentSection title={t('nav.news')} items={newsItems} icon={<div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center"><ArrowRight size={16} className="text-brand-purple" /></div>} />
      <ContentSection title={t('nav.proPlayers')} items={proItems} icon={<div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center">🏆</div>} />

      {/* Mid Banner */}
      <AdBanner image={country.bannerMidImage} link={country.bannerMidLink} />

      <ContentSection title={t('nav.enthusiasts')} items={enthItems} />
      <ContentSection title={t('nav.juniors')} items={juniorItems} />
      <ContentSection title={t('nav.tips')} items={tipItems} />

      {/* Bottom Banner */}
      <AdBanner image={country.bannerBottomImage} link={country.bannerBottomLink} />

      {/* Social Media Section */}
      {hasSocial && (
        <section className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="bg-gradient-to-r from-brand-purple to-brand-purple-light rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">{country.flagEmoji} Follow Dink Authority {country.name}</h2>
            <p className="text-white/60 text-sm mb-6">Stay connected with the local pickleball community</p>
            <div className="flex items-center justify-center gap-4">
              {Object.entries(country.socialMedia).filter(([, v]) => v).map(([platform, url]) => {
                const IconComp = SOCIAL_ICONS[platform];
                if (!IconComp) return null;
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-brand-neon/20 flex items-center justify-center text-white hover:text-brand-neon transition-all">
                    {typeof IconComp === 'function' && IconComp.toString().includes('svg') ? <IconComp /> : <IconComp size={22} />}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Community CTA */}
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        <Link href="/community" className="block bg-gradient-to-r from-brand-neon/10 to-brand-purple/5 rounded-2xl p-8 text-center hover:shadow-lg transition-all border border-brand-neon/20">
          <p className="text-brand-purple text-xs uppercase tracking-widest font-bold mb-2">{t('country.ctaTagline')}</p>
          <h3 className="text-xl font-heading font-bold text-brand-purple">{t('country.ctaCorrespondent')}</h3>
          <p className="text-gray-500 text-sm mt-2">{t('country.ctaCorrespondentDesc')}</p>
          <span className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-brand-purple text-white font-bold rounded-lg text-sm">
            {t('country.ctaLearnMore')} <ArrowRight size={16} />
          </span>
        </Link>
      </section>

      <NewsletterSignup />
      <Footer />
      <WhatsAppButton phoneNumber="" />
      <CookieBanner />

      {/* Sticky Banner */}
      {country.stickyBannerImage && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <a href={country.stickyBannerLink || '#'} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative w-full h-[80px] md:h-[90px]">
              <Image src={country.stickyBannerMobileImage || country.stickyBannerImage} alt="Banner" fill className="object-cover md:hidden" />
              <Image src={country.stickyBannerImage} alt="Banner" fill className="object-cover hidden md:block" />
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
