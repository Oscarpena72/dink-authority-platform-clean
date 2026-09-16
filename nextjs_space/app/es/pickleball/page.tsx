export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
// Reuse the existing Spanish landing implementation; only the canonical URL changes.
import EsLandingPage from '@/app/es/page';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Dink Authority Magazine en Español | Noticias de Pickleball',
  description: 'Noticias, jugadores y consejos de pickleball en español. La revista digital líder para la comunidad global de pickleball.',
  openGraph: {
    title: 'Dink Authority Magazine en Español',
    description: 'Noticias, jugadores y consejos de pickleball en español.',
    url: `${SITE_URL}/es/pickleball`,
    type: 'website',
    locale: 'es_ES',
  },
  alternates: { canonical: `${SITE_URL}/es/pickleball` },
};

// New canonical location for the Spanish landing page (moved from /es, 301-redirected).
export default EsLandingPage;
