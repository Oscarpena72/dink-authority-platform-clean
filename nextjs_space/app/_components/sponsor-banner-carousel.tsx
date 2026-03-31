"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { usePathname } from 'next/navigation';

const COUNTRY_SLUGS = ['colombia', 'canada', 'mexico'];

function detectCountry(pathname: string | null): string {
  if (!pathname) return 'central';
  const seg = pathname.split('/').filter(Boolean);
  if (seg.length > 0 && COUNTRY_SLUGS.includes(seg[0])) return seg[0];
  return 'central';
}

interface Sponsor {
  id: string;
  sponsorName: string;
  imageUrl: string;
  link: string;
}

export default function SponsorBannerCarousel({ className }: { className?: string }) {
  const pathname = usePathname();
  const country = detectCountry(pathname);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    fetch(`/api/sponsors?country=${country}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSponsors(data);
      })
      .catch(() => {});
  }, [country]);

  if (sponsors.length === 0) return null;

  return (
    <div className={`w-full flex justify-center ${className || ''}`}>
      <div className="w-full max-w-[1200px] px-4">
        <div className="overflow-hidden rounded-[10px]" ref={emblaRef}>
          <div className="flex">
            {sponsors.map((s) => {
              const inner = (
                <div className="relative w-full h-[150px] md:h-[200px] bg-gray-100 rounded-[10px] overflow-hidden">
                  <Image
                    src={s.imageUrl}
                    alt={`Sponsor: ${s.sponsorName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              );
              return (
                <div key={s.id} className="flex-[0_0_100%] min-w-0">
                  {s.link ? (
                    <Link href={s.link} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </Link>
                  ) : inner}
                </div>
              );
            })}
          </div>
        </div>
        {/* Dots */}
        {sponsors.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === selectedIndex
                    ? 'bg-brand-purple scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
