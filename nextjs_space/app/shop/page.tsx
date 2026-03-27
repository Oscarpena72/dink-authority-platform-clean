export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import ShopPageClient from './_components/shop-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | Dink Authority Magazine',
  description: 'Official Dink Authority merchandise and gear. Premium pickleball apparel, accessories, and equipment.',
};

export default async function ShopPage() {
  const [products, settingsRows] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.siteSetting.findMany({
      where: { key: { in: [
        'sticky_banner_active', 'sticky_banner_image_desktop', 'sticky_banner_image_mobile',
        'sticky_banner_link', 'sticky_banner_newtab', 'sticky_banner_close_enabled',
      ] } },
    }).catch(() => []),
  ]);

  let bannerData: any = null;
  const s: Record<string, string> = {};
  for (const row of settingsRows ?? []) { s[row?.key ?? ''] = row?.value ?? ''; }
  if (s.sticky_banner_active === 'true' && (s.sticky_banner_image_desktop || s.sticky_banner_image_mobile)) {
    bannerData = {
      desktopImage: s.sticky_banner_image_desktop ?? '',
      mobileImage: s.sticky_banner_image_mobile ?? '',
      link: s.sticky_banner_link ?? '',
      newTab: s.sticky_banner_newtab === 'true',
      closeEnabled: s.sticky_banner_close_enabled !== 'false',
    };
  }

  return <ShopPageClient products={JSON.parse(JSON.stringify(products))} bannerData={bannerData} />;
}
