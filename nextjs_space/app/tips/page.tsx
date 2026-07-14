export const dynamic = "force-dynamic";
import TipsPageClient from './_components/tips-page-client';
import { getTipsPageData } from '@/lib/section-page-data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pickleball Tips | Dink Authority Magazine',
  description: 'Expert pickleball tips from professional players and coaches. Master your dink game, strategy, and technique.',
  openGraph: {
    title: 'Pickleball Tips | Dink Authority Magazine',
    description: 'Expert pickleball tips from professional players and coaches.',
    type: 'website',
  },
};

export default async function TipsPage() {
  const { serialized, bannerData } = await getTipsPageData('en');
  return <TipsPageClient tips={serialized} bannerData={bannerData} />;
}
