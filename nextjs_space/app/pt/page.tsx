export const dynamic = "force-dynamic";
import LocaleHome from '@/app/_components/locale-home';
import { getLocaleHomeData } from '@/lib/locale-home-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dink Authority Magazine em Português | Notícias de Pickleball',
  description: 'Notícias, jogadores e dicas de pickleball em português. A principal revista digital para a comunidade global de pickleball.',
  openGraph: { title: 'Dink Authority Magazine em Português', description: 'Notícias, jogadores e dicas de pickleball em português.', type: 'website', locale: 'pt_BR' },
};

export default async function PtLandingPage() {
  const data = await getLocaleHomeData('pt');
  return <LocaleHome locale="pt" data={data} />;
}
