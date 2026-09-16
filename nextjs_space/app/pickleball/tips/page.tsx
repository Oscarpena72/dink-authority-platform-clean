export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
// Reuse the existing tips listing implementation; only the canonical URL changes.
import TipsPage from '@/app/tips/page';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Pickleball Tips | Dink Authority Magazine',
  description: 'Expert pickleball tips from professional players and coaches. Master your dink game, strategy, and technique.',
  openGraph: {
    title: 'Pickleball Tips | Dink Authority Magazine',
    description: 'Expert pickleball tips from professional players and coaches.',
    url: `${SITE_URL}/pickleball/tips`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/pickleball/tips` },
};

// New canonical location for the tips section (moved from /tips, 301-redirected).
export default TipsPage;
