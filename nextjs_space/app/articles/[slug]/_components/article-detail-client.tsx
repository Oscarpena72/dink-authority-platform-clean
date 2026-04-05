"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Check, Copy, Share2, Globe, Loader2, Eye } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';
import StickyBanner from '@/app/_components/sticky-banner';
import UniversalVideoModule from '@/components/universal-video-module';
import SubscribeForm from '@/app/_components/subscribe-form';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatEditorialContent } from '@/lib/format-editorial-content';

/* ── Share Buttons ── */
function ShareButtons({ title, compact = false, articleUrl = '' }: { title: string; compact?: boolean; articleUrl?: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(articleUrl);
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
      setCanNativeShare(!!navigator.share);
    }
  }, []);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const copyLink = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* */ } };
  const nativeShare = async () => {
    try { await navigator.share({ title, url }); } catch { /* user cancelled or not supported */ }
  };

  /* Detect mobile devices via userAgent + viewport width */
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const mobileUA = /android|iphone|ipad|ipod|mobile|webos|blackberry|opera mini|iemobile/i.test(ua);
    return mobileUA || window.innerWidth < 768;
  }, []);

  /* Open share URL in a centered popup window — the standard approach for
     Facebook and LinkedIn share dialogs on desktop. Falls back to window.open
     with no features (new tab) if the popup is blocked. */
  const openSharePopup = useCallback((shareUrl: string, w = 600, h = 500) => {
    const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
    const popup = window.open(
      shareUrl,
      'share_dialog',
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    if (!popup || popup.closed) {
      // Popup blocked — fall back to new tab
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodedUrl}`;

  /* Facebook share: direct redirect on mobile, popup on desktop */
  const shareFacebook = useCallback(() => {
    if (isMobile()) {
      window.location.href = facebookUrl;
    } else {
      openSharePopup(facebookUrl);
    }
  }, [isMobile, openSharePopup, facebookUrl]);

  const fbIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  const liIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  const xIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  const waIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {/* Facebook: mobile redirect / desktop popup */}
        <button onClick={shareFacebook} title="Share on Facebook"
          className="p-2 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30">{fbIcon}</button>
        <button onClick={() => openSharePopup(linkedinUrl)} title="Share on LinkedIn"
          className="p-2 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30">{liIcon}</button>
        {/* X: popup dialog via window.open */}
        <button onClick={() => openSharePopup(xUrl, 550, 420)} title="Share on X"
          className="p-2 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-black/10 hover:text-black hover:border-black/30">{xIcon}</button>
        {/* WhatsApp: regular link for mobile app handoff */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp"
          className="p-2 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30">{waIcon}</a>
        <button onClick={copyLink} title="Copy link"
          className={`p-2 rounded-lg border transition-all duration-200 ${copied ? 'bg-green-50 text-green-700 border-green-300' : 'border-transparent text-brand-gray-dark hover:bg-brand-purple/10 hover:text-brand-purple hover:border-brand-purple/30'}`}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        {canNativeShare && (
          <button onClick={nativeShare} title="Share" className="p-2 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-brand-purple/10 hover:text-brand-purple hover:border-brand-purple/30">
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-b border-brand-gray py-6 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-purple"><Share2 size={16} /><span>Share this article</span></div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Facebook: mobile redirect / desktop popup */}
          <button onClick={shareFacebook}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-gray text-sm font-medium text-brand-gray-dark transition-all duration-200 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30">
            {fbIcon}<span className="hidden sm:inline">Facebook</span>
          </button>
          <button onClick={() => openSharePopup(linkedinUrl)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-gray text-sm font-medium text-brand-gray-dark transition-all duration-200 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30">
            {liIcon}<span className="hidden sm:inline">LinkedIn</span>
          </button>
          {/* X: popup dialog via window.open */}
          <button onClick={() => openSharePopup(xUrl, 550, 420)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-gray text-sm font-medium text-brand-gray-dark transition-all duration-200 hover:bg-black/10 hover:text-black hover:border-black/30">
            {xIcon}<span className="hidden sm:inline">X</span>
          </button>
          {/* WhatsApp: regular link for mobile app handoff */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-gray text-sm font-medium text-brand-gray-dark transition-all duration-200 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30">
            {waIcon}<span className="hidden sm:inline">WhatsApp</span>
          </a>
          <button onClick={copyLink}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${copied ? 'bg-green-50 text-green-700 border-green-300' : 'border-brand-gray text-brand-gray-dark hover:bg-brand-purple/10 hover:text-brand-purple hover:border-brand-purple/30'}`}>
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /><span className="hidden sm:inline">Copy Link</span></>}
          </button>
          {canNativeShare && (
            <button onClick={nativeShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-gray text-sm font-medium text-brand-gray-dark transition-all duration-200 hover:bg-brand-neon/10 hover:text-brand-purple hover:border-brand-neon/30">
              <Share2 className="w-4 h-4" /><span className="hidden sm:inline">More</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Desktop Sidebar Slot ── */
function SidebarSlot({ image, link, label, newTab }: { image?: string; link?: string; label?: string; newTab?: boolean }) {
  if (!image) return null;
  const content = (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white">
      {label && <div className="px-3 py-1.5 bg-brand-gray text-[10px] font-semibold uppercase tracking-widest text-brand-gray-dark text-center">{label}</div>}
      <div className="relative aspect-[3/4] bg-gray-50">
        <Image src={image} alt={label || 'Sponsor'} fill className="object-contain" sizes="300px" />
      </div>
    </div>
  );
  if (link) return <a href={link} target={newTab ? '_blank' : '_self'} rel={newTab ? 'noopener noreferrer' : undefined} className="block">{content}</a>;
  return content;
}

/* ── Desktop Sidebar (hidden on mobile) ── */
function ArticleSidebar({ sidebarData }: { sidebarData: any }) {
  const { currentEdition, slot2, slot3 } = sidebarData ?? {};
  const hasContent = currentEdition?.coverUrl || slot2 || slot3;
  if (!hasContent) return null;

  return (
    <aside className="space-y-6">
      {currentEdition?.coverUrl && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gray-dark mb-2 text-center">Current Issue</p>
          <Link href={currentEdition.link || '#'} className="block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group bg-white">
            <div className="relative aspect-[3/4] bg-gray-50">
              <Image src={currentEdition.coverUrl} alt={currentEdition.title || 'Current Issue'} fill className="object-contain group-hover:scale-[1.02] transition-transform duration-300" sizes="300px" />
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-bold text-brand-purple line-clamp-2">{currentEdition.title}</p>
              <p className="text-[10px] text-brand-purple font-semibold mt-1 group-hover:underline">Read Now →</p>
            </div>
          </Link>
        </div>
      )}
      {slot2 && <SidebarSlot image={slot2.image} link={slot2.link} label={slot2.label} newTab={slot2.newTab} />}
      {slot3 && <SidebarSlot image={slot3.image} link={slot3.link} label={slot3.label} newTab={slot3.newTab} />}
    </aside>
  );
}

/* ── Mobile Inline Slot (SI-style centered ad within content) ── */
function MobileInlineSlot({ type, data }: { type: 'magazine' | 'sponsor'; data: any }) {
  if (!data) return null;

  if (type === 'magazine') {
    return (
      <div className="my-8 lg:hidden flex flex-col items-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gray-dark/50 mb-2">Current Issue</p>
        <Link href={data.link || '#'} className="block w-[60%] max-w-[220px] group">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-gray-50">
            <Image src={data.coverUrl} alt={data.title || 'Current Issue'} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-300" sizes="220px" />
          </div>
          <p className="text-[11px] font-bold text-brand-purple text-center mt-2 line-clamp-2 leading-tight">{data.title}</p>
          <p className="text-[10px] text-brand-purple/70 font-semibold text-center mt-0.5 group-hover:underline">Read Now →</p>
        </Link>
      </div>
    );
  }

  // Sponsor slot — same size as magazine cover slot
  const linkTarget = data.newTab ? '_blank' : '_self';
  const linkRel = data.newTab ? 'noopener noreferrer' : undefined;
  const inner = (
    <div className="flex flex-col items-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gray-dark/50 mb-2">{data.label || 'Sponsored'}</p>
      <div className="w-[60%] max-w-[220px]">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gray-50">
          <Image src={data.image} alt={data.label || 'Sponsor'} fill className="object-cover" sizes="220px" />
        </div>
      </div>
    </div>
  );
  return (
    <div className="my-8 lg:hidden">
      {data.link ? <a href={data.link} target={linkTarget} rel={linkRel} className="block">{inner}</a> : inner}
    </div>
  );
}

/* ── Split HTML content into blocks for mobile slot insertion ── */
function splitContentBlocks(html: string): string[] {
  if (!html) return [''];
  // Split on block-level HTML tags (p, div, h1-h6, ul, ol, blockquote, figure, table, hr, section)
  const blockRegex = /(<\/(?:p|div|h[1-6]|ul|ol|blockquote|figure|table|section)>|<hr\s*\/?>)/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match;
  const regex = new RegExp(blockRegex);
  while ((match = regex.exec(html)) !== null) {
    const end = match.index + match[0].length;
    parts.push(html.slice(lastIndex, end));
    lastIndex = end;
  }
  if (lastIndex < html.length) parts.push(html.slice(lastIndex));
  // Filter empty strings
  return parts.filter(p => p.trim().length > 0);
}

/* ── Translation Banner ── */
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
      {isTranslating && (
        <>
          <Loader2 size={16} className="animate-spin flex-shrink-0" />
          <span className="font-medium">{t('article.translating')}</span>
        </>
      )}
      {translationError && (
        <>
          <span className="font-medium">{t('article.translationFailed')}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-amber-300 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-colors"
            >
              ↻ {t('article.retryTranslation') || 'Retry'}
            </button>
          )}
        </>
      )}
      {isTranslated && !isTranslating && (
        <>
          <Globe size={16} className="flex-shrink-0" />
          <span className="font-medium">{t('article.translated')}</span>
          <button
            onClick={onToggle}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-brand-gray text-brand-purple text-xs font-semibold hover:bg-brand-gray transition-colors"
          >
            <Eye size={13} />
            {showOriginal ? t('article.translated') : t('article.viewOriginal')}
          </button>
        </>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function ArticleDetailClient({ article, relatedArticles, sidebarData, bannerData, articleUrl = '' }: { article: any; relatedArticles: any[]; sidebarData?: any; bannerData?: any; articleUrl?: string }) {
  const hasSidebar = sidebarData?.currentEdition?.coverUrl || sidebarData?.slot2 || sidebarData?.slot3;
  const { locale, t } = useLanguage();

  // Translation state — 2-phase: meta (title+excerpt) then content
  const [translatedMeta, setTranslatedMeta] = useState<{ title: string; excerpt: string } | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslatingMeta, setIsTranslatingMeta] = useState(false);
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Phase 1: Fetch title+excerpt translation (fast ~3s)
  // Phase 2: Fetch content translation (slower ~15-40s)
  const fetchTranslation = useCallback(async () => {
    if (locale === 'en' || !article?.id) {
      setTranslatedMeta(null);
      setTranslatedContent(null);
      setTranslationError(false);
      return;
    }

    setTranslationError(false);
    setShowOriginal(false);

    // Phase 1: meta (title + excerpt)
    setIsTranslatingMeta(true);
    try {
      const metaRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          excerpt: article.excerpt || '',
          content: article.content,
          locale,
          phase: 'meta',
        }),
      });

      if (!metaRes.ok) throw new Error('Meta translation failed');

      const metaData = await metaRes.json();

      // If the cache returned content too (full cache hit), use it all
      if (metaData.content) {
        setTranslatedMeta({ title: metaData.title, excerpt: metaData.excerpt });
        setTranslatedContent(metaData.content);
        setIsTranslatingMeta(false);
        return;
      }

      setTranslatedMeta({ title: metaData.title, excerpt: metaData.excerpt });
      setIsTranslatingMeta(false);
    } catch {
      setIsTranslatingMeta(false);
      setTranslationError(true);
      return;
    }

    // Phase 2: content (HTML body)
    setIsTranslatingContent(true);
    try {
      const contentRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          excerpt: article.excerpt || '',
          content: article.content,
          locale,
          phase: 'content',
        }),
      });

      if (!contentRes.ok) throw new Error('Content translation failed');

      const contentData = await contentRes.json();
      setTranslatedContent(contentData.content);
    } catch {
      // Meta translation succeeded, content failed — show what we have
      console.error('Content translation failed, showing translated title/excerpt with original content');
    } finally {
      setIsTranslatingContent(false);
    }
  }, [locale, article?.id, article?.title, article?.excerpt, article?.content]);

  useEffect(() => {
    fetchTranslation();
  }, [fetchTranslation]);

  // Track page view
  useEffect(() => {
    if (!article?.id) return;
    fetch(`/api/articles/${article.id}/view`, { method: 'POST' }).catch(() => {});
  }, [article?.id]);

  // Determine displayed content
  const isTranslating = isTranslatingMeta || isTranslatingContent;
  const hasMetaTranslation = !!translatedMeta && locale !== 'en';
  const hasContentTranslation = !!translatedContent && locale !== 'en';
  const isTranslated = hasMetaTranslation; // Consider translated once meta is ready
  const displayTitle = (hasMetaTranslation && !showOriginal) ? translatedMeta!.title : (article?.title ?? '');
  const rawContent = (hasContentTranslation && !showOriginal) ? translatedContent! : (article?.content ?? '');
  const displayContent = useMemo(() => formatEditorialContent(rawContent), [rawContent]);

  // Build mobile slot list
  const mobileSlots = useMemo(() => {
    const slots: { type: 'magazine' | 'sponsor'; data: any }[] = [];
    if (sidebarData?.currentEdition?.coverUrl) slots.push({ type: 'magazine', data: sidebarData.currentEdition });
    if (sidebarData?.slot2) slots.push({ type: 'sponsor', data: sidebarData.slot2 });
    if (sidebarData?.slot3) slots.push({ type: 'sponsor', data: sidebarData.slot3 });
    return slots;
  }, [sidebarData]);

  // Split content for mobile interleaving
  const contentBlocks = useMemo(() => splitContentBlocks(displayContent), [displayContent]);

  // Calculate insertion points: distribute slots evenly within content
  // Insert after block indexes: aim for ~30% / ~55% / ~80% through content
  const insertionMap = useMemo(() => {
    const map: Record<number, { type: 'magazine' | 'sponsor'; data: any }> = {};
    if (mobileSlots.length === 0 || contentBlocks.length < 2) return map;
    const positions = mobileSlots.length === 1
      ? [Math.max(1, Math.floor(contentBlocks.length * 0.35))]
      : mobileSlots.length === 2
        ? [Math.max(1, Math.floor(contentBlocks.length * 0.3)), Math.max(2, Math.floor(contentBlocks.length * 0.65))]
        : [Math.max(1, Math.floor(contentBlocks.length * 0.25)), Math.max(2, Math.floor(contentBlocks.length * 0.5)), Math.max(3, Math.floor(contentBlocks.length * 0.75))];
    mobileSlots.forEach((slot, i) => {
      if (positions[i] !== undefined) map[positions[i]] = slot;
    });
    return map;
  }, [mobileSlots, contentBlocks]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero image — full width */}
        {article?.imageUrl && (
          <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[420px] lg:h-[460px] bg-brand-purple overflow-hidden">
            <Image src={article.imageUrl} alt={article?.title ?? ''} fill className="object-cover" style={{ objectPosition: `${article?.focalPointX ?? 50}% ${article?.focalPointY ?? 50}%` }} sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/80 to-transparent" />
          </div>
        )}

        {/* Article + Sidebar layout */}
        <div className={`max-w-[1200px] mx-auto px-4 py-10 ${hasSidebar ? 'lg:grid lg:grid-cols-[1fr_280px] lg:gap-10' : ''}`}>
          {/* Article content */}
          <article className="min-w-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-brand-gray-dark mb-6">
                <Link href="/" className="hover:text-brand-purple transition-colors">{t('article.home')}</Link>
                <span className="text-brand-gray">/</span>
                <Link href="/articles" className="hover:text-brand-purple transition-colors">{t('article.articles')}</Link>
                <span className="text-brand-gray">/</span>
                <span className="text-brand-purple/60 truncate max-w-[200px] md:max-w-[400px]">{displayTitle}</span>
              </nav>

              {/* Translation indicator */}
              <TranslationBanner
                isTranslating={isTranslatingMeta || (isTranslatingContent && !hasMetaTranslation)}
                isTranslated={isTranslated}
                translationError={translationError}
                showOriginal={showOriginal}
                onToggle={() => setShowOriginal((v) => !v)}
                onRetry={fetchTranslation}
                t={t}
              />
              {/* Content still translating indicator */}
              {isTranslatingContent && hasMetaTranslation && !showOriginal && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4 text-xs bg-blue-50 text-blue-600 border border-blue-100">
                  <Loader2 size={13} className="animate-spin flex-shrink-0" />
                  <span>{t('article.translatingContent')}</span>
                </div>
              )}

              <span className="inline-block px-3 py-1 bg-brand-neon/15 text-brand-purple text-xs font-bold uppercase tracking-wider rounded mb-4">
                {t((`category.${article?.category ?? 'news'}`) as any)}
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-purple leading-tight mb-6">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-gray-dark mb-6 pb-6 border-b border-brand-gray">
                <div className="flex items-center gap-4">
                  {article?.authorName && (
                    <div className="flex items-center gap-2"><User size={14} /> {article.authorName}</div>
                  )}

                </div>
                <div className="ml-auto"><ShareButtons title={article?.title ?? ''} compact articleUrl={articleUrl} /></div>
              </div>

              {/* Desktop: content split at ~37% with subscribe block inserted */}
              {(() => {
                const subscribeIdx = Math.max(1, Math.floor(contentBlocks.length * 0.37));
                const beforeSubscribe = contentBlocks.slice(0, subscribeIdx).join('');
                const afterSubscribe = contentBlocks.slice(subscribeIdx).join('');
                return (
                  <div className="hidden lg:block">
                    <div className="editorial-body prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-brand-purple/80 prose-p:leading-[1.85] prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-brand-neon prose-blockquote:bg-brand-gray prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-brand-purple/90 prose-blockquote:font-medium prose-blockquote:my-8 prose-strong:text-brand-purple prose-strong:font-bold prose-a:text-brand-purple prose-a:underline prose-li:text-brand-purple/80" dangerouslySetInnerHTML={{ __html: beforeSubscribe }} />
                    <SubscribeForm source="article" variant="inline" />
                    <div className="editorial-body prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-brand-purple/80 prose-p:leading-[1.85] prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-brand-neon prose-blockquote:bg-brand-gray prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-brand-purple/90 prose-blockquote:font-medium prose-blockquote:my-8 prose-strong:text-brand-purple prose-strong:font-bold prose-a:text-brand-purple prose-a:underline prose-li:text-brand-purple/80" dangerouslySetInnerHTML={{ __html: afterSubscribe }} />
                  </div>
                );
              })()}

              {/* Mobile content — with inline slots & subscribe block inserted between blocks */}
              {(() => {
                const subscribeIdx = Math.max(1, Math.floor(contentBlocks.length * 0.37));
                return (
                  <div className="lg:hidden">
                    {contentBlocks.map((block, i) => (
                      <React.Fragment key={i}>
                        <div className="editorial-body prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-brand-purple/80 prose-p:leading-[1.85] prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-brand-neon prose-blockquote:bg-brand-gray prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-brand-purple/90 prose-blockquote:font-medium prose-blockquote:my-8 prose-strong:text-brand-purple prose-strong:font-bold prose-a:text-brand-purple prose-a:underline prose-li:text-brand-purple/80" dangerouslySetInnerHTML={{ __html: block }} />
                        {i + 1 === subscribeIdx && <SubscribeForm source="article" variant="inline" />}
                        {insertionMap[i + 1] && <MobileInlineSlot type={insertionMap[i + 1].type} data={insertionMap[i + 1].data} />}
                      </React.Fragment>
                    ))}
                  </div>
                );
              })()}

              {/* Inline Sponsor Banners */}
              {article?.banner1Image && (
                <div className="my-8">{article.banner1Link ? <a href={article.banner1Link} target="_blank" rel="noopener noreferrer"><img src={article.banner1Image} alt="Sponsor" className="w-full rounded-lg" /></a> : <img src={article.banner1Image} alt="Sponsor" className="w-full rounded-lg" />}</div>
              )}
              {article?.banner2Image && (
                <div className="my-8">{article.banner2Link ? <a href={article.banner2Link} target="_blank" rel="noopener noreferrer"><img src={article.banner2Image} alt="Sponsor" className="w-full rounded-lg" /></a> : <img src={article.banner2Image} alt="Sponsor" className="w-full rounded-lg" />}</div>
              )}
              {article?.banner3Image && (
                <div className="my-8">{article.banner3Link ? <a href={article.banner3Link} target="_blank" rel="noopener noreferrer"><img src={article.banner3Image} alt="Sponsor" className="w-full rounded-lg" /></a> : <img src={article.banner3Image} alt="Sponsor" className="w-full rounded-lg" />}</div>
              )}

              {/* Universal Video Module */}
              <UniversalVideoModule videoUrl={article?.videoUrl ?? ''} posterImage={article?.videoPosterImage || article?.imageUrl} title={displayTitle} />

              {/* Image Gallery */}
              {(() => {
                let gallery: string[] = [];
                try { gallery = JSON.parse(article?.galleryImages ?? '[]').filter(Boolean); } catch {}
                if (gallery.length === 0) return null;
                return (
                  <div className="my-10">
                    <h3 className="text-lg font-heading font-bold text-brand-purple mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {gallery.map((img: string, i: number) => (
                        <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                          <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <ShareButtons title={article?.title ?? ''} articleUrl={articleUrl} />
            </motion.div>
          </article>

          {/* Sidebar — desktop only (hidden on mobile via parent grid) */}
          {hasSidebar && (
            <div className="hidden lg:block">
              <div className="lg:sticky lg:top-6">
                <ArticleSidebar sidebarData={sidebarData} />
              </div>
            </div>
          )}
        </div>

        {/* You May Also Like */}
        {(relatedArticles ?? []).length > 0 && (
          <section className="bg-brand-gray py-14">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-10 bg-brand-neon rounded-full" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">{t('article.related')}</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {(relatedArticles ?? []).map((a: any, i: number) => (
                  <motion.div key={a?.id ?? i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Link href={`/articles/${a?.slug ?? ''}`} className="group block">
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-neon/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="relative aspect-[4/3] bg-brand-gray">
                          {a?.imageUrl && (
                            <Image src={a.imageUrl} alt={a?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: `${a?.focalPointX ?? 50}% ${a?.focalPointY ?? 50}%` }} sizes="(max-width: 768px) 100vw, 33vw" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-neon text-brand-purple-dark text-[10px] font-bold uppercase tracking-widest rounded">
                            {a?.category ?? 'News'}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-heading font-bold text-brand-purple group-hover:text-brand-neon transition-colors line-clamp-2 mb-3 text-[17px] leading-snug">
                            {a?.title ?? ''}
                          </h3>

                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      {/* Add bottom padding when banner is active so footer/content isn't hidden */}
      {bannerData && <div className="h-[100px] md:h-[90px]" />}
      {bannerData && (
        <StickyBanner
          desktopImage={bannerData.desktopImage}
          mobileImage={bannerData.mobileImage}
          link={bannerData.link}
          newTab={bannerData.newTab}
          closeEnabled={bannerData.closeEnabled}
        />
      )}
      <WhatsAppButton phoneNumber={null} />
    </div>
  );
}
