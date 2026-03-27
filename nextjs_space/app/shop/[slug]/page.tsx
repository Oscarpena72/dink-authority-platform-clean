export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './_components/product-detail-client';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, select: { name: true, shortDescription: true, images: true } });
  if (!product) return {};
  return {
    title: `${product.name} | Dink Authority Shop`,
    description: product.shortDescription || `Shop ${product.name} at Dink Authority Magazine.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product || !product.isActive) return notFound();

  const [relatedProducts, settingsRows] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, category: product.category, NOT: { id: product.id } },
      take: 4,
      orderBy: { createdAt: 'desc' },
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

  return <ProductDetailClient product={JSON.parse(JSON.stringify(product))} relatedProducts={JSON.parse(JSON.stringify(relatedProducts))} bannerData={bannerData} />;
}
