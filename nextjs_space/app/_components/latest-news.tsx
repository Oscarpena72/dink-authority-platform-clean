"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  category: string;
  publishedAt: string | null;
  authorName: string | null;
}

export default function LatestNews({ articles }: { articles: ArticleItem[] }) {
  const items = articles ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-neon rounded-full" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">Latest News</h2>
          </div>
          <Link href="/articles" className="flex items-center gap-1 text-sm font-semibold text-brand-purple hover:text-brand-neon transition-colors">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((article: ArticleItem, i: number) => (
            <motion.div
              key={article?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/articles/${article?.slug ?? ''}`} className="group block">
                <div className="bg-brand-gray rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-video bg-brand-gray">
                    {article?.imageUrl && (
                      <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <span className="absolute top-3 left-3 px-2 py-1 bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider rounded">
                      {article?.category ?? 'News'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-brand-purple group-hover:text-brand-neon-dim transition-colors line-clamp-2 mb-2">
                      {article?.title ?? 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-brand-gray-dark">
                      <Clock size={12} />
                      <span>{article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                      {article?.authorName && (
                        <>
                          <span>·</span>
                          <span>{article.authorName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
