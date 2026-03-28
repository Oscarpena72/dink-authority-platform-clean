export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import JuniorFormClient from '../../_components/junior-form-client';

export default async function EditJuniorPage({ params }: { params: { id: string } }) {
  let junior: any = null;
  try {
    junior = await prisma.junior.findUnique({ where: { id: params?.id ?? '' } });
  } catch {}
  if (!junior) return notFound();

  const serialized = {
    ...junior,
    publishDate: junior?.publishDate?.toISOString?.() ?? null,
    createdAt: junior?.createdAt?.toISOString?.() ?? null,
    updatedAt: junior?.updatedAt?.toISOString?.() ?? null,
  };

  return <JuniorFormClient junior={serialized} />;
}
