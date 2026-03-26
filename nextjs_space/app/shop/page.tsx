export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import ShopPageClient from './_components/shop-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | Dink Authority Magazine',
  description: 'Official Dink Authority merchandise and gear. Premium pickleball apparel, accessories, and equipment.',
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  return <ShopPageClient products={JSON.parse(JSON.stringify(products))} />;
}
