"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  /** Render as a compact inline row (no modal) */
  compact?: boolean;
}

/* ── SVG Icons ── */
const fbIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const liIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const xIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const waIcon = <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

export default function ShareButtons({ url, title, description, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !url) {
      setShareUrl(window.location.href);
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  /* Detect mobile devices via userAgent + viewport width */
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const mobileUA = /android|iphone|ipad|ipod|mobile|webos|blackberry|opera mini|iemobile/i.test(ua);
    return mobileUA || window.innerWidth < 768;
  }, []);

  /* Open share URL in a centered popup window */
  const openSharePopup = useCallback((popupUrl: string, w = 600, h = 500) => {
    const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
    const popup = window.open(
      popupUrl,
      'share_dialog',
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    if (!popup || popup.closed) {
      window.open(popupUrl, '_blank', 'noopener,noreferrer');
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  /* ── Compact inline variant (for cards) ── */
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={shareFacebook} title="Share on Facebook"
          className="p-1.5 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30">{fbIcon}</button>
        <button onClick={() => openSharePopup(linkedinUrl)} title="Share on LinkedIn"
          className="p-1.5 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30">{liIcon}</button>
        <button onClick={() => openSharePopup(xUrl, 550, 420)} title="Share on X"
          className="p-1.5 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-black/10 hover:text-black hover:border-black/30">{xIcon}</button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp"
          className="p-1.5 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30">{waIcon}</a>
        <button onClick={handleCopy} title="Copy Link"
          className="p-1.5 rounded-lg border border-transparent text-brand-gray-dark transition-all duration-200 hover:bg-brand-purple/10 hover:text-brand-purple hover:border-brand-purple/30">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  /* ── Full button + modal variant (for edition page) ── */
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm"
      >
        <Share2 size={16} /> Share
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-lg text-brand-purple">Share this edition</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Facebook: mobile redirect / desktop popup */}
              <button onClick={shareFacebook}
                className="flex items-center gap-2 px-4 py-3 text-white font-medium rounded-xl text-sm transition-all bg-[#1877F2] hover:bg-[#0d65d9]">
                {fbIcon} Facebook
              </button>
              {/* LinkedIn: popup */}
              <button onClick={() => openSharePopup(linkedinUrl)}
                className="flex items-center gap-2 px-4 py-3 text-white font-medium rounded-xl text-sm transition-all bg-[#0A66C2] hover:bg-[#004182]">
                {liIcon} LinkedIn
              </button>
              {/* X: popup */}
              <button onClick={() => openSharePopup(xUrl, 550, 420)}
                className="flex items-center gap-2 px-4 py-3 text-white font-medium rounded-xl text-sm transition-all bg-black hover:bg-gray-800">
                {xIcon} X
              </button>
              {/* WhatsApp: URL-only link */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-white font-medium rounded-xl text-sm transition-all bg-[#25D366] hover:bg-[#128C7E]">
                {waIcon} WhatsApp
              </a>
            </div>
            <button onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-brand-purple font-medium rounded-xl text-sm transition-all">
              {copied ? <><Check size={16} className="text-green-600" /> Copied!</> : <><Copy size={16} /> Copy Link</>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}