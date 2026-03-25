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
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center">
            <Star size={20} className="text-brand-neon" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">Featured Stories</h2>
            <p className="text-brand-gray-dark text-sm mt-0.5">In-depth coverage and exclusive features</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {items.slice(0, 3).map((article: ArticleItem, i: number) => (
            <motion.div
              key={article?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <Link href={`/articles/${article?.slug ?? ''}`} className="group block h-full sport-card">
                <div className="bg-brand-gray rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/30 h-full flex flex-col">
                  <div className="relative aspect-[16/9] bg-brand-gray">
                    {article?.imageUrl && (
                      <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 33vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">
                      <Star size={10} className="fill-current" /> Featured
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[11px] font-bold text-brand-purple uppercase tracking-widest mb-2">{article?.category ?? ''}</span>
                    <h3 className="font-heading font-bold text-lg text-brand-purple group-hover:text-brand-neon transition-colors mb-3 leading-snug">
                      {article?.title ?? ''}
                    </h3>
                    {article?.excerpt && (
                      <p className="text-sm text-brand-gray-dark line-clamp-3 mb-5 flex-1 leading-relaxed">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 text-brand-purple font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
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
