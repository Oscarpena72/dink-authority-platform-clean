export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pro Pickleball Players | Dink Authority Magazine',
  description: 'Profiles, interviews and stories of professional pickleball players from around the world.',
  openGraph: {
    title: 'Pro Pickleball Players | Dink Authority Magazine',
    description: 'Profiles, interviews and stories of professional pickleball players from around the world.',
    url: `${SITE_URL}/pickleball/players/pro-players`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/players/pro-players` },
};

// Clean route for the "pro-players" category (moved from /players?category=pro-players, 301-redirected).
export default async function PickleballProPlayersPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData(
    'players',
    { ...searchParams, category: 'pro-players' },
    'en',
  );
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" />;
}
