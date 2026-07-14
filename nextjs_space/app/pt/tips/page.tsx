export const dynamic = "force-dynamic";
import TipsPageClient from '@/app/tips/_components/tips-page-client';
import { getTipsPageData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dicas de Pickleball | Dink Authority Magazine',
  description: 'Dicas de especialistas em pickleball de jogadores e treinadores profissionais. Domine seu jogo, estratégia e técnica.',
  openGraph: { title: 'Dicas de Pickleball | Dink Authority Magazine', description: 'Dicas de especialistas de jogadores e treinadores profissionais.', type: 'website', locale: 'pt_BR' },
};

export default async function PtTipsPage() {
  const { serialized, bannerData } = await getTipsPageData('pt');
  return <TipsPageClient tips={serialized} bannerData={bannerData} pageLocale="pt" localePrefix="/pt" />;
}
