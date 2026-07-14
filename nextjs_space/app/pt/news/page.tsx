export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notícias de Pickleball | Dink Authority Magazine',
  description: 'As últimas notícias de pickleball, editoriais, cobertura de eventos e atualizações do setor.',
  openGraph: { title: 'Notícias de Pickleball | Dink Authority Magazine', description: 'As últimas notícias de pickleball.', type: 'website', locale: 'pt_BR' },
};

export default async function PtNewsPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('news', searchParams, 'pt');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" pageLocale="pt" localePrefix="/pt" />;
}
