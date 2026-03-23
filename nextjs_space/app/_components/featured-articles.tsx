"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string;
  authorName: string | null;
}

export default function FeaturedArticles({ articles }: { articles: ArticleItem[] }) {
  const items = articles ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-brand-gray">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Star size={24} className="text-brand-neon" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">Featured Stories</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {items.slice(0, 3).map((article: ArticleItem, i: number) => (
            <motion.div
              key={article?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={`/articles/${article?.slug ?? ''}`} className="group block h-full">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[16/10] bg-brand-gray">
                    {article?.imageUrl && (
                      <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-brand-neon text-brand-purple text-[10px] font-bold uppercase tracking-wider rounded">
                      <Star size={10} /> Featured
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-bold text-brand-neon-dim uppercase tracking-wider mb-2">{article?.category ?? ''}</span>
                    <h3 className="font-heading font-bold text-lg text-brand-purple group-hover:text-brand-neon-dim transition-colors mb-3">
                      {article?.title ?? ''}
                    </h3>
                    {article?.excerpt && (
                      <p className="text-sm text-brand-gray-dark line-clamp-3 mb-4 flex-1">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 text-brand-purple font-semibold text-sm">
                      Read More <ArrowRight size={14} />
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
