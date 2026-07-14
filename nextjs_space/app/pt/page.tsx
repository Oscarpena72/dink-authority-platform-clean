export const dynamic = "force-dynamic";
import LocaleLanding from '@/app/_components/locale-landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dink Authority Magazine em Português | Notícias de Pickleball',
  description: 'Notícias, jogadores e dicas de pickleball em português. A principal revista digital para a comunidade global de pickleball.',
  openGraph: { title: 'Dink Authority Magazine em Português', description: 'Notícias, jogadores e dicas de pickleball em português.', type: 'website', locale: 'pt_BR' },
};

export default function PtLandingPage() {
  return <LocaleLanding locale="pt" />;
}
