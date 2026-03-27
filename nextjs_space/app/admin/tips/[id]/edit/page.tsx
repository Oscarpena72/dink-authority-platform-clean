export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import TipFormClient from '../../_components/tip-form-client';

export default async function EditTipPage({ params }: { params: { id: string } }) {
  let tip: any = null;
  try {
    tip = await prisma.tip.findUnique({ where: { id: params?.id ?? '' }, include: { author: true } });
  } catch {}
  if (!tip) return notFound();

  const serialized = {
    ...tip,
    publishDate: tip?.publishDate?.toISOString?.() ?? null,
    createdAt: tip?.createdAt?.toISOString?.() ?? null,
    updatedAt: tip?.updatedAt?.toISOString?.() ?? null,
    author: tip?.author ? {
      ...tip.author,
      createdAt: tip.author?.createdAt?.toISOString?.() ?? null,
      updatedAt: tip.author?.updatedAt?.toISOString?.() ?? null,
    } : null,
  };

  return <TipFormClient tip={serialized} />;
}
