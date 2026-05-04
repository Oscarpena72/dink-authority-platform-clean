"use client";
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';
import { getArticlePath } from '@/lib/article-routes';

interface HeroArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  focalPointX?: number;
  focalPointY?: number;
  category: string;
  authorName: string | null;
  publishedAt: string | null;
}

interface HeroConfig {
  hero_mode?: string;
  hero_image_url?: string;
  hero_label?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_button_text?: string;
  hero_button_url?: string;
  hero_button2_text?: string;
  hero_button2_url?: string;
  hero_focal_x?: string;
  hero_focal_y?: string;
}

interface HeroStoryProps {
  article: HeroArticle | null;
  heroConfig?: HeroConfig;
}

export default function HeroStory({ article, heroConfig }: HeroStoryProps) {
  const { t } = useLanguage();
  const articleArray = useMemo(() => (article ? [article] : []), [article]);
  const translated = useTranslatedArticles(articleArray);
  const displayArticle = translated[0] || article;

  const isCustomMode = heroConfig?.hero_mode === 'custom' && heroConfig?.hero_image_url;

  // ===== CUSTOM EDITORIAL MODE =====
  if (isCustomMode) {
    const buttonUrl = heroConfig.hero_button_url || '#';
    const focalX = heroConfig.hero_focal_x ?? '50';
    const focalY = heroConfig.hero_focal_y ?? '50';

    return (
      <section className="relative bg-brand-purple-dark overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 neon-gradient z-10" />
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <Link href={buttonUrl}>
              <div className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] bg-brand-purple-light">
                <Image
                  src={heroConfig.hero_image_url!}
                  alt={heroConfig.hero_title || 'Featured story'}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                  style={{ objectPosition: `${focalX}% ${focalY}%` }}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-dark via-brand-purple-dark/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
                  <div className="max-w-3xl">
                    {heroConfig.hero_label && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-neon text-brand-purple-dark text-[11px] font-bold uppercase tracking-widest rounded mb-4">
                          <Zap size={12} className="fill-current" />
                          {heroConfig.hero_label}
                        </span>
                      </motion.div>
                    )}
                    {heroConfig.hero_title && (
                      <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.1] mb-3 md:mb-4 drop-shadow-lg"
                      >
                        {heroConfig.hero_title}
                      </motion.h1>
                    )}
                    {heroConfig.hero_subtitle && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-white/75 text-sm md:text-lg lg:text-xl max-w-2xl line-clamp-3 md:line-clamp-2 mb-4 md:mb-6 leading-relaxed"
                      >
                        {heroConfig.hero_subtitle}
                      </motion.p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="flex flex-wrap items-center gap-3 md:gap-5"
                    >
                      {heroConfig.hero_button_text && (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg shadow-brand-neon/30 group-hover:shadow-brand-neon/50">
                          {heroConfig.hero_button_text} <ArrowRight size={16} />
                        </span>
                      )}
                      {heroConfig.hero_button2_text && heroConfig.hero_button2_url && (
                        <Link href={heroConfig.hero_button2_url} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border-2 border-white/40 text-white font-bold rounded-lg hover:bg-white/10 transition-all text-sm uppercase tracking-wider">
                          {heroConfig.hero_button2_text}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  // ===== ARTICLE MODE (original behavior) =====
  if (!article) return null;

  return (
    <section className="relative bg-brand-purple-dark overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 neon-gradient z-10" />
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <Link href={getArticlePath(article?.slug ?? '', article?.category ?? 'news')}>
            <div className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] bg-brand-purple-light">
              {article?.imageUrl && (
                <Image
                  src={article.imageUrl}
                  alt={article?.title ?? 'Hero story'}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                  style={{ objectPosition: `${article?.focalPointX ?? 50}% ${article?.focalPointY ?? 50}%` }}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-dark via-brand-purple-dark/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-neon text-brand-purple-dark text-[11px] font-bold uppercase tracking-widest rounded mb-4">
                      <Zap size={12} className="fill-current" />
                      {article?.category ?? 'News'}
                    </span>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.1] mb-3 md:mb-4 drop-shadow-lg"
                  >
                    {displayArticle?.title ?? 'Featured Story'}
                  </motion.h1>
                  {displayArticle?.excerpt && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-white/75 text-sm md:text-lg lg:text-xl max-w-2xl line-clamp-3 md:line-clamp-2 mb-4 md:mb-6 leading-relaxed"
                    >
                      {displayArticle.excerpt}
                    </motion.p>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-3 md:gap-5"
                  >
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg shadow-brand-neon/30 group-hover:shadow-brand-neon/50">
                      {t('hero.readFullStory')} <ArrowRight size={16} />
                    </span>
                    {article?.authorName && (
                      <span className="text-white/50 text-sm font-medium">By {article.authorName}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
