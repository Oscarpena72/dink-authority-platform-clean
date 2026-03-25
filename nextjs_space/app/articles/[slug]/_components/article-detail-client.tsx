"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';

export default function ArticleDetailClient({ article, relatedArticles }: { article: any; relatedArticles: any[] }) {
  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator?.share) {
        await navigator.share({ title: article?.title ?? '', url: window?.location?.href ?? '' });
      }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero image */}
        {article?.imageUrl && (
          <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[420px] lg:h-[460px] bg-brand-purple overflow-hidden">
            <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover" style={{ objectPosition: `${article?.focalPointX ?? 50}% ${article?.focalPointY ?? 50}%` }} sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/80 to-transparent" />
          </div>
        )}

        <article className="max-w-[800px] mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-brand-gray-dark hover:text-brand-purple transition-colors mb-6">
              <ArrowLeft size={16} /> Back to Articles
            </Link>

            <span className="inline-block px-3 py-1 bg-brand-neon/15 text-brand-purple text-xs font-bold uppercase tracking-wider rounded mb-4">
              {article?.category ?? 'News'}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-purple leading-tight mb-6">
              {article?.title ?? ''}
            </h1>

            <div className="flex items-center gap-6 text-sm text-brand-gray-dark mb-8 pb-8 border-b border-brand-gray">
              {article?.authorName && (
                <div className="flex items-center gap-2">
                  <User size={14} /> {article.authorName}
                </div>
              )}
              {article?.publishedAt && (
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
              <button onClick={handleShare} className="flex items-center gap-2 hover:text-brand-purple transition-colors">
                <Share2 size={14} /> Share
              </button>
            </div>

            <div
              className="prose prose-lg max-w-none text-brand-purple/80"
              dangerouslySetInnerHTML={{ __html: article?.content ?? '' }}
            />
          </motion.div>
        </article>

        {/* Related articles */}
        {(relatedArticles ?? []).length > 0 && (
          <section className="bg-brand-gray py-12">
            <div className="max-w-[1200px] mx-auto px-4">
              <h2 className="text-2xl font-heading font-bold text-brand-purple mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(relatedArticles ?? []).map((a: any, i: number) => (
                  <Link key={a?.id ?? i} href={`/articles/${a?.slug ?? ''}`} className="group block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <div className="relative aspect-[4/3] bg-brand-gray">
                        {a?.imageUrl && <Image src={a.imageUrl} alt={a?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: `${a?.focalPointX ?? 50}% ${a?.focalPointY ?? 50}%` }} sizes="(max-width: 768px) 100vw, 33vw" />}
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-brand-purple group-hover:text-brand-neon transition-colors line-clamp-2">
                          {a?.title ?? ''}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={null} />
    </div>
  );
}
