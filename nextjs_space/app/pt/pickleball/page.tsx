export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
// Reuse the existing Portuguese landing implementation; only the canonical URL changes.
import PtLandingPage from '@/app/pt/page';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Dink Authority Magazine em Português | Notícias de Pickleball',
  description: 'Notícias, jogadores e dicas de pickleball em português. A principal revista digital para a comunidade global de pickleball.',
  openGraph: {
    title: 'Dink Authority Magazine em Português',
    description: 'Notícias, jogadores e dicas de pickleball em português.',
    url: `${SITE_URL}/pt/pickleball`,
    type: 'website',
    locale: 'pt_BR',
  },
  alternates: { canonical: `${SITE_URL}/pt/pickleball` },
};

// New canonical location for the Portuguese landing page (moved from /pt, 301-redirected).
export default PtLandingPage;
