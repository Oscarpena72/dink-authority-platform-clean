export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
// Reuse the existing shop implementation; only the canonical URL changes.
import ShopPage from '@/app/shop/page';

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Shop | Dink Authority Magazine',
  description: 'Official Dink Authority merchandise and gear. Premium pickleball apparel, accessories, and equipment.',
  alternates: { canonical: `${SITE_URL}/pickleball/shop` },
};

// New canonical location for the shop (moved from /shop, 301-redirected).
export default ShopPage;
