export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Noticias de Pickleball | Dink Authority Magazine',
  description: 'Las últimas noticias de pickleball, editoriales, cobertura de eventos y actualizaciones del sector.',
  openGraph: { title: 'Noticias de Pickleball | Dink Authority Magazine', description: 'Las últimas noticias de pickleball.', type: 'website', locale: 'es_ES' },
};

export default async function EsNewsPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('news', searchParams, 'es');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" pageLocale="es" localePrefix="/es" />;
}
