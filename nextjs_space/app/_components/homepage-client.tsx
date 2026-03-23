"use client";
import React from 'react';
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
      <WhatsAppButton phoneNumber={settings?.whatsapp_number ?? null} />
      <CookieBanner />
    </div>
  );
}
