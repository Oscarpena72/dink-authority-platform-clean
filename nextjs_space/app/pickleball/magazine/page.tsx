export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
// Reuse the existing magazine archive implementation; only the canonical URL changes.
import MagazineArchivePage from '@/app/magazine/page';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Pickleball Magazine – All Editions | Dink Authority',
    description: 'Browse every issue of Dink Authority, a leading pickleball magazine featuring top players, tournaments, tips, and stories from the global pickleball community.',
    openGraph: {
      title: 'Pickleball Magazine – All Editions | Dink Authority',
      description: 'Browse every issue of Dink Authority, a leading pickleball magazine featuring top players, tournaments, and global pickleball stories.',
      url: `${SITE_URL}/pickleball/magazine`,
      type: 'website',
    },
    alternates: { canonical: `${SITE_URL}/pickleball/magazine` },
  };
}

// New canonical location for the magazine archive (moved from /magazine, 301-redirected).
export default MagazineArchivePage;
