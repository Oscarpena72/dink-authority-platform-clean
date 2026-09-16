export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball Enthusiasts | Dink Authority Magazine',
  description: 'Stories from the passionate everyday players and community builders driving the pickleball movement.',
  openGraph: {
    title: 'Pickleball Enthusiasts | Dink Authority Magazine',
    description: 'Stories from the passionate everyday players and community builders driving the pickleball movement.',
    url: `${SITE_URL}/pickleball/players/enthusiasts`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/players/enthusiasts` },
};

// Clean route for the "enthusiasts" category (moved from /players?category=enthusiasts, 301-redirected).
export default async function PickleballEnthusiastsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData(
    'players',
    { ...searchParams, category: 'enthusiasts' },
    'en',
  );
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" />;
}
