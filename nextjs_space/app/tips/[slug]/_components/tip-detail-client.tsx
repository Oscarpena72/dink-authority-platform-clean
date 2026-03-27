"use client";
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, User, ArrowLeft, ArrowRight, Share2, Facebook, Linkedin, Mail, Link2, Copy, Check,
  X as XIcon, ChevronLeft, ChevronRight, Play, ExternalLink, Instagram
} from 'lucide-react';

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
  return m?.[1] ?? null;
}

function ShareButtons({ url, title }: { url: string; title: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [url]);

  const socials = [
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:bg-[#1877F2] hover:text-white' },
    { name: 'X', icon: XIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:bg-black hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:bg-[#0A66C2] hover:text-white' },
    { name: 'WhatsApp', icon: () => <span className="text-base font-bold">W</span>, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:bg-[#25D366] hover:text-white' },
    { name: 'Email', icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, color: 'hover:bg-gray-700 hover:text-white' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white', onClick: copyLink },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2 px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-semibold hover:bg-brand-purple hover:text-white transition-all"
      >
        <Share2 size={16} />
        {t('tips.shareTitle')}
      </button>
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-30 min-w-[240px]"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('tips.shareTitle')}</p>
            <div className="grid grid-cols-3 gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (s.onClick) {
                      e.preventDefault();
                      s.onClick();
                    }
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 transition-all ${s.color}`}
                >
                  {typeof s.icon === 'function' && s.name !== 'WhatsApp' ? <s.icon size={18} /> : s.name === 'WhatsApp' ? <span className="text-lg">💬</span> : <s.icon size={18} />}
                  <span className="text-[10px] font-medium">{s.name}</span>
                </a>
              ))}
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 w-full mt-3 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
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
      <h3 className="text-lg font-heading font-bold text-brand-purple mb-4 flex items-center gap-2">
        📸 {t('tips.gallery')}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {safeImages.map((img, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setLightbox(true); }}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group"
          >
            <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 20vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
              <XIcon size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p > 0 ? p - 1 : safeImages.length - 1)); }}
              className="absolute left-4 text-white/70 hover:text-white z-10"
            >
              <ChevronLeft size={36} />
            </button>
            <div className="relative w-full max-w-4xl aspect-[4/3] mx-4" onClick={(e) => e.stopPropagation()}>
              <Image src={safeImages[current]} alt={`Gallery ${current + 1}`} fill className="object-contain" sizes="100vw" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p < safeImages.length - 1 ? p + 1 : 0)); }}
              className="absolute right-4 text-white/70 hover:text-white z-10"
            >
              <ChevronRight size={36} />
            </button>
            <div className="absolute bottom-4 text-white/60 text-sm">{current + 1} / {safeImages.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BannerAd({ image, link }: { image?: string | null; link?: string | null }) {
  if (!image) return null;
  const Wrapper = link ? 'a' : 'div';
  const props = link ? { href: link, target: '_blank', rel: 'noopener noreferrer sponsored' } : {};
  return (
    <Wrapper {...(props as any)} className="block my-8 rounded-xl overflow-hidden bg-gray-100 relative aspect-[4/1] md:aspect-[6/1]">
      <Image src={image} alt="Sponsored" fill className="object-cover" sizes="100vw" />
    </Wrapper>
  );
}

export default function TipDetailClient({ tip, related }: { tip: any; related: any[] }) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);

  const currentUrl = mounted ? window.location.href : '';
  const videoId = getYouTubeId(tip?.youtubeUrl ?? '');
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(tip?.galleryImages ?? '[]');
  } catch {
    gallery = [];
  }

  // Split content into 3 parts for banner interleaving
  const fullContent = tip?.content ?? '';
  const contentParts = splitContent(fullContent, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative">
        {tip?.featuredImage && (
          <div className="relative w-full h-[50vh] md:h-[60vh]">
            <Image src={tip.featuredImage} alt={tip?.title ?? ''} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        )}
        <div className={`${tip?.featuredImage ? 'absolute bottom-0 left-0 right-0' : 'bg-brand-purple'} px-4 py-8 md:py-12`}>
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-brand-neon text-brand-purple text-xs font-bold uppercase rounded-full mb-3">
              {tip?.category ?? 'tip'}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 leading-tight">
              {tip?.title ?? ''}
            </h1>
            {tip?.excerpt && (
              <p className="text-white/80 text-lg md:text-xl max-w-3xl">{tip.excerpt}</p>
            )}
          </div>
        </div>
      </section>

      {/* Author + Meta bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {tip?.author && (
            <div className="flex items-center gap-4">
              {tip.author.photoUrl && (
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 ring-2 ring-brand-purple/20">
                  <Image src={tip.author.photoUrl} alt={tip.author.name ?? ''} fill className="object-cover" sizes="56px" />
                </div>
              )}
              <div>
                <p className="font-heading font-bold text-brand-purple">{tip.author.name}</p>
                {tip.author.bio && <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{tip.author.bio}</p>}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            {tip?.publishDate && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={14} />
                {new Date(tip.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            <ShareButtons url={currentUrl} title={tip?.title ?? ''} />
          </div>
        </div>
      </div>

      {/* Content with interleaved banners */}
      <article className="max-w-4xl mx-auto px-4 py-10">
        {contentParts[0] && (
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-a:text-brand-purple" dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
        )}

        <BannerAd image={tip?.banner1Image} link={tip?.banner1Link} />

        {contentParts[1] && (
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-a:text-brand-purple" dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
        )}

        <BannerAd image={tip?.banner2Image} link={tip?.banner2Link} />

        {contentParts[2] && (
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-a:text-brand-purple" dangerouslySetInnerHTML={{ __html: contentParts[2] }} />
        )}

        <BannerAd image={tip?.banner3Image} link={tip?.banner3Link} />

        {/* YouTube Embed */}
        {videoId && (
          <div className="my-10">
            <h3 className="text-lg font-heading font-bold text-brand-purple mb-4 flex items-center gap-2">
              <Play size={20} className="text-brand-neon" />
              {t('tips.watchMore')}
            </h3>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {tip?.videoCtaText && (
              <div className="mt-4 text-center">
                {tip.videoCtaLink ? (
                  <a href={tip.videoCtaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple font-bold rounded-full hover:brightness-110 transition">
                    {tip.videoCtaText} <ExternalLink size={16} />
                  </a>
                ) : (
                  <p className="text-gray-600 font-medium">{tip.videoCtaText}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        <ImageGallery images={gallery} />
      </article>

      {/* Related Tips */}
      {(related ?? []).length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-brand-purple mb-8">
              {t('tips.relatedTips')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(related ?? []).map((r: any) => (
                <Link key={r?.id} href={`/tips/${r?.slug ?? ''}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-gray-100">
                    {r?.featuredImage && <Image src={r.featuredImage} alt={r?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-brand-purple line-clamp-2 group-hover:text-brand-purple-light transition-colors">{r?.title ?? ''}</h3>
                    <p className="text-sm text-gray-500 mt-1">{r?.author?.name ?? ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/tips" className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple-light font-semibold transition-colors">
          <ArrowLeft size={18} />
          Back to Tips
        </Link>
      </div>
    </main>
  );
}

/** Split HTML content into N roughly-equal parts at paragraph boundaries */
function splitContent(html: string, parts: number): string[] {
  if (!html) return Array(parts).fill('');
  // Split at </p> tags
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
