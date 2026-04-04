export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import JuniorsPageClient from './_components/juniors-page-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Juniors | Dink Authority Magazine',
  description: 'Meet the next generation of pickleball stars. Stories, interviews, and profiles of the most promising junior players in the world.',
  openGraph: {
    title: 'Juniors | Dink Authority Magazine',
    description: 'Meet the next generation of pickleball stars.',
    type: 'website',
  },
};

export default async function JuniorsPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { status: 'published', category: 'juniors' },
      orderBy: { publishedAt: 'desc' },
    });
  } catch { /* empty */ }

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

  const serialized = (articles ?? []).map((a: any) => ({
    ...(a ?? {}),
    publishedAt: a?.publishedAt?.toISOString?.() ?? null,
    createdAt: a?.createdAt?.toISOString?.() ?? null,
    updatedAt: a?.updatedAt?.toISOString?.() ?? null,
  }));

  return <JuniorsPageClient juniors={serialized} bannerData={bannerData} />;
}
