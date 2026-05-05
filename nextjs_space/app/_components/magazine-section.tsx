"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

interface EditionItem {
  id: string;
  title: string;
  slug: string | null;
  issueNumber: string | null;
  coverUrl: string | null;
  description: string | null;
  externalUrl: string | null;
  isCurrent: boolean;
  currentFor?: string;
  publishDate: string;
}

export default function MagazineSection({ editions, region = 'central' }: { editions: EditionItem[]; region?: string }) {
  const items = editions ?? [];
  if (items.length === 0) return null;

  // Find current edition for this region using currentFor field, fallback to isCurrent, then latest
  const currentEdition = items.find((e: EditionItem) => {
    try {
      const regions: string[] = JSON.parse(e?.currentFor || '[]');
      return regions.includes(region);
    } catch { return false; }
  }) ?? items.find((e: EditionItem) => e?.isCurrent) ?? items[0];
  const pastEditions = items.filter((e: EditionItem) => e?.id !== currentEdition?.id).slice(0, 3);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center">
            <BookOpen size={20} className="text-brand-neon" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">The Magazine</h2>
            <p className="text-brand-gray-dark text-sm mt-0.5">Dink Authority Magazine – digital editions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Current Edition - large */}
          {currentEdition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-brand-gray rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-[3/4] bg-brand-purple-light">
                    {currentEdition?.coverUrl ? (
                      <Image src={currentEdition.coverUrl} alt={currentEdition?.title ?? 'Magazine cover'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-purple">
                        <BookOpen size={64} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-brand-neon text-brand-purple-dark text-[11px] font-bold uppercase tracking-widest rounded shadow-lg">Current Issue</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    {currentEdition?.issueNumber && (
                      <span className="text-brand-purple text-xs font-bold uppercase tracking-widest mb-2">{currentEdition.issueNumber}</span>
                    )}
                    <h3 className="font-heading font-bold text-2xl text-brand-purple mb-3 leading-tight">{currentEdition?.title ?? ''}</h3>
                    {currentEdition?.description && (
                      <p className="text-brand-gray-dark text-sm leading-relaxed mb-5 line-clamp-3">{currentEdition.description}</p>
                    )}
                    <p className="text-brand-gray-dark text-xs mb-4">
                      {currentEdition?.publishDate ? new Date(currentEdition.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                    </p>
                    {currentEdition?.externalUrl ? (
                      <a
                        href={currentEdition.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider self-start"
                      >
                        Read Now <ExternalLink size={14} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Past Editions */}
          {pastEditions.length > 0 && (
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-brand-purple uppercase text-sm tracking-wider">Previous Editions</h3>
              {pastEditions.map((edition: EditionItem, i: number) => (
                <motion.div
                  key={edition?.id ?? i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-brand-gray rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/20 transition-all group sport-card">
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-brand-purple-light">
                        {edition?.coverUrl ? (
                          <Image src={edition.coverUrl} alt={edition?.title ?? ''} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-brand-purple-light">
                            <BookOpen size={20} className="text-white/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {edition?.issueNumber && (
                          <span className="text-brand-purple text-[10px] font-bold uppercase tracking-widest">{edition.issueNumber}</span>
                        )}
                        <h4 className="font-heading font-bold text-sm text-brand-purple group-hover:text-brand-neon transition-colors line-clamp-2">{edition?.title ?? ''}</h4>
                        <p className="text-brand-gray-dark text-xs mt-1">
                          {edition?.publishDate ? new Date(edition.publishDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </div>
                      {edition?.externalUrl ? (
                        <a href={edition.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:text-brand-neon flex-shrink-0">
                          <ExternalLink size={16} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
