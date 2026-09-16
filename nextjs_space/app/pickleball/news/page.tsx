export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball News | Dink Authority Magazine',
  description: 'The latest pickleball news, editorials, event coverage, and industry updates from Dink Authority Magazine.',
  openGraph: {
    title: 'Pickleball News | Dink Authority Magazine',
    description: 'The latest pickleball news, editorials, event coverage, and industry updates.',
    url: `${SITE_URL}/pickleball/news`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/news` },
};

// New canonical location for the news section (moved from /news, 301-redirected).
export default async function PickleballNewsPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('news', searchParams, 'en');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" />;
}
