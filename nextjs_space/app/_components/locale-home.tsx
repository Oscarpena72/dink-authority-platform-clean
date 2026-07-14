"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Star, ArrowRight } from 'lucide-react';
import Header from './header';
import Footer from './footer';
import SponsorBannerCarousel from './sponsor-banner-carousel';
import UpcomingEvents from './upcoming-events';
import RecentResults from './recent-results';
import NewsletterSignup from './newsletter-signup';
import WhatsAppButton from './whatsapp-button';
import CookieBanner from './cookie-banner';
import StickyBanner from './sticky-banner';
import { useLanguage } from '@/lib/i18n/language-context';
import { t as translate, type Locale } from '@/lib/i18n/translations';
import { getLocaleArticlePath, getLocaleSectionPath } from '@/lib/article-routes';
import type { LocaleHomeData, LocaleEdition } from '@/lib/locale-home-data';

const DATE_LOCALE: Record<Locale, string> = { en: 'en-US', es: 'es-ES', pt: 'pt-BR' };

function editionReadHref(ed: LocaleEdition | null): string | null {
  if (!ed) return null;
  if (ed.slug && ed.pdfCloudPath) return `/magazine/${ed.slug}`;
  if (ed.externalUrl) return ed.externalUrl;
  return null;
}

export default function LocaleHome({ locale, data }: { locale: Locale; data: LocaleHomeData }) {
  const { setLocale } = useLanguage();
  const { currentEdition, pastEditions, featuredArticles, events, results, settings } = data ?? ({} as LocaleHomeData);

  // Sync the global language context to this page's locale so shared
  // components (header, events, results) render in the right language.
  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  const tr = (key: any) => translate(key, locale);
  const dateLoc = DATE_LOCALE[locale] ?? 'en-US';

  const currentHref = editionReadHref(currentEdition);
  const isExternal = currentHref?.startsWith('http');

  // Sticky banner config (same logic as English homepage)
  const active = settings?.sticky_banner_active === 'true';
  const desktopImage = settings?.sticky_banner_image_desktop ?? '';
  const mobileImage = settings?.sticky_banner_image_mobile ?? '';
  const bannerData = active && (desktopImage || mobileImage)
    ? {
        desktopImage,
        mobileImage,
        link: settings?.sticky_banner_link ?? '',
        newTab: settings?.sticky_banner_newtab === 'true',
        closeEnabled: settings?.sticky_banner_close_enabled !== 'false',
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Sponsor banner (parity with English home) */}
        <SponsorBannerCarousel section="homepage" variant="homepage" className="bg-white" />

        {/* ══ 1. CURRENT EDITION HERO ══ */}
        <section className="pt-14 pb-12 md:pt-16 md:pb-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center">
                <BookOpen size={20} className="text-brand-neon" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">{tr('magazine.title')}</h1>
                <p className="text-brand-gray-dark text-sm mt-0.5">{tr('magazine.subtitle')}</p>
              </div>
            </div>

            {currentEdition ? (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="bg-brand-gray rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 group">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative aspect-[3/4] bg-brand-purple-light">
                      {currentEdition.coverUrl ? (
                        currentHref ? (
                          isExternal ? (
                            <a href={currentHref} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
                              <Image src={currentEdition.coverUrl} alt={currentEdition.title || 'Cover'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            </a>
                          ) : (
                            <Link href={currentHref} className="absolute inset-0">
                              <Image src={currentEdition.coverUrl} alt={currentEdition.title || 'Cover'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            </Link>
                          )
                        ) : (
                          <Image src={currentEdition.coverUrl} alt={currentEdition.title || 'Cover'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-brand-purple">
                          <BookOpen size={64} className="text-white/30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-brand-neon text-brand-purple-dark text-[11px] font-bold uppercase tracking-widest rounded shadow-lg">{tr('magazine.current')}</span>
                      </div>
                    </div>

                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                      {currentEdition.issueNumber && (
                        <span className="text-brand-purple text-xs font-bold uppercase tracking-widest mb-3">{currentEdition.issueNumber}</span>
                      )}
                      <h2 className="font-heading font-black text-3xl md:text-4xl text-brand-purple mb-4 leading-tight">{currentEdition.title}</h2>
                      {currentEdition.description && (
                        <p className="text-brand-gray-dark text-base md:text-lg leading-relaxed mb-6 line-clamp-4">{currentEdition.description}</p>
                      )}
                      {currentEdition.publishDate && (
                        <p className="text-brand-gray-dark text-xs mb-6">{new Date(currentEdition.publishDate).toLocaleDateString(dateLoc, { month: 'long', year: 'numeric' })}</p>
                      )}
                      {currentHref && (
                        isExternal ? (
                          <a href={currentHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg self-start">
                            <ExternalLink size={16} /> {tr('magazine.readEdition')}
                          </a>
                        ) : (
                          <Link href={currentHref} className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg self-start">
                            <BookOpen size={16} /> {tr('magazine.readEdition')}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-brand-gray/40 py-16 text-center">
                <BookOpen size={40} className="text-brand-purple/30 mx-auto mb-4" />
                <p className="text-brand-gray-dark text-sm">{tr('magazine.subtitle')}</p>
              </div>
            )}
          </div>
        </section>

        {/* ══ 2. FEATURED STORIES (locale) ══ */}
        {featuredArticles?.length > 0 && (
          <section className="py-14 bg-white">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center">
                  <Star size={20} className="text-brand-neon" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">{tr('featured.title')}</h2>
                  <p className="text-brand-gray-dark text-sm mt-0.5">{tr('featured.subtitle')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {featuredArticles.slice(0, 3).map((article: any, i: number) => (
                  <motion.div key={article?.id ?? i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Link href={getLocaleArticlePath(article?.slug ?? '', article?.category ?? 'news', locale)} className="group block h-full sport-card">
                      <div className="bg-brand-gray rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/30 h-full flex flex-col">
                        <div className="relative aspect-[4/3] bg-brand-gray">
                          {article?.imageUrl && (
                            <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: `${article?.focalPointX ?? 50}% ${article?.focalPointY ?? 50}%` }} sizes="(max-width: 1024px) 100vw, 33vw" />
                          )}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">
                            <Star size={10} className="fill-current" /> {tr('featured.badge')}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <span className="text-[11px] font-bold text-brand-purple uppercase tracking-widest mb-2">{article?.category ?? ''}</span>
                          <h3 className="font-heading font-bold text-lg text-brand-purple group-hover:text-brand-neon transition-colors mb-3 leading-snug">{article?.title ?? ''}</h3>
                          {article?.excerpt && <p className="text-sm text-brand-gray-dark line-clamp-3 mb-5 flex-1 leading-relaxed">{article.excerpt}</p>}
                          <div className="flex items-center gap-2 text-brand-purple font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                            {tr('featured.readMore')} <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ 3. UPCOMING EVENTS (global) ══ */}
        <UpcomingEvents events={events ?? []} locale={locale} />

        {/* ══ 4. RECENT RESULTS (global) ══ */}
        <RecentResults results={results ?? []} locale={locale} />

        {/* ══ 5. PREVIOUS EDITIONS (locale) ══ */}
        {pastEditions?.length > 0 && (
          <section className="py-14 bg-brand-gray">
            <div className="max-w-[1400px] mx-auto px-4">
              <h2 className="font-heading font-bold text-brand-purple uppercase text-lg tracking-wider mb-8">{tr('magazine.title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEditions.map((edition: LocaleEdition, i: number) => {
                  const href = editionReadHref(edition);
                  const ext = href?.startsWith('http');
                  const Card = (
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/20 hover:shadow-lg transition-all group h-full">
                      <div className="flex items-center gap-4 p-4">
                        <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-brand-purple-light">
                          {edition?.coverUrl ? (
                            <Image src={edition.coverUrl} alt={edition?.title ?? ''} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-brand-purple-light">
                              <BookOpen size={20} className="text-white/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {edition?.issueNumber && (
                            <span className="text-brand-purple text-[10px] font-bold uppercase tracking-widest">{edition.issueNumber}</span>
                          )}
                          <h3 className="font-heading font-bold text-sm text-brand-purple group-hover:text-brand-neon transition-colors line-clamp-2">{edition?.title ?? ''}</h3>
                          <p className="text-brand-gray-dark text-xs mt-1">{edition?.publishDate ? new Date(edition.publishDate).toLocaleDateString(dateLoc, { month: 'short', year: 'numeric' }) : ''}</p>
                        </div>
                        {href && (ext ? <ExternalLink size={16} className="text-brand-purple flex-shrink-0" /> : <BookOpen size={16} className="text-brand-purple flex-shrink-0" />)}
                      </div>
                    </div>
                  );
                  if (!href) return <div key={edition?.id ?? i}>{Card}</div>;
                  return ext ? (
                    <a key={edition?.id ?? i} href={href} target="_blank" rel="noopener noreferrer" className="block sport-card">{Card}</a>
                  ) : (
                    <Link key={edition?.id ?? i} href={href} className="block sport-card">{Card}</Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══ 6. NEWSLETTER ══ */}
        <NewsletterSignup />
      </main>
      <Footer />
      {bannerData && <div className="h-[100px] md:h-[90px]" />}
      {bannerData && (
        <StickyBanner desktopImage={bannerData.desktopImage} mobileImage={bannerData.mobileImage} link={bannerData.link} newTab={bannerData.newTab} closeEnabled={bannerData.closeEnabled} />
      )}
      <WhatsAppButton phoneNumber={settings?.whatsapp_number ?? null} />
      <CookieBanner />
    </div>
  );
}
