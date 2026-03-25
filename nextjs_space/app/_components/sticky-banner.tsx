"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const SESSION_KEY = 'sticky_banner_dismissed';

interface StickyBannerProps {
  desktopImage: string;
  mobileImage: string;
  link: string;
  newTab?: boolean;
  closeEnabled?: boolean;
}

export default function StickyBanner({ desktopImage, mobileImage, link, newTab = true, closeEnabled = true }: StickyBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) !== 'true') {
        setVisible(true);
      }
    } catch { setVisible(true); }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch { /* */ }
  };

  if (!visible) return null;

  const linkTarget = newTab ? '_blank' : '_self';
  const linkRel = newTab ? 'noopener noreferrer' : undefined;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* Desktop banner: 970×90 */}
        <a
          href={link}
          target={linkTarget}
          rel={linkRel}
          className="hidden md:block"
        >
          <div className="relative w-[970px] h-[90px] bg-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <Image
              src={desktopImage}
              alt="Advertisement"
              fill
              className="object-cover"
              sizes="970px"
              priority
            />
          </div>
        </a>

        {/* Mobile banner: 320×100 */}
        <a
          href={link}
          target={linkTarget}
          rel={linkRel}
          className="block md:hidden"
        >
          <div className="relative w-[320px] h-[100px] bg-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <Image
              src={mobileImage}
              alt="Advertisement"
              fill
              className="object-cover"
              sizes="320px"
              priority
            />
          </div>
        </a>

        {/* Close button */}
        {closeEnabled && (
          <button
            onClick={handleClose}
            aria-label="Close banner"
            className="absolute -top-3 -right-3 z-50 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          >
            <X size={14} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
