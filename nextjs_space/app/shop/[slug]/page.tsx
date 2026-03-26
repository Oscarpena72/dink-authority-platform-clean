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

  const relatedProducts = await prisma.product.findMany({
    where: { isActive: true, category: product.category, NOT: { id: product.id } },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return <ProductDetailClient product={JSON.parse(JSON.stringify(product))} relatedProducts={JSON.parse(JSON.stringify(relatedProducts))} />;
}
