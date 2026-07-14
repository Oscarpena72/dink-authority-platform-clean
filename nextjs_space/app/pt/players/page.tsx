export const dynamic = "force-dynamic";
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { getPaginatedSectionData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jogadores de Pickleball | Dink Authority Magazine',
  description: 'Perfis de jogadores, entrevistas e histórias de profissionais, entusiastas e jovens promessas do pickleball.',
  openGraph: { title: 'Jogadores de Pickleball | Dink Authority Magazine', description: 'Perfis e histórias do mundo do pickleball.', type: 'website', locale: 'pt_BR' },
};

export default async function PtPlayersPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const { serialized, page, totalPages, query, subCategory } = await getPaginatedSectionData('players', searchParams, 'pt');
  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="players" pageLocale="pt" localePrefix="/pt" />;
}
