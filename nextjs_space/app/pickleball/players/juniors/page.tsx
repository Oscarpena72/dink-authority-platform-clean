export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Junior Pickleball Players | Dink Authority Magazine',
  description: 'Meet the rising junior stars shaping the future of pickleball.',
  openGraph: {
    title: 'Junior Pickleball Players | Dink Authority Magazine',
    description: 'Meet the rising junior stars shaping the future of pickleball.',
    url: `${SITE_URL}/pickleball/players/juniors`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/players/juniors` },
};

// Clean route for the "juniors" category (moved from /players?category=juniors, 301-redirected).
export default async function PickleballJuniorsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData(
    'players',
    { ...searchParams, category: 'juniors' },
    'en',
  );
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" />;
}
