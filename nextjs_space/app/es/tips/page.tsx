export const dynamic = "force-dynamic";
import TipsPageClient from '@/app/tips/_components/tips-page-client';
import { getTipsPageData } from '@/lib/section-page-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consejos de Pickleball | Dink Authority Magazine',
  description: 'Consejos expertos de pickleball de jugadores y entrenadores profesionales. Domina tu juego, estrategia y técnica.',
  openGraph: { title: 'Consejos de Pickleball | Dink Authority Magazine', description: 'Consejos expertos de jugadores y entrenadores profesionales.', type: 'website', locale: 'es_ES' },
};

export default async function EsTipsPage() {
  const { serialized, bannerData } = await getTipsPageData('es');
  return <TipsPageClient tips={serialized} bannerData={bannerData} pageLocale="es" localePrefix="/es" />;
}
