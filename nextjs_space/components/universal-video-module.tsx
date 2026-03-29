"use client";
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';
import { Play, ExternalLink, Instagram } from 'lucide-react';

/* ──────────────────────────────────────────────
   Platform detection
   ────────────────────────────────────────────── */

type VideoPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'unknown';

interface PlatformInfo {
  platform: VideoPlatform;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

function detectPlatform(url: string): PlatformInfo {
  if (!url) return { platform: 'unknown', id: null, embedUrl: null, thumbnailUrl: null };

  try {
    const cleaned = url.split('?')[0];

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
    if (ytMatch) {
      const id = ytMatch[1];
      return {
        platform: 'youtube',
        id,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/2ybiC9EF-oc/sddefault.jpg`,
      };
    }

    // Instagram
    if (url.includes('instagram.com')) {
      const igMatch = cleaned.match(/instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/);
      const id = igMatch?.[2] ?? null;
      return {
        platform: 'instagram',
        id,
        embedUrl: null, // Instagram blocks iframe embeds
        thumbnailUrl: null,
      };
    }

    // TikTok
    if (url.includes('tiktok.com')) {
      const tkMatch = cleaned.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
      const id = tkMatch?.[1] ?? null;
      return {
        platform: 'tiktok',
        id,
        embedUrl: null, // TikTok embeds are unreliable in iframes
        thumbnailUrl: null,
      };
    }

    // Facebook
    if (url.includes('facebook.com') || url.includes('fb.watch')) {
      return {
        platform: 'facebook',
        id: null,
        embedUrl: null,
        thumbnailUrl: null,
      };
    }
  } catch {}

  return { platform: 'unknown', id: null, embedUrl: null, thumbnailUrl: null };
}

/* ──────────────────────────────────────────────
   Platform branding
   ────────────────────────────────────────────── */

const PLATFORM_CONFIG: Record<VideoPlatform, {
  label: string;
  gradient: string;
  icon: React.ReactNode;
  accentClass: string;
}> = {
  youtube: {
    label: 'YouTube',
    gradient: 'from-red-600 via-red-500 to-red-400',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    accentClass: 'text-red-500',
  },
  instagram: {
    label: 'Instagram',
    gradient: 'from-purple-600 via-pink-500 to-orange-400',
    icon: <Instagram size={20} />,
    accentClass: 'text-pink-500',
  },
  tiktok: {
    label: 'TikTok',
    gradient: 'from-black via-gray-900 to-gray-800',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.51a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.04a8.16 8.16 0 0 0 4.77 1.54V7.12a4.82 4.82 0 0 1-1.01-.43z"/></svg>,
    accentClass: 'text-gray-900',
  },
  facebook: {
    label: 'Facebook',
    gradient: 'from-blue-700 via-blue-600 to-blue-500',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    accentClass: 'text-blue-600',
  },
  unknown: {
    label: 'Video',
    gradient: 'from-gray-700 via-gray-600 to-gray-500',
    icon: <Play size={20} />,
    accentClass: 'text-gray-600',
  },
};

/* ──────────────────────────────────────────────
   Props
   ────────────────────────────────────────────── */

interface UniversalVideoModuleProps {
  videoUrl: string;
  /** Poster / thumbnail image (if available, e.g. from article featuredImage) */
  posterImage?: string;
  /** Title / name shown on the card */
  title?: string;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom CTA link (different from video) */
  ctaLink?: string;
}

/* ──────────────────────────────────────────────
   YouTube embed (horizontal 16:9)
   ────────────────────────────────────────────── */

function YouTubeEmbed({ info, title, ctaText, ctaLink }: { info: PlatformInfo; title?: string; ctaText?: string; ctaLink?: string }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = React.useState(false);
  const config = PLATFORM_CONFIG.youtube;

  return (
    <div>
      {/* 16:9 container */}
      {playing ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xl">
          <iframe
            src={`${info.embedUrl}?autoplay=1&rel=0`}
            title={title || 'YouTube Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-xl cursor-pointer border-0 p-0"
          aria-label={t('video.play') as string}
        >
          {/* Thumbnail */}
          {info.thumbnailUrl && (
            <Image
              src={info.thumbnailUrl}
              alt={title || 'Video thumbnail'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3 pt-8 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
            <div className="flex items-center gap-2 text-white/80 text-xs">
              {config.icon}
              <span className="font-medium">YouTube</span>
            </div>
            {title && <p className="text-white text-sm font-semibold truncate ml-4 max-w-[60%]">{title}</p>}
          </div>
        </button>
      )}

      {/* CTA below */}
      {ctaText && (
        <div className="mt-4 text-center">
          {ctaLink ? (
            <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple font-bold rounded-full hover:brightness-110 transition">
              {ctaText} <ExternalLink size={16} />
            </a>
          ) : (
            <p className="text-gray-600 font-medium">{ctaText}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Social video card (Instagram / TikTok / Facebook)
   Vertical 9:16 card with poster + link out
   ────────────────────────────────────────────── */

function SocialVideoCard({ info, videoUrl, posterImage, title, ctaText }: {
  info: PlatformInfo;
  videoUrl: string;
  posterImage?: string;
  title?: string;
  ctaText?: string;
}) {
  const { t } = useLanguage();
  const config = PLATFORM_CONFIG[info.platform] || PLATFORM_CONFIG.unknown;
  const buttonLabel = ctaText || (t('video.watchOn') as string).replace('{platform}', config.label);

  return (
    <div className="flex flex-col items-center">
      {/* 9:16 vertical card */}
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full max-w-[340px] md:max-w-[380px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Gradient border via CSS mask */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} p-[3px] pointer-events-none z-10`}
          style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
        />

        {/* Card body */}
        <div className="relative bg-gray-900 overflow-hidden" style={{ aspectRatio: '9/16' }}>
          {/* Poster image */}
          {posterImage ? (
            <Image src={posterImage} alt={title || 'Video'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30`} />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

          {/* Platform header */}
          <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center gap-2.5 bg-gradient-to-b from-black/60 to-transparent">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 text-white`}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{config.label}</p>
              <p className="text-white/60 text-[10px]">Reel</p>
            </div>
            <div className="text-white/70">
              <ExternalLink size={14} />
            </div>
          </div>

          {/* Play button centre */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 border border-white/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-12 bg-gradient-to-t from-black/90 to-transparent">
            {title && <p className="text-white font-bold text-sm mb-1 line-clamp-2">{title}</p>}
            <p className="text-white/70 text-xs flex items-center gap-1.5">
              {config.icon}
              <span>{buttonLabel}</span>
            </p>
          </div>
        </div>
      </a>

      {/* CTA button below card */}
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 mt-5 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white font-bold text-sm rounded-full hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-lg`}
      >
        {config.icon}
        <span>{buttonLabel}</span>
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main exported component
   ────────────────────────────────────────────── */

export default function UniversalVideoModule({ videoUrl, posterImage, title, ctaText, ctaLink }: UniversalVideoModuleProps) {
  const { t } = useLanguage();

  if (!videoUrl) return null;

  const info = detectPlatform(videoUrl);
  const config = PLATFORM_CONFIG[info.platform] || PLATFORM_CONFIG.unknown;

  return (
    <div className="my-10">
      {/* Section heading */}
      <h3 className="text-lg font-heading font-bold text-brand-purple mb-4 flex items-center gap-2">
        <span className={config.accentClass}>{config.icon}</span>
        {t('video.sectionTitle')}
      </h3>

      {info.platform === 'youtube' && info.embedUrl ? (
        <YouTubeEmbed info={info} title={title} ctaText={ctaText} ctaLink={ctaLink} />
      ) : (
        <SocialVideoCard
          info={info}
          videoUrl={videoUrl}
          posterImage={posterImage}
          title={title}
          ctaText={ctaText}
        />
      )}
    </div>
  );
}

/** Helper to export platform detection for CMS use */
export { detectPlatform, type VideoPlatform };
