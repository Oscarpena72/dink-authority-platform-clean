"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';

interface HeroStoryProps {
  article: {
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
  } | null;
}

export default function HeroStory({ article }: HeroStoryProps) {
  const { t } = useLanguage();
  const translated = useTranslatedArticles(article ? [article] : []);
  const displayArticle = translated[0] || article;
  if (!article) return null;
  return (
    <section className="relative bg-brand-purple-dark overflow-hidden">
      {/* Decorative neon accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 neon-gradient z-10" />
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <Link href={`/articles/${article?.slug ?? ''}`}>
            <div className="relative aspect-[16/9] bg-brand-purple-light">
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
              {/* Multi-layer gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-dark via-brand-purple-dark/50 to-transparent" />
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
                    className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.05] mb-4 drop-shadow-lg"
                  >
                    {displayArticle?.title ?? 'Featured Story'}
                  </motion.h1>
                  {displayArticle?.excerpt && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-white/75 text-sm md:text-lg lg:text-xl max-w-2xl line-clamp-2 mb-6 leading-relaxed"
                    >
                      {displayArticle.excerpt}
                    </motion.p>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="flex items-center gap-5"
                  >
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg shadow-brand-neon/30 group-hover:shadow-brand-neon/50">
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
