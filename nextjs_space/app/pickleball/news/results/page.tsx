export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball Results | Dink Authority Magazine',
  description: 'Tournament results and match coverage from across the pickleball world.',
  openGraph: {
    title: 'Pickleball Results | Dink Authority Magazine',
    description: 'Tournament results and match coverage from across the pickleball world.',
    url: `${SITE_URL}/pickleball/news/results`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/news/results` },
};

// Clean route for the "results" news category (moved from /news?category=results, 301-redirected).
export default async function PickleballNewsResultsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData(
    'news',
    { ...searchParams, category: 'results' },
    'en',
  );
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" />;
}
