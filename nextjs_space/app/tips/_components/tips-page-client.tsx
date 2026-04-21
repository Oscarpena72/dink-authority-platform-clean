"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import StickyBanner from '@/app/_components/sticky-banner';
import SponsorBannerCarousel from '@/app/_components/sponsor-banner-carousel';
import { getArticlePath } from '@/lib/article-routes';

export default function TipsPageClient({ tips, bannerData }: { tips: any[]; bannerData?: any }) {
  const { t } = useLanguage();
  const translated = useTranslatedArticles(tips ?? []);

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-brand-neon/20 text-brand-neon text-xs font-bold uppercase tracking-widest rounded-full mb-4">Pro Tips</span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-4">{t('tips.title')}</h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">{t('tips.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <SponsorBannerCarousel className="py-6" section="tips" />

      {/* Tips Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {translated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('tips.noTips')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {translated.map((tip: any, index: number) => (
              <motion.article
                key={tip?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={getArticlePath(tip?.slug ?? '', tip?.category ?? 'tips')} className="block">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                    {tip?.imageUrl && (
                      <Image
                        src={tip.imageUrl}
                        alt={tip?.title ?? 'Tip'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-heading font-bold text-brand-purple group-hover:text-brand-purple-light transition-colors line-clamp-2">
                      {tip?.title ?? 'Untitled'}
                    </h2>
                    {tip?.excerpt && <p className="text-gray-600 text-sm line-clamp-2">{tip.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      {tip?.authorName && (
                        <span className="flex items-center gap-1"><User size={12} />{tip.authorName}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-brand-purple text-sm font-semibold pt-2 group-hover:gap-2 group-hover:text-brand-purple-light transition-all">
                      {t('tips.readTip')} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
      </main>

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
