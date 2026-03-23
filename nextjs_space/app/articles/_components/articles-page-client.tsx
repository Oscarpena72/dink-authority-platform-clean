"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'News', value: 'news' },
  { label: 'Pro Players', value: 'pro-players' },
  { label: 'Enthusiasts', value: 'enthusiasts' },
  { label: 'Results', value: 'results' },
  { label: 'Events', value: 'events' },
  { label: 'Gear', value: 'gear' },
  { label: 'Magazine', value: 'magazine' },
  { label: 'LATAM', value: 'latam' },
];

interface Props {
  articles: any[];
  currentPage: number;
  totalPages: number;
  query: string;
  category: string;
}

export default function ArticlesPageClient({ articles, currentPage, totalPages, query, category }: Props) {
  const router = useRouter();
  const items = articles ?? [];

  const buildUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([k, v]: any) => { if (v) p.set(k, v); });
    return `/articles?${p.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        {/* Page header */}
        <div className="bg-brand-purple py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Articles & News</h1>
            <p className="text-white/60">Stay updated with the latest pickleball stories, insights, and analysis.</p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-brand-gray-dark" />
              {CATEGORIES.map((c: any) => (
                <button
                  key={c?.value ?? 'all'}
                  onClick={() => router.push(buildUrl({ category: c?.value ?? '', q: query }))}
                  className={`px-3 py-1.5 text-sm rounded-full font-semibold transition-all ${
                    (category ?? '') === (c?.value ?? '')
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-gray text-brand-purple hover:bg-brand-blue/10'
                  }`}
                >
                  {c?.label}
                </button>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} className="text-brand-gray-dark mx-auto mb-4" />
              <p className="text-brand-gray-dark text-lg">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((article: any, i: number) => (
                <motion.div
                  key={article?.id ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/articles/${article?.slug ?? ''}`} className="group block">
                    <div className="bg-brand-gray rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <div className="relative aspect-video bg-brand-gray">
                        {article?.imageUrl && (
                          <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <span className="absolute top-3 left-3 px-2 py-1 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-wider rounded">
                          {article?.category ?? 'News'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-brand-purple group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">
                          {article?.title ?? ''}
                        </h3>
                        {article?.excerpt && <p className="text-sm text-brand-gray-dark line-clamp-2 mb-2">{article.excerpt}</p>}
                        <div className="flex items-center gap-2 text-xs text-brand-gray-dark">
                          <Clock size={12} />
                          <span>{article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => router.push(buildUrl({ category, q: query, page: String(Math.max(1, currentPage - 1)) }))}
                disabled={currentPage <= 1}
                className="p-2 rounded bg-brand-gray hover:bg-brand-blue hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i: number) => i + 1).map((p: number) => (
                <button
                  key={p}
                  onClick={() => router.push(buildUrl({ category, q: query, page: String(p) }))}
                  className={`w-10 h-10 rounded font-bold text-sm transition-all ${
                    p === currentPage ? 'bg-brand-blue text-white' : 'bg-brand-gray text-brand-purple hover:bg-brand-blue/10'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => router.push(buildUrl({ category, q: query, page: String(Math.min(totalPages, currentPage + 1)) }))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded bg-brand-gray hover:bg-brand-blue hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={null} />
    </div>
  );
}
