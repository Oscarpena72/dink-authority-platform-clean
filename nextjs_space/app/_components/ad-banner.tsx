"use client";
import React from 'react';
import Image from 'next/image';

interface AdBannerProps {
  imageUrl: string | null;
  linkUrl: string | null;
}

export default function AdBanner({ imageUrl, linkUrl }: AdBannerProps) {
  if (!imageUrl) return null;
  const content = (
    <div className="max-w-[1400px] mx-auto px-4 py-3">
      <div className="relative w-full h-[90px] md:h-[100px] bg-brand-gray rounded-lg overflow-hidden border border-gray-100">
        <Image src={imageUrl ?? '/images/ad-banner.jpg'} alt="Advertisement" fill className="object-cover" />
      </div>
      <p className="text-center text-[10px] text-brand-gray-dark mt-1 uppercase tracking-widest font-medium">Sponsored</p>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block bg-white hover:bg-brand-gray/50 transition-colors">
        {content}
      </a>
    );
  }
  return <div className="bg-white">{content}</div>;
}
