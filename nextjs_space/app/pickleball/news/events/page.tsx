export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball Events | Dink Authority Magazine',
  description: 'Coverage of pickleball tournaments, exhibitions, and events around the globe.',
  openGraph: {
    title: 'Pickleball Events | Dink Authority Magazine',
    description: 'Coverage of pickleball tournaments, exhibitions, and events around the globe.',
    url: `${SITE_URL}/pickleball/news/events`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/news/events` },
};

// Clean route for the "events" news category (moved from /news?category=events, 301-redirected).
export default async function PickleballNewsEventsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData(
    'news',
    { ...searchParams, category: 'events' },
    'en',
  );
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" />;
}
