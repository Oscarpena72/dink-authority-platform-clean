"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Tips' },
  { value: 'technique', label: 'Technique' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental-game', label: 'Mental Game' },
  { value: 'equipment', label: 'Equipment' },
];

export default function TipsPageClient({ tips, category }: { tips: any[]; category: string }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(category || '');

  const filtered = activeCategory
    ? (tips ?? []).filter((tip: any) => tip?.category === activeCategory)
    : tips ?? [];

  return (
    <main className="min-h-screen bg-white">
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
              Pro Tips
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-4">
              {t('tips.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {t('tips.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.value
                    ? 'bg-brand-purple text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No tips available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((tip: any, index: number) => (
              <motion.article
                key={tip?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/tips/${tip?.slug ?? ''}`} className="block">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                    {tip?.featuredImage && (
                      <Image
                        src={tip.featuredImage}
                        alt={tip?.title ?? 'Tip'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-brand-purple text-white text-xs font-bold uppercase rounded-full">
                      {tip?.category ?? 'tip'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-heading font-bold text-brand-purple group-hover:text-brand-purple-light transition-colors line-clamp-2">
                      {tip?.title ?? 'Untitled'}
                    </h2>
                    {tip?.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">{tip.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      {tip?.author?.name && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {tip.author.name}
                        </span>
                      )}
                      {tip?.publishDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(tip.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-brand-neon text-sm font-semibold pt-2 group-hover:gap-2 transition-all">
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
  );
}
