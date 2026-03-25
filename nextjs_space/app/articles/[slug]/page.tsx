export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ArticleDetailClient from './_components/article-detail-client';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params?.slug ?? '' },
    select: { title: true, excerpt: true, imageUrl: true },
  }).catch(() => null);

  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app';
  const articleUrl = `${siteUrl}/articles/${params?.slug ?? ''}`;

  return {
    title: article?.title ? `${article.title} | Dink Authority Magazine` : 'Article | Dink Authority Magazine',
    description: article?.excerpt ?? 'Read the latest pickleball news on Dink Authority Magazine.',
    openGraph: {
      title: article?.title ?? 'Dink Authority Magazine',
      description: article?.excerpt ?? '',
      type: 'article',
      url: articleUrl,
      siteName: 'Dink Authority Magazine',
      images: article?.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630, alt: article?.title ?? 'Dink Authority Magazine' }] : ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article?.title ?? 'Dink Authority Magazine',
      description: article?.excerpt ?? '',
      images: article?.imageUrl ? [article.imageUrl] : ['/og-image.png'],
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  let article: any = null;
  let relatedArticles: any[] = [];
  let sidebarData: any = { currentEdition: null, slot2: null, slot3: null };

  try {
    article = await prisma.article.findUnique({
      where: { slug: params?.slug ?? '', status: 'published' },
    });
  } catch { /* empty */ }

  if (!article) return notFound();

  // Recommended articles: same category first, then fill with recent from other categories
  try {
    const selectFields = { id: true, title: true, slug: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, publishedAt: true };
    const sameCat = await prisma.article.findMany({
      where: { status: 'published', category: article?.category, id: { not: article?.id } },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: selectFields,
    }).catch(() => []);
    if ((sameCat?.length ?? 0) < 3) {
      const existingIds = [article?.id, ...(sameCat ?? []).map((a: any) => a?.id)].filter(Boolean);
      const filler = await prisma.article.findMany({
        where: { status: 'published', id: { notIn: existingIds } },
        take: 3 - (sameCat?.length ?? 0),
        orderBy: { publishedAt: 'desc' },
        select: selectFields,
      }).catch(() => []);
      relatedArticles = [...(sameCat ?? []), ...(filler ?? [])];
    } else {
      relatedArticles = sameCat ?? [];
    }
  } catch { /* empty */ }

  // Fetch sidebar + sticky banner data
  let bannerData: any = null;
  try {
    const [currentEdition, settingsRows] = await Promise.all([
      prisma.magazineEdition.findFirst({
        where: { isCurrent: true },
        select: { title: true, coverUrl: true, slug: true, externalUrl: true },
      }).catch(() => null),
      prisma.siteSetting.findMany({
        where: { key: { in: [
          'sidebar_slot2_enabled', 'sidebar_slot2_image', 'sidebar_slot2_link', 'sidebar_slot2_label', 'sidebar_slot2_newtab',
          'sidebar_slot3_enabled', 'sidebar_slot3_image', 'sidebar_slot3_link', 'sidebar_slot3_label', 'sidebar_slot3_newtab',
          'sticky_banner_active', 'sticky_banner_image_desktop', 'sticky_banner_image_mobile',
          'sticky_banner_link', 'sticky_banner_newtab', 'sticky_banner_close_enabled',
        ] } },
      }).catch(() => []),
    ]);

    const s: Record<string, string> = {};
    for (const row of settingsRows ?? []) { s[row?.key ?? ''] = row?.value ?? ''; }

    sidebarData = {
      currentEdition: currentEdition ? {
        title: currentEdition.title ?? '',
        coverUrl: currentEdition.coverUrl ?? '',
        link: currentEdition.slug ? `/magazine/${currentEdition.slug}` : (currentEdition.externalUrl ?? ''),
      } : null,
      slot2: s.sidebar_slot2_enabled === 'true' && s.sidebar_slot2_image ? {
        image: s.sidebar_slot2_image, link: s.sidebar_slot2_link ?? '', label: s.sidebar_slot2_label ?? '', newTab: s.sidebar_slot2_newtab === 'true',
      } : null,
      slot3: s.sidebar_slot3_enabled === 'true' && s.sidebar_slot3_image ? {
        image: s.sidebar_slot3_image, link: s.sidebar_slot3_link ?? '', label: s.sidebar_slot3_label ?? '', newTab: s.sidebar_slot3_newtab === 'true',
      } : null,
    };

    if (s.sticky_banner_active === 'true' && (s.sticky_banner_image_desktop || s.sticky_banner_image_mobile)) {
      bannerData = {
        desktopImage: s.sticky_banner_image_desktop ?? '',
        mobileImage: s.sticky_banner_image_mobile ?? '',
        link: s.sticky_banner_link ?? '',
        newTab: s.sticky_banner_newtab === 'true',
        closeEnabled: s.sticky_banner_close_enabled !== 'false',
      };
    }
  } catch { /* empty */ }

  const serialized = {
    ...article,
    publishedAt: article?.publishedAt?.toISOString?.() ?? null,
    createdAt: article?.createdAt?.toISOString?.() ?? null,
    updatedAt: article?.updatedAt?.toISOString?.() ?? null,
  };
  const relSerialized = (relatedArticles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null }));

  return <ArticleDetailClient article={serialized} relatedArticles={relSerialized} sidebarData={sidebarData} bannerData={bannerData} />;
}
