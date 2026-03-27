export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import TipsPageClient from './_components/tips-page-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pickleball Tips | Dink Authority Magazine',
  description: 'Expert pickleball tips from professional players and coaches. Master your dink game, strategy, and technique.',
  openGraph: {
    title: 'Pickleball Tips | Dink Authority Magazine',
    description: 'Expert pickleball tips from professional players and coaches.',
    type: 'website',
  },
};

export default async function TipsPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams?.category ?? '';
  let where: any = { status: 'published' };
  if (category) where.category = category;

  let tips: any[] = [];
  try {
    tips = await prisma.tip.findMany({
      where,
      orderBy: { publishDate: 'desc' },
      include: { author: { select: { id: true, name: true, slug: true, photoUrl: true } } },
    });
  } catch { /* empty */ }

  const serialized = (tips ?? []).map((t: any) => ({
    ...(t ?? {}),
    publishDate: t?.publishDate?.toISOString?.() ?? null,
    createdAt: t?.createdAt?.toISOString?.() ?? null,
    updatedAt: t?.updatedAt?.toISOString?.() ?? null,
  }));

  return <TipsPageClient tips={serialized} category={category} />;
}
