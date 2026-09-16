export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball Places | Dink Authority Magazine',
  description: 'Discover the best pickleball places around the world including courts, clubs, resorts and destinations.',
  openGraph: {
    title: 'Pickleball Places | Dink Authority Magazine',
    description: 'Discover the best pickleball places around the world including courts, clubs, resorts and destinations.',
    url: `${SITE_URL}/pickleball/news/places`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/news/places` },
};

// Clean route for the "places" news category (moved from /news?category=places, 301-redirected).
export default async function PickleballNewsPlacesPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData(
    'news',
    { ...searchParams, category: 'places' },
    'en',
  );
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" />;
}
