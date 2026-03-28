export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JuniorDetailClient from './_components/junior-detail-client';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let junior: any = null;
  try {
    junior = await prisma.junior.findFirst({ where: { slug: params?.slug ?? '', status: 'published' } });
  } catch {}
  if (!junior) return { title: 'Junior Not Found' };
  const title = junior.metaTitle || `${junior.name} — ${junior.title}`;
  const description = junior.metaDescription || junior.excerpt || '';
  return {
    title: `${title} | Dink Authority Magazine`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: junior.featuredImage ? [{ url: junior.featuredImage }] : [],
      publishedTime: junior.publishDate?.toISOString?.(),
      authors: ['Dink Authority Magazine'],
    },
  };
}

export default async function JuniorPage({ params }: { params: { slug: string } }) {
  let junior: any = null;
  try {
    junior = await prisma.junior.findFirst({ where: { slug: params?.slug ?? '', status: 'published' } });
  } catch {}
  if (!junior) return notFound();

  // Related juniors (different id)
  let related: any[] = [];
  try {
    related = await prisma.junior.findMany({
      where: { status: 'published', id: { not: junior.id } },
      orderBy: { publishDate: 'desc' },
      take: 3,
    });
  } catch {}

  // Fetch latest edition (for fixed banner 1) + sticky banner settings
  let latestEdition: any = null;
  let bannerData: any = null;
  try {
    const [edition, settingsRows] = await Promise.all([
      prisma.magazineEdition.findFirst({
        where: { isCurrent: true },
        select: { title: true, coverUrl: true, slug: true, externalUrl: true },
      }).catch(() => null),
      prisma.siteSetting.findMany({
        where: { key: { in: [
          'sticky_banner_active', 'sticky_banner_image_desktop', 'sticky_banner_image_mobile',
          'sticky_banner_link', 'sticky_banner_newtab', 'sticky_banner_close_enabled',
        ] } },
      }).catch(() => []),
    ]);
    if (edition) {
      latestEdition = {
        title: edition.title ?? '',
        coverUrl: edition.coverUrl ?? '',
        link: edition.slug ? `/magazine/${edition.slug}` : (edition.externalUrl ?? ''),
      };
    }
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

  const serialized = {
    ...junior,
    publishDate: junior?.publishDate?.toISOString?.() ?? null,
    createdAt: junior?.createdAt?.toISOString?.() ?? null,
    updatedAt: junior?.updatedAt?.toISOString?.() ?? null,
  };

  const serializedRelated = (related ?? []).map((r: any) => ({
    ...r,
    publishDate: r?.publishDate?.toISOString?.() ?? null,
    createdAt: r?.createdAt?.toISOString?.() ?? null,
    updatedAt: r?.updatedAt?.toISOString?.() ?? null,
  }));

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${junior.name} — ${junior.title}`,
    description: junior.metaDescription || junior.excerpt || '',
    image: junior.featuredImage || undefined,
    datePublished: junior.publishDate?.toISOString?.(),
    author: { '@type': 'Organization', name: 'Dink Authority Magazine' },
    publisher: { '@type': 'Organization', name: 'Dink Authority Magazine' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JuniorDetailClient junior={serialized} related={serializedRelated} latestEdition={latestEdition} bannerData={bannerData} />
    </>
  );
}
