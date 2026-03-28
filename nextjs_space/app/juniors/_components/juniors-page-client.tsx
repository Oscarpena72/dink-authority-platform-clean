"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import StickyBanner from '@/app/_components/sticky-banner';

export default function JuniorsPageClient({ juniors, bannerData }: { juniors: any[]; bannerData?: any }) {
  const { t } = useLanguage();
  // Translate junior titles and excerpts for non-EN locales
  const translatedJuniors = useTranslatedArticles(juniors ?? []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
      {/* Hero Banner */}
      <section className="relative bg-brand-purple overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-neon rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-brand-neon/20 text-brand-neon text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              ⭐ Next Gen
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-4">
              {t('juniors.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {t('juniors.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Juniors Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {translatedJuniors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('juniors.noJuniors')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {translatedJuniors.map((junior: any, index: number) => (
              <motion.article
                key={junior?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/juniors/${junior?.slug ?? ''}`} className="block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                    {junior?.featuredImage && (
                      <Image
                        src={junior.featuredImage}
                        alt={junior?.name ?? 'Junior player'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-heading font-bold text-white mb-1">{junior?.name ?? ''}</h3>
                      <div className="flex items-center gap-2 text-white/70 text-xs">
                        {junior?.country && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {junior.country}
                          </span>
                        )}
                        {junior?.age && (
                          <span>{junior.age} {t('juniors.yearsOld')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-heading font-bold text-brand-purple group-hover:text-brand-purple-light transition-colors line-clamp-2">
                      {junior?.title ?? 'Untitled'}
                    </h2>
                    {junior?.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">{junior.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-brand-purple text-sm font-semibold pt-2 group-hover:gap-2 group-hover:text-brand-purple-light transition-all">
                      {t('juniors.readStory')} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
      </main>

      {/* Sticky bottom banner spacer + component */}
      {bannerData && <div className="h-[100px] md:h-[90px]" />}
      {bannerData && (
        <StickyBanner
          desktopImage={bannerData.desktopImage}
          mobileImage={bannerData.mobileImage}
          link={bannerData.link}
          newTab={bannerData.newTab}
          closeEnabled={bannerData.closeEnabled}
        />
      )}

      <Footer />
    </div>
  );
}
