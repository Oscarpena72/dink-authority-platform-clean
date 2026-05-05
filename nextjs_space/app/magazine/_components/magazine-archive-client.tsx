"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import { useLanguage } from '@/lib/i18n/language-context';
import SponsorBannerCarousel from '@/app/_components/sponsor-banner-carousel';
import ShareButtons from '@/app/magazine/[slug]/_components/share-buttons';

interface EditionItem {
  id: string;
  title: string;
  slug: string | null;
  issueNumber: string | null;
  coverUrl: string | null;
  description: string | null;
  externalUrl: string | null;
  pdfUrl: string | null;
  isCurrent: boolean;
  publishDate: string;
}

interface BannerData {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroData {
  headline: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundWord: string;
  backgroundImage?: string;
}

interface Props {
  editions: EditionItem[];
  banner: BannerData | null;
  hero?: HeroData | null;
  countryName?: string;
  countrySlug?: string;
}

function EditionCard({ edition, index, siteUrl }: { edition: EditionItem; index: number; siteUrl: string }) {
  const readUrl = edition?.externalUrl || edition?.pdfUrl || null;

  /* Absolute share URL for this edition */
  const shareUrl = edition?.slug
    ? `${siteUrl}/magazine/${edition.slug}`
    : (edition?.externalUrl ?? siteUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Cover image */}
        <div className="relative aspect-[3/4] bg-brand-purple-light overflow-hidden">
          {edition?.coverUrl ? (
            <Image
              src={edition.coverUrl}
              alt={edition?.title ?? 'Magazine cover'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-purple">
              <BookOpen size={48} className="text-white/30" />
            </div>
          )}
          {edition?.isCurrent && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-brand-neon text-brand-purple-dark text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">
                Current Issue
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {edition?.issueNumber && (
            <span className="text-brand-purple text-[10px] font-bold uppercase tracking-widest mb-1">
              {edition.issueNumber}
            </span>
          )}
          <h3 className="font-heading font-bold text-sm md:text-base text-brand-purple leading-tight mb-1 line-clamp-2 group-hover:text-brand-neon transition-colors">
            {edition?.title ?? ''}
          </h3>
          <p className="text-brand-gray-dark text-xs mb-3">
            {edition?.publishDate
              ? new Date(edition.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : ''}
          </p>
          <div className="mt-auto flex flex-col gap-2">
            {readUrl ? (
              edition?.slug ? (
                <Link
                  href={`/magazine/${edition.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-xs uppercase tracking-wider self-start"
                >
                  Read <ExternalLink size={12} />
                </Link>
              ) : (
                <a
                  href={readUrl}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-xs uppercase tracking-wider self-start"
                >
                  Read <ExternalLink size={12} />
                </a>
              )
            ) : null}
            {/* Compact share buttons */}
            <ShareButtons url={shareUrl} title={edition?.title ?? ''} description={edition?.description ?? undefined} compact />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MagazineArchiveClient({ editions, banner, hero, countryName, countrySlug }: Props) {
  const { t } = useLanguage();
  const items = editions ?? [];
  const [siteUrl, setSiteUrl] = useState('https://www.dinkauthoritymagazine.com');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  /* Resolve hero values — CMS overrides, fallbacks for empty fields */
  const heroHeadline = hero?.headline || (countryName ? `Dink Authority ${countryName}` : 'Dink Authority Magazine');
  const heroDescription = hero?.description || 'Browse all editions of Dink Authority Magazine. Click any cover to read online.';
  const heroBackgroundWord = hero?.backgroundWord || '';
  const heroButtonText = hero?.buttonText || '';
  const heroButtonLink = hero?.buttonLink || '';
  const heroBackgroundImage = hero?.backgroundImage || '';

  return (
    <div className="min-h-screen bg-brand-gray">
      <Header />

      {/* Subscription Banner — editable from admin */}
      {banner && banner.image && (
        <section className="relative">
          <a
            href={banner.buttonLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full overflow-hidden group"
          >
            <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] bg-brand-purple">
              <Image
                src={banner.image}
                alt={banner.title || 'Subscribe to Dink Authority Magazine'}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                priority
              />
              {/* Dark overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/80 via-brand-purple-dark/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center max-w-[1400px] mx-auto px-6 md:px-10">
                {banner.title && (
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-2 drop-shadow-lg max-w-xl">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-white/80 text-sm md:text-base mb-4 max-w-lg drop-shadow">
                    {banner.subtitle}
                  </p>
                )}
                {banner.buttonText && (
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider self-start shadow-lg">
                    {banner.buttonText} <ArrowRight size={16} />
                  </span>
                )}
              </div>
            </div>
          </a>
        </section>
      )}

      {/* Magazine Hero — editable from admin */}
      <div
        className={`relative overflow-hidden ${heroBackgroundImage ? 'bg-brand-purple-dark' : 'bg-brand-purple'}`}
        style={heroBackgroundImage ? { backgroundImage: `url(${heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {/* Dark overlay when background image is set */}
        {heroBackgroundImage && (
          <div className="absolute inset-0 bg-brand-purple-dark/70" />
        )}
        {/* Large background word */}
        {heroBackgroundWord && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <span className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem] font-heading font-black text-white/[0.04] uppercase whitespace-nowrap leading-none tracking-tight">
              {heroBackgroundWord}
            </span>
          </div>
        )}
        <div className="relative max-w-[1400px] mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-brand-neon/10 flex items-center justify-center">
              <BookOpen size={20} className="text-brand-neon" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
              {heroHeadline}
            </h1>
          </div>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mb-4">
            {heroDescription}
          </p>
          {heroButtonText && heroButtonLink && (
            <a
              href={heroButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider shadow-lg"
            >
              {heroButtonText} <ArrowRight size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Editions grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-10 md:py-14">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-brand-gray-dark/40 mb-4" />
            <p className="text-brand-gray-dark text-lg">No editions available yet.</p>
          </div>
        ) : (
          <>
            {/* First row of editions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {items.slice(0, 4).map((edition, i) => (
                <EditionCard key={edition?.id ?? i} edition={edition} index={i} siteUrl={siteUrl} />
              ))}
            </div>

            {/* Sponsor Banner Carousel after first row */}
            <SponsorBannerCarousel className="py-8" section="magazine" />

            {/* Remaining editions */}
            {items.length > 4 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {items.slice(4).map((edition, i) => (
                  <EditionCard key={edition?.id ?? (i + 4)} edition={edition} index={i + 4} siteUrl={siteUrl} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
