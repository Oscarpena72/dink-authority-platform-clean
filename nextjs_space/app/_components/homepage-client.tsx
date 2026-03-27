"use client";
import React, { useMemo } from 'react';
import Header from './header';
import AdBanner from './ad-banner';
import HeroStory from './hero-story';
import LatestNews from './latest-news';
import FeaturedArticles from './featured-articles';
import UpcomingEvents from './upcoming-events';
import RecentResults from './recent-results';
import MagazineSection from './magazine-section';
import NewsletterSignup from './newsletter-signup';
import Footer from './footer';
import WhatsAppButton from './whatsapp-button';
import CookieBanner from './cookie-banner';
import StickyBanner from './sticky-banner';

interface HomeData {
  heroArticle: any;
  latestArticles: any[];
  featuredArticles: any[];
  events: any[];
  results: any[];
  editions: any[];
  settings: Record<string, string>;
}

export default function HomePageClient({ data }: { data: HomeData }) {
  const { heroArticle, latestArticles, featuredArticles, events, results, editions, settings } = data ?? {} as HomeData;

  // Extract sticky banner configuration from site settings
  const bannerData = useMemo(() => {
    if (!settings) return null;
    const active = settings.sticky_banner_active === 'true';
    const desktopImage = settings.sticky_banner_image_desktop ?? '';
    const mobileImage = settings.sticky_banner_image_mobile ?? '';
    if (!active || (!desktopImage && !mobileImage)) return null;
    return {
      desktopImage,
      mobileImage,
      link: settings.sticky_banner_link ?? '',
      newTab: settings.sticky_banner_newtab === 'true',
      closeEnabled: settings.sticky_banner_close_enabled !== 'false',
    };
  }, [settings]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* 1. Ad Banner - sponsors/publicidad */}
        <AdBanner imageUrl={settings?.ad_banner_image ?? '/images/ad-banner.jpg'} linkUrl={settings?.ad_banner_link ?? null} />

        {/* 2. LEVEL 1: Hero Story - dominant visual */}
        <HeroStory article={heroArticle} />

        {/* 3. LEVEL 3: Quick Headlines / Latest News */}
        <LatestNews articles={latestArticles ?? []} />

        {/* 4. LEVEL 2: Featured Articles - editorial depth */}
        <FeaturedArticles articles={featuredArticles ?? []} />

        {/* 5. Upcoming Events */}
        <UpcomingEvents events={events ?? []} />

        {/* 6. Recent Results */}
        <RecentResults results={results ?? []} />

        {/* 7. Magazine Section */}
        <MagazineSection editions={editions ?? []} />

        {/* 8. Newsletter Signup */}
        <NewsletterSignup />
      </main>
      <Footer />
      {/* Sticky bottom banner spacer + component */}
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
      <WhatsAppButton phoneNumber={settings?.whatsapp_number ?? null} />
      <CookieBanner />
    </div>
  );
}
