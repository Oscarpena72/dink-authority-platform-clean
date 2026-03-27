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

  // Fetch sticky banner settings
  let bannerData: any = null;
  try {
    const settingsRows = await prisma.siteSetting.findMany({
      where: { key: { in: [
        'sticky_banner_active', 'sticky_banner_image_desktop', 'sticky_banner_image_mobile',
        'sticky_banner_link', 'sticky_banner_newtab', 'sticky_banner_close_enabled',
      ] } },
    });
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
  } catch {}

  const serialized = (tips ?? []).map((t: any) => ({
    ...(t ?? {}),
    publishDate: t?.publishDate?.toISOString?.() ?? null,
    createdAt: t?.createdAt?.toISOString?.() ?? null,
    updatedAt: t?.updatedAt?.toISOString?.() ?? null,
  }));

  return <TipsPageClient tips={serialized} category={category} bannerData={bannerData} />;
}
