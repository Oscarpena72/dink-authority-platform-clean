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

interface Props {
  className?: string;
  section?: string;
  variant?: 'default' | 'homepage';
}

export default function SponsorBannerCarousel({ className, section, variant = 'default' }: Props) {
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
    const params = new URLSearchParams();
    params.set('country', country);
    if (section) params.set('section', section);
    fetch(`/api/sponsors?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSponsors(data);
      })
      .catch(() => {});
  }, [country, section]);

  if (sponsors.length === 0) return null;

  /* --- Variant-based sizing --- */
  const isHomepage = variant === 'homepage';
  const maxWidthClass = isHomepage ? 'max-w-[1400px]' : 'max-w-[1200px]';
  const wrapperPadding = isHomepage ? 'py-3' : '';

  return (
    <div className={`w-full flex justify-center ${wrapperPadding} ${className || ''}`}>
      <div className={`w-full ${maxWidthClass} px-4`}>
        <div className="overflow-hidden rounded-[10px]" ref={emblaRef}>
          <div className="flex">
            {sponsors.map((s) => {
              const inner = (
                <div className="relative w-full aspect-[4/1] bg-gray-100 rounded-[10px] overflow-hidden">
                  <Image
                    src={s.imageUrl}
                    alt={`Sponsor: ${s.sponsorName}`}
                    fill
                    className="object-cover object-center"
                    sizes={isHomepage ? '(max-width: 768px) 100vw, 1400px' : '(max-width: 768px) 100vw, 1200px'}
                    priority={isHomepage}
                  />
                </div>
              );
              return (
                <div key={s.id} className="flex-[0_0_100%] min-w-0 flex items-center justify-center">
                  {s.link ? (
                    <Link href={s.link} target="_blank" rel="noopener noreferrer" className="block w-full">
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
        {isHomepage && (
          <p className="text-center text-[10px] text-brand-gray-dark mt-1 uppercase tracking-widest font-medium">Sponsored</p>
        )}
      </div>
    </div>
  );
}
