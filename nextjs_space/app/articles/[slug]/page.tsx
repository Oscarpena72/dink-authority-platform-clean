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

  try {
    relatedArticles = await prisma.article.findMany({
      where: { status: 'published', category: article?.category, id: { not: article?.id } },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, publishedAt: true },
    });
  } catch { /* empty */ }

  // Fetch sidebar data: current magazine edition + settings for slots 2/3
  try {
    const [currentEdition, settingsRows] = await Promise.all([
      prisma.magazineEdition.findFirst({
        where: { isCurrent: true },
        select: { title: true, coverUrl: true, slug: true, externalUrl: true },
      }).catch(() => null),
      prisma.siteSetting.findMany({
        where: { key: { startsWith: 'sidebar_slot' } },
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
  } catch { /* empty */ }

  const serialized = {
    ...article,
    publishedAt: article?.publishedAt?.toISOString?.() ?? null,
    createdAt: article?.createdAt?.toISOString?.() ?? null,
    updatedAt: article?.updatedAt?.toISOString?.() ?? null,
  };
  const relSerialized = (relatedArticles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null }));

  return <ArticleDetailClient article={serialized} relatedArticles={relSerialized} sidebarData={sidebarData} />;
}
