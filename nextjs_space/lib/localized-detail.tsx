import { notFound } from 'next/navigation';
import { getArticlePageData, buildArticleMetadata, buildArticleJsonLd } from '@/lib/article-page-data';
import { SECTION_CATEGORIES, getLocaleArticlePath } from '@/lib/article-routes';
import ArticleDetailClient from '@/app/articles/[slug]/_components/article-detail-client';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/translations';
import { prisma } from '@/lib/db';

type SectionKey = 'news' | 'players' | 'tips';

/** Shared metadata builder for localized (/es, /pt) article detail routes. */
export async function buildLocalizedDetailMetadata(slug: string, sectionKey: SectionKey, locale: Locale): Promise<Metadata> {
  const siteUrl = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');
  const article = await prisma.article.findUnique({
    where: { slug: slug ?? '' },
    select: { title: true, excerpt: true, content: true, imageUrl: true, authorName: true, publishedAt: true, updatedAt: true, category: true, locale: true, metaTitle: true, metaDescription: true, ogTitle: true, ogDescription: true, noindex: true },
  }).catch(() => null);
  if (!article || (article.locale ?? 'en') !== locale) return { title: 'Article Not Found | Dink Authority Magazine' };
  const articleUrl = `${siteUrl}${getLocaleArticlePath(slug ?? '', article.category, locale)}`;
  return buildArticleMetadata(article, articleUrl, siteUrl, slug ?? '') as Metadata;
}

/** Shared server component for localized (/es, /pt) article detail routes. */
export async function LocalizedDetailPage({ slug, sectionKey, locale }: { slug: string; sectionKey: SectionKey; locale: Locale }) {
  const data = await getArticlePageData(slug ?? '', SECTION_CATEGORIES[sectionKey], locale);
  if (!data) return notFound();
  const { serialized, relSerialized, sidebarData, bannerData, articleUrl, siteUrl } = data;
  const { jsonLdArticle, jsonLdBreadcrumb } = buildArticleJsonLd(data.article, articleUrl, siteUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <ArticleDetailClient article={serialized} relatedArticles={relSerialized} sidebarData={sidebarData} bannerData={bannerData} articleUrl={articleUrl} pageLocale={locale} />
    </>
  );
}
