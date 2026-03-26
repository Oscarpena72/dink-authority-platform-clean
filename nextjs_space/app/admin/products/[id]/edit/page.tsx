export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductFormClient from '../../_components/product-form-client';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  return <ProductFormClient product={JSON.parse(JSON.stringify(product))} />;
}
