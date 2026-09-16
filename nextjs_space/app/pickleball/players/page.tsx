export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball Players | Dink Authority Magazine',
  description: 'Player profiles, interviews, and stories from professional players, enthusiasts, and rising junior stars in pickleball.',
  openGraph: {
    title: 'Pickleball Players | Dink Authority Magazine',
    description: 'Player profiles, interviews, and stories from the world of pickleball.',
    url: `${SITE_URL}/pickleball/players`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/players` },
};

// New canonical base for the players section. Supports the in-page category filters
// used by the /pickleball/players/[category] clean routes.
export default async function PickleballPlayersPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('players', searchParams, 'en');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" />;
}
