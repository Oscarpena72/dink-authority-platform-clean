export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { getArticlePageData, buildArticleMetadata, buildArticleJsonLd } from '@/lib/article-page-data';
import { SECTION_CATEGORIES } from '@/lib/article-routes';
import ArticleDetailClient from '@/app/articles/[slug]/_components/article-detail-client';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getArticlePath } from '@/lib/article-routes';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const siteUrl = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');
  const article = await prisma.article.findUnique({
    where: { slug: params?.slug ?? '' },
    select: { title: true, excerpt: true, content: true, imageUrl: true, authorName: true, publishedAt: true, updatedAt: true, category: true, metaTitle: true, metaDescription: true },
  }).catch(() => null);
  if (!article) return { title: 'Article Not Found | Dink Authority Magazine' };
  const articleUrl = `${siteUrl}${getArticlePath(params?.slug ?? '', article.category)}`;
  return buildArticleMetadata(article, articleUrl, siteUrl, params?.slug ?? '') as any;
}

export default async function PlayersArticlePage({ params }: { params: { slug: string } }) {
  const data = await getArticlePageData(params?.slug ?? '', SECTION_CATEGORIES.players);
  if (!data) return notFound();
  const { serialized, relSerialized, sidebarData, bannerData, articleUrl, siteUrl } = data;
  const { jsonLdArticle, jsonLdBreadcrumb } = buildArticleJsonLd(data.article, articleUrl, siteUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <ArticleDetailClient article={serialized} relatedArticles={relSerialized} sidebarData={sidebarData} bannerData={bannerData} articleUrl={articleUrl} />
    </>
  );
}
