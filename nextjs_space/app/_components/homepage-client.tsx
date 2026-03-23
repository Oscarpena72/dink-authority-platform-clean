"use client";
import React from 'react';
import Header from './header';
import AdBanner from './ad-banner';
import HeroStory from './hero-story';
import LatestNews from './latest-news';
import FeaturedArticles from './featured-articles';
import UpcomingEvents from './upcoming-events';
import NewsletterSignup from './newsletter-signup';
import Footer from './footer';
import WhatsAppButton from './whatsapp-button';
import CookieBanner from './cookie-banner';

interface HomeData {
  heroArticle: any;
  latestArticles: any[];
  featuredArticles: any[];
  events: any[];
  settings: Record<string, string>;
}

export default function HomePageClient({ data }: { data: HomeData }) {
  const { heroArticle, latestArticles, featuredArticles, events, settings } = data ?? {} as HomeData;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AdBanner imageUrl={settings?.ad_banner_image ?? '/images/ad-banner.jpg'} linkUrl={settings?.ad_banner_link ?? null} />
        <HeroStory article={heroArticle} />
        <LatestNews articles={latestArticles ?? []} />
        <FeaturedArticles articles={featuredArticles ?? []} />
        <UpcomingEvents events={events ?? []} />
        <NewsletterSignup />
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={settings?.whatsapp_number ?? null} />
      <CookieBanner />
    </div>
  );
}
