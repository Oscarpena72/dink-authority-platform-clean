"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroStoryProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    imageUrl: string | null;
    category: string;
    authorName: string | null;
    publishedAt: string | null;
  } | null;
}

export default function HeroStory({ article }: HeroStoryProps) {
  if (!article) return null;
  return (
    <section className="bg-brand-purple">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-lg overflow-hidden group"
        >
          <Link href={`/articles/${article?.slug ?? ''}`}>
            <div className="relative aspect-[16/7] md:aspect-[16/6] bg-brand-purple-light">
              {article?.imageUrl && (
                <Image
                  src={article.imageUrl}
                  alt={article?.title ?? 'Hero story'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className="inline-block px-3 py-1 bg-brand-neon text-brand-purple text-xs font-bold uppercase tracking-wider rounded mb-3">
                  {article?.category ?? 'News'}
                </span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-3">
                  {article?.title ?? 'Featured Story'}
                </h1>
                {article?.excerpt && (
                  <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-neon text-brand-purple font-bold rounded hover:bg-brand-neon-dim transition-colors text-sm">
                    Read Full Story <ArrowRight size={16} />
                  </span>
                  {article?.authorName && (
                    <span className="text-white/60 text-sm">By {article.authorName}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
