export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pickleball Players | Dink Authority Magazine',
  description: 'Player profiles, interviews, and stories from professional players, enthusiasts, and rising junior stars in pickleball.',
  openGraph: {
    title: 'Pickleball Players | Dink Authority Magazine',
    description: 'Player profiles, interviews, and stories from the world of pickleball.',
    type: 'website',
  },
};

export default async function PlayersPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('players', searchParams, 'en');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" />;
}
