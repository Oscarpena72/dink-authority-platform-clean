"use client";
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslatedArticles } from '@/hooks/use-translated-articles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ArrowLeft, ArrowRight, Share2, Facebook, Linkedin, Mail, Copy, Check,
  X as XIcon, ChevronLeft, ChevronRight, ExternalLink, Instagram, Globe, Eye, Loader2, MapPin, User
} from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import StickyBanner from '@/app/_components/sticky-banner';
import UniversalVideoModule from '@/components/universal-video-module';

function ShareButtons({ url, title }: { url: string; title: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const copyLink = useCallback(async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }, [url]);
  const socials = [
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:bg-[#1877F2] hover:text-white' },
    { name: 'X', icon: XIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:bg-black hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:bg-[#0A66C2] hover:text-white' },
    { name: 'WhatsApp', icon: () => <span className="text-lg">💬</span>, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:bg-[#25D366] hover:text-white' },
    { name: 'Email', icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, color: 'hover:bg-gray-700 hover:text-white' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white', onClick: copyLink },
  ];
  return (
    <div className="relative">
      <button onClick={() => setShowShare(!showShare)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-semibold hover:bg-brand-purple hover:text-white transition-all">
        <Share2 size={16} /> {t('tips.shareTitle')}
      </button>
      <AnimatePresence>
        {showShare && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-30 min-w-[240px]">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('tips.shareTitle')}</p>
            <div className="grid grid-cols-3 gap-2">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target={s.href !== '#' ? '_blank' : undefined} rel="noopener noreferrer"
                  onClick={(e) => { if (s.onClick) { e.preventDefault(); s.onClick(); } }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 transition-all ${s.color}`}>
                  {typeof s.icon === 'function' && s.name !== 'WhatsApp' ? <s.icon size={18} /> : s.name === 'WhatsApp' ? <span className="text-lg">💬</span> : <s.icon size={18} />}
                  <span className="text-[10px] font-medium">{s.name}</span>
                </a>
              ))}
            </div>
            <button onClick={copyLink} className="flex items-center gap-2 w-full mt-3 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? t('tips.copied') : t('tips.copyLink')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!images?.length) return null;
  const safeImages = images.slice(0, 5);
  return (
    <div className="my-10">
      <h3 className="text-lg font-heading font-bold text-brand-purple mb-4 flex items-center gap-2">📸 {t('juniors.gallery')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {safeImages.map((img, i) => (
          <button key={i} onClick={() => { setCurrent(i); setLightbox(true); }} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group">
            <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 20vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
            <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10"><XIcon size={28} /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p > 0 ? p - 1 : safeImages.length - 1)); }} className="absolute left-4 text-white/70 hover:text-white z-10"><ChevronLeft size={36} /></button>
            <div className="relative w-full max-w-4xl aspect-[4/3] mx-4" onClick={(e) => e.stopPropagation()}>
              <Image src={safeImages[current]} alt={`Gallery ${current + 1}`} fill className="object-contain" sizes="100vw" />
            </div>
            <button onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p < safeImages.length - 1 ? p + 1 : 0)); }} className="absolute right-4 text-white/70 hover:text-white z-10"><ChevronRight size={36} /></button>
            <div className="absolute bottom-4 text-white/60 text-sm">{current + 1} / {safeImages.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BannerAd({ image, link, label }: { image?: string | null; link?: string | null; label?: string }) {
  if (!image) return null;
  const Wrapper = link ? 'a' : 'div';
  const props = link ? { href: link, target: '_blank', rel: 'noopener noreferrer sponsored' } : {};
  return (
    <Wrapper {...(props as any)} className="block my-8 rounded-xl overflow-hidden bg-gray-100 relative aspect-[4/1] md:aspect-[6/1] group">
      <Image src={image} alt={label || 'Sponsored'} fill className="object-cover" sizes="100vw" />
      {label && <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] uppercase tracking-wider rounded">{label}</span>}
    </Wrapper>
  );
}

function LatestEditionBanner({ edition, t }: { edition: any; t?: (key: any) => string }) {
  if (!edition?.coverUrl) return null;
  return (
    <div className="my-8">
      <Link href={edition.link || '/articles?category=magazine'} className="block rounded-xl overflow-hidden border border-brand-purple/10 bg-gradient-to-r from-brand-purple/5 to-transparent hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4 p-4 md:p-5">
          <div className="relative w-20 h-28 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-md">
            <Image src={edition.coverUrl} alt={edition.title || 'Latest Edition'} fill className="object-cover" sizes="96px" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-neon">{t?.('tips.latestEdition') || 'Latest Edition'}</span>
            <h4 className="text-base md:text-lg font-heading font-bold text-brand-purple mt-1 line-clamp-2">{edition.title}</h4>
            <span className="inline-flex items-center gap-1 text-sm text-brand-purple font-semibold mt-2 hover:gap-2 transition-all">
              {t?.('tips.readNow') || 'Read Now'} <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function TranslationBanner({ isTranslating, isTranslated, translationError, showOriginal, onToggle, onRetry, t }: {
  isTranslating: boolean; isTranslated: boolean; translationError: boolean; showOriginal: boolean; onToggle: () => void; onRetry?: () => void; t: (key: any) => string;
}) {
  if (!isTranslating && !isTranslated && !translationError) return null;
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-6 text-sm ${
      isTranslating ? 'bg-blue-50 text-blue-700 border border-blue-200' :
      translationError ? 'bg-amber-50 text-amber-700 border border-amber-200' :
      'bg-brand-neon/10 text-brand-purple border border-brand-neon/30'
    }`}>
      {isTranslating && (<><Loader2 size={16} className="animate-spin flex-shrink-0" /><span className="font-medium">{t('juniors.translating')}</span></>)}
      {translationError && (<><span className="font-medium">{t('juniors.translationFailed')}</span>{onRetry && <button onClick={onRetry} className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-amber-300 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-colors">↻ Retry</button>}</>)}
      {isTranslated && !isTranslating && (<><Globe size={16} className="flex-shrink-0" /><span className="font-medium">{t('juniors.translated')}</span><button onClick={onToggle} className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-brand-gray text-brand-purple text-xs font-semibold hover:bg-brand-gray transition-colors"><Eye size={13} />{showOriginal ? t('juniors.translated') : t('juniors.viewOriginal')}</button></>)}
    </div>
  );
}

/* Old InstagramVideoModule removed — replaced by UniversalVideoModule */

export default function JuniorDetailClient({ junior, related, latestEdition, bannerData }: { junior: any; related: any[]; latestEdition?: any; bannerData?: any }) {
  const { locale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);
  const currentUrl = mounted ? window.location.href : '';

  let gallery: string[] = [];
  try { gallery = JSON.parse(junior?.galleryImages ?? '[]'); } catch { gallery = []; }

  // ── Translation state — 2-phase: meta then content ──
  const [translatedMeta, setTranslatedMeta] = useState<{ title: string; excerpt: string } | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslatingMeta, setIsTranslatingMeta] = useState(false);
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const fetchTranslation = useCallback(async () => {
    if (locale === 'en' || !junior?.id) {
      setTranslatedMeta(null); setTranslatedContent(null); setTranslationError(false); return;
    }
    setTranslationError(false); setShowOriginal(false);
    setIsTranslatingMeta(true);
    try {
      const metaRes = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: junior.id, title: junior.title || `${junior.name} — ${junior.title}`, excerpt: junior.excerpt || '', content: junior.content, locale, phase: 'meta' }),
      });
      if (!metaRes.ok) throw new Error('Meta translation failed');
      const metaData = await metaRes.json();
      if (metaData.content) { setTranslatedMeta({ title: metaData.title, excerpt: metaData.excerpt }); setTranslatedContent(metaData.content); setIsTranslatingMeta(false); return; }
      setTranslatedMeta({ title: metaData.title, excerpt: metaData.excerpt }); setIsTranslatingMeta(false);
    } catch { setIsTranslatingMeta(false); setTranslationError(true); return; }
    setIsTranslatingContent(true);
    try {
      const contentRes = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: junior.id, title: junior.title, excerpt: junior.excerpt || '', content: junior.content, locale, phase: 'content' }),
      });
      if (!contentRes.ok) throw new Error('Content translation failed');
      const contentData = await contentRes.json();
      setTranslatedContent(contentData.content);
    } catch { console.error('Content translation failed'); } finally { setIsTranslatingContent(false); }
  }, [locale, junior?.id, junior?.title, junior?.excerpt, junior?.content, junior?.name]);

  React.useEffect(() => { fetchTranslation(); }, [fetchTranslation]);

  const isTranslating = isTranslatingMeta || isTranslatingContent;
  const hasMetaTranslation = !!translatedMeta && locale !== 'en';
  const hasContentTranslation = !!translatedContent && locale !== 'en';
  const isTranslated = hasMetaTranslation;
  const displayTitle = (hasMetaTranslation && !showOriginal) ? translatedMeta!.title : (junior?.title ?? '');
  const displayExcerpt = (hasMetaTranslation && !showOriginal) ? (translatedMeta!.excerpt || junior?.excerpt) : (junior?.excerpt ?? '');
  const displayContent = (hasContentTranslation && !showOriginal) ? translatedContent! : (junior?.content ?? '');

  const translatedRelated = useTranslatedArticles(related ?? []);
  const contentParts = splitContent(displayContent, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative">
          {junior?.featuredImage && (
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/7] max-h-[65vh] overflow-hidden">
              <Image src={junior.featuredImage} alt={junior?.name ?? ''} fill className="object-cover" priority sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
          )}
          <div className={`${junior?.featuredImage ? 'absolute bottom-0 left-0 right-0' : 'bg-brand-purple'} px-4 py-6 md:py-12`}>
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 bg-brand-neon text-brand-purple text-xs font-bold uppercase rounded-full mb-3">
                {t('juniors.title')}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black text-white mb-2 leading-tight">
                {junior?.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-2">{displayTitle}</p>
              <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
                {junior?.country && <span className="flex items-center gap-1"><MapPin size={14} /> {junior.country}</span>}
                {junior?.age && <span className="flex items-center gap-1"><User size={14} /> {junior.age} {t('juniors.age')}</span>}
              </div>
            </div>
          </div>
        </section>

        {/* Author + Meta bar */}
        <div className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">DA</span>
              </div>
              <div>
                <p className="font-heading font-bold text-brand-purple">Dink Authority Magazine</p>
                <p className="text-sm text-gray-500">{t('juniors.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {junior?.publishDate && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar size={14} />
                  {new Date(junior.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              <ShareButtons url={currentUrl} title={`${junior?.name} — ${displayTitle}`} />
            </div>
          </div>
        </div>

        {/* Translation Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <TranslationBanner isTranslating={isTranslating} isTranslated={isTranslated} translationError={translationError}
            showOriginal={showOriginal} onToggle={() => setShowOriginal(!showOriginal)} onRetry={fetchTranslation} t={t} />
        </div>

        {/* Excerpt */}
        {displayExcerpt && (
          <div className="max-w-4xl mx-auto px-4 pt-4">
            <p className="text-lg text-gray-600 italic border-l-4 border-brand-neon pl-4">{displayExcerpt}</p>
          </div>
        )}

        {/* Content with interleaved banners */}
        <article className="max-w-4xl mx-auto px-4 py-10">
          {contentParts[0] && <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-a:text-brand-purple" dangerouslySetInnerHTML={{ __html: contentParts[0] }} />}
          <LatestEditionBanner edition={latestEdition} t={t} />
          {contentParts[1] && <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-a:text-brand-purple" dangerouslySetInnerHTML={{ __html: contentParts[1] }} />}
          <BannerAd image={junior?.banner2Image} link={junior?.banner2Link} label={t('common.ad')} />
          {contentParts[2] && <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-a:text-brand-purple" dangerouslySetInnerHTML={{ __html: contentParts[2] }} />}
          <BannerAd image={junior?.banner3Image} link={junior?.banner3Link} label={t('common.ad')} />

          {/* Instagram Video Module */}
          <UniversalVideoModule videoUrl={junior?.videoUrl ?? junior?.instagramVideoUrl ?? ''} posterImage={junior?.featuredImage} title={displayTitle} />

          {/* Gallery */}
          <ImageGallery images={gallery} />
        </article>

        {/* Related Juniors */}
        {(translatedRelated ?? []).length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-heading font-bold text-brand-purple mb-8">{t('juniors.relatedJuniors')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(translatedRelated ?? []).map((r: any) => (
                  <Link key={r?.id} href={`/juniors/${r?.slug ?? ''}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-[3/4] bg-gray-100">
                      {r?.featuredImage && <Image src={r.featuredImage} alt={r?.name ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-heading font-bold text-white text-lg line-clamp-1">{r?.name ?? ''}</h3>
                        <p className="text-white/80 text-sm line-clamp-1">{r?.title ?? ''}</p>
                        {r?.country && <p className="text-white/60 text-xs mt-1 flex items-center gap-1"><MapPin size={12} /> {r.country}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/juniors" className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple-light font-semibold transition-colors">
            <ArrowLeft size={18} /> {t('juniors.backToJuniors')}
          </Link>
        </div>
      </main>

      {bannerData && <div className="h-[100px] md:h-[90px]" />}
      {bannerData && <StickyBanner desktopImage={bannerData.desktopImage} mobileImage={bannerData.mobileImage} link={bannerData.link} newTab={bannerData.newTab} closeEnabled={bannerData.closeEnabled} />}
      <Footer />
    </div>
  );
}

function splitContent(html: string, parts: number): string[] {
  if (!html) return Array(parts).fill('');
  const chunks = html.split(/<\/p>/gi);
  if (chunks.length <= parts) {
    const result = chunks.map((c, i) => i < chunks.length - 1 ? c + '</p>' : c).filter(Boolean);
    while (result.length < parts) result.push('');
    return result;
  }
  const perPart = Math.ceil(chunks.length / parts);
  const result: string[] = [];
  for (let i = 0; i < parts; i++) {
    const slice = chunks.slice(i * perPart, (i + 1) * perPart);
    result.push(slice.map((c, j) => (j < slice.length - 1 || i < parts - 1) ? c + '</p>' : c).join(''));
  }
  return result;
}
