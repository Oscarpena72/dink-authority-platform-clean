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
  return {
    title: article?.title ? `${article.title} | Dink Authority Magazine` : 'Article | Dink Authority Magazine',
    description: article?.excerpt ?? 'Read the latest pickleball news on Dink Authority Magazine.',
    openGraph: {
      title: article?.title ?? 'Dink Authority Magazine',
      description: article?.excerpt ?? '',
      images: article?.imageUrl ? [article.imageUrl] : ['/og-image.png'],
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  let article: any = null;
  let relatedArticles: any[] = [];
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
      select: { id: true, title: true, slug: true, imageUrl: true, category: true, publishedAt: true },
    });
  } catch { /* empty */ }

  const serialized = {
    ...article,
    publishedAt: article?.publishedAt?.toISOString?.() ?? null,
    createdAt: article?.createdAt?.toISOString?.() ?? null,
    updatedAt: article?.updatedAt?.toISOString?.() ?? null,
  };
  const relSerialized = (relatedArticles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null }));

  return <ArticleDetailClient article={serialized} relatedArticles={relSerialized} />;
}
