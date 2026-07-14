export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jugadores de Pickleball | Dink Authority Magazine',
  description: 'Perfiles de jugadores, entrevistas e historias de profesionales, aficionados y jóvenes promesas del pickleball.',
  openGraph: { title: 'Jugadores de Pickleball | Dink Authority Magazine', description: 'Perfiles e historias del mundo del pickleball.', type: 'website', locale: 'es_ES' },
};

export default async function EsPlayersPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('players', searchParams, 'es');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" pageLocale="es" localePrefix="/es" />;
}
