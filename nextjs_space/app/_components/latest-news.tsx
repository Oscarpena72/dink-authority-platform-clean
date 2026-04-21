"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';
import { getArticlePath } from '@/lib/article-routes';
import CommunityCta from './community-cta';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  focalPointX?: number;
  focalPointY?: number;
  category: string;
  publishedAt: string | null;
  authorName: string | null;
}

export default function LatestNews({ articles }: { articles: ArticleItem[] }) {
  const { t } = useLanguage();
  const translated = useTranslatedArticles(articles ?? []);
  const items = translated ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-14 bg-brand-gray">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-brand-neon rounded-full" />
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">Latest News</h2>
              <p className="text-brand-gray-dark text-sm mt-0.5">{t('latestNews.subtitle')}</p>
            </div>
          </div>
          <Link href="/news" className="flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:text-brand-purple-light transition-colors uppercase tracking-wider">
            {t('latestNews.viewAll')} <ChevronRight size={16} className="text-brand-neon" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.slice(0, 6).map((article: ArticleItem, i: number) => (
            <React.Fragment key={article?.id ?? i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={getArticlePath(article?.slug ?? '', article?.category ?? 'news')} className="group block sport-card">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/30 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-brand-gray">
                      {article?.imageUrl && (
                        <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: `${article?.focalPointX ?? 50}% ${article?.focalPointY ?? 50}%` }} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-neon text-brand-purple-dark text-[10px] font-bold uppercase tracking-widest rounded">
                        {article?.category ?? 'News'}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-brand-purple group-hover:text-brand-neon transition-colors line-clamp-2 mb-3 text-[17px] leading-snug">
                        {article?.title ?? 'Untitled'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-brand-gray-dark">
                        {article?.authorName && (
                          <span className="font-medium">{article.authorName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
              {/* Community CTA after 5th news item */}
              {i === 4 && <CommunityCta />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
