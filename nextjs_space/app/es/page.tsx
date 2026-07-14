export const dynamic = "force-dynamic";
import LocaleHome from '@/app/_components/locale-home';
import { getLocaleHomeData } from '@/lib/locale-home-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dink Authority Magazine en Español | Noticias de Pickleball',
  description: 'Noticias, jugadores y consejos de pickleball en español. La revista digital líder para la comunidad global de pickleball.',
  openGraph: { title: 'Dink Authority Magazine en Español', description: 'Noticias, jugadores y consejos de pickleball en español.', type: 'website', locale: 'es_ES' },
};

export default async function EsLandingPage() {
  const data = await getLocaleHomeData('es');
  return <LocaleHome locale="es" data={data} />;
}
