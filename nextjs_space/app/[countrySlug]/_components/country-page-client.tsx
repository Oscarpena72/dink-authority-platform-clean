"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ExternalLink, Instagram, Facebook, Twitter, Youtube, Clock, ChevronRight, Newspaper, Trophy, Heart, Users, Lightbulb } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import NewsletterSignup from '@/app/_components/newsletter-signup';
import WhatsAppButton from '@/app/_components/whatsapp-button';
import CookieBanner from '@/app/_components/cookie-banner';
import StickyBanner from '@/app/_components/sticky-banner';
import FeaturedArticles from '@/app/_components/featured-articles';
import UpcomingEvents from '@/app/_components/upcoming-events';
import RecentResults from '@/app/_components/recent-results';
import CommunityCta from '@/app/_components/community-cta';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';

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

/* ─── Ad Banner (same style as homepage AdBanner) ─── */
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

/* ─── Content Card (same style as homepage LatestNews cards) ─── */
function ContentCard({ item }: { item: ContentItem }) {
  const displayTitle = item.title || item.name || '';
  return (
    <Link href={item.path} className="group block sport-card">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/30 transition-all duration-300 h-full">
          <div className="relative aspect-[4/3] bg-brand-gray">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={displayTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: `${item.focalPointX ?? 50}% ${item.focalPointY ?? 50}%` }} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-neon/10 flex items-center justify-center text-brand-purple/40 text-4xl font-bold">DA</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {item.category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-neon text-brand-purple-dark text-[10px] font-bold uppercase tracking-widest rounded">{item.category}</span>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-heading font-bold text-brand-purple group-hover:text-brand-neon transition-colors line-clamp-2 mb-3 text-[17px] leading-snug">{displayTitle}</h3>
            {item.excerpt && <p className="text-sm text-brand-gray-dark line-clamp-2 mb-3">{item.excerpt}</p>}
            <div className="flex items-center gap-2 text-xs text-brand-gray-dark">
              <Clock size={12} className="text-brand-neon/60" />
              {item.publishedAt && (
                <span>{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              )}
              {item.authorName && (
                <>
                  <span className="text-brand-neon">·</span>
                  <span className="font-medium">{item.authorName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Content Section with icon + "View All" link ─── */
function ContentSection({ title, items, icon, viewAllHref, viewAllLabel }: {
  title: string; items: ContentItem[]; icon: React.ReactNode;
  viewAllHref?: string; viewAllLabel?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="py-14 bg-brand-gray">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">{title}</h2>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:text-brand-purple-light transition-colors uppercase tracking-wider">
              {viewAllLabel || 'View All'} <ChevronRight size={16} className="text-brand-neon" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {items.map((item) => <ContentCard key={item.id} item={item} />)}
        </div>
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
export default function CountryPageClient({ country, newsItems, proItems, enthItems, juniorItems, tipItems, featuredArticles, events, results }: {
  country: CountryData;
  newsItems: ContentItem[];
  proItems: ContentItem[];
  enthItems: ContentItem[];
  juniorItems: ContentItem[];
  tipItems: ContentItem[];
  featuredArticles: any[];
  events: any[];
  results: any[];
}) {
  const { t } = useLanguage();
  const hasSocial = Object.values(country.socialMedia).some(v => v);
  const hasStickyBanner = !!(country.stickyBannerImage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ╔══════════════════════════════════════╗
            ║  1. MAGAZINE HERO — Editorial piece  ║
            ╚══════════════════════════════════════╝ */}
        <section className="pt-16 pb-12 md:pt-20 md:pb-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
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

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="bg-brand-gray rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="grid grid-cols-1 md:grid-cols-2">
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
            ║  3. NEWS (with View All + 4-col grid)║
            ╚══════════════════════════════════════╝ */}
        <ContentSection
          title={t('nav.news')}
          items={newsItems}
          icon={<Newspaper size={20} className="text-brand-neon" />}
          viewAllHref="/articles"
          viewAllLabel={t('latestNews.viewAll')}
        />

        {/* ╔══════════════════════════════════════╗
            ║  4. FEATURED STORIES (homepage comp) ║
            ╚══════════════════════════════════════╝ */}
        <FeaturedArticles articles={featuredArticles} />

        {/* ╔══════════════════════════════════════╗
            ║  5. PRO PLAYERS (4-col grid)         ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.proPlayers')} items={proItems} icon={<Trophy size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  6. MID BANNER                       ║
            ╚══════════════════════════════════════╝ */}
        <AdBanner image={country.bannerMidImage} link={country.bannerMidLink} />

        {/* ╔══════════════════════════════════════╗
            ║  7. ENTHUSIASTS (4-col grid)         ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.enthusiasts')} items={enthItems} icon={<Heart size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  8. JUNIORS (4-col grid)             ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection title={t('nav.juniors')} items={juniorItems} icon={<Users size={20} className="text-brand-neon" />} />

        {/* ╔══════════════════════════════════════╗
            ║  9. TIPS (4-col grid)                ║
            ╚══════════════════════════════════════╝ */}
        <ContentSection
          title={t('nav.tips')}
          items={tipItems}
          icon={<Lightbulb size={20} className="text-brand-neon" />}
          viewAllHref="/tips"
          viewAllLabel={t('latestNews.viewAll')}
        />

        {/* ╔══════════════════════════════════════╗
            ║  10. BOTTOM BANNER                   ║
            ╚══════════════════════════════════════╝ */}
        <AdBanner image={country.bannerBottomImage} link={country.bannerBottomLink} />

        {/* ╔══════════════════════════════════════╗
            ║  11. UPCOMING EVENTS (homepage comp) ║
            ╚══════════════════════════════════════╝ */}
        <UpcomingEvents events={events} />

        {/* ╔══════════════════════════════════════╗
            ║  12. RECENT RESULTS (homepage comp)  ║
            ╚══════════════════════════════════════╝ */}
        <RecentResults results={results} />

        {/* ╔══════════════════════════════════════╗
            ║  13. SOCIAL MEDIA                    ║
            ╚══════════════════════════════════════╝ */}
        {hasSocial && (
          <section className="py-14 bg-brand-purple relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="max-w-[1400px] mx-auto px-4 relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-brand-neon/15 flex items-center justify-center">
                  <Instagram size={20} className="text-brand-neon" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">{country.flagEmoji} Follow Dink Authority {country.name}</h2>
                  <p className="text-white/50 text-sm mt-0.5">Stay connected with the local pickleball community</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {Object.entries(country.socialMedia).filter(([, v]) => v).map(([platform, url]) => {
                  const IconComp = SOCIAL_ICONS[platform];
                  if (!IconComp) return null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="w-14 h-14 rounded-xl bg-white/10 hover:bg-brand-neon/20 flex items-center justify-center text-white hover:text-brand-neon transition-all">
                      {platform === 'tiktok' ? <IconComp /> : <IconComp size={24} />}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ╔══════════════════════════════════════╗
            ║  14. YOU ARE THE REPORTER (homepage)  ║
            ╚══════════════════════════════════════╝ */}
        <section className="py-14 bg-brand-gray">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <CommunityCta />
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════╗
            ║  15. NEWSLETTER                      ║
            ╚══════════════════════════════════════╝ */}
        <NewsletterSignup />
      </main>

      {/* ╔══════════════════════════════════════╗
          ║  16. FOOTER                          ║
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
