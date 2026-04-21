import { prisma } from '@/lib/db';
import { getArticlePath, getCategoryPrefix as getCategoryPrefixFn, SECTION_CATEGORIES } from '@/lib/article-routes';

/**
 * Shared data-fetching logic for article detail pages across /news/, /players/, /tips/ routes.
 * Returns all data needed to render an article detail page, or null if not found.
 */
export async function getArticlePageData(slug: string, sectionCategories: string[]) {
  const siteUrl = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');

  let article: any = null;
  try {
    article = await prisma.article.findUnique({
      where: { slug: slug ?? '', status: 'published' },
    });
  } catch { /* empty */ }

  if (!article) return null;

  // Verify article belongs to this section
  if (sectionCategories.length > 0 && !sectionCategories.includes(article.category)) {
    return null;
  }

  const articlePath = getArticlePath(article.slug, article.category);
  const articleUrl = `${siteUrl}${articlePath}`;

  // Recommended articles
  let relatedArticles: any[] = [];
  try {
    const selectFields = { id: true, title: true, slug: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, publishedAt: true };
    const sameCat = await prisma.article.findMany({
      where: { status: 'published', category: article.category, id: { not: article.id } },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: selectFields,
    }).catch(() => []);
    if ((sameCat?.length ?? 0) < 3) {
      const existingIds = [article.id, ...(sameCat ?? []).map((a: any) => a?.id)].filter(Boolean);
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

  // Sidebar + sticky banner
  let sidebarData: any = { currentEdition: null, slot2: null, slot3: null };
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

  return { article, serialized, relSerialized, sidebarData, bannerData, articleUrl, articlePath, siteUrl };
}

/** Build metadata for an article detail page */
export function buildArticleMetadata(article: any, articleUrl: string, siteUrl: string, slug: string) {
  const ogTitle = article?.metaTitle || article?.title || 'Dink Authority Magazine';
  const pageTitle = article?.metaTitle || (article?.title ? `${article.title} | Dink Authority Magazine` : 'Article | Dink Authority Magazine');

  let ogDescription = article?.metaDescription || article?.excerpt || '';
  if (!ogDescription && article?.content) {
    const textMatch = article.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    ogDescription = textMatch.length > 200 ? textMatch.substring(0, 197) + '...' : textMatch;
  }
  if (!ogDescription) ogDescription = 'Read the latest pickleball news on Dink Authority Magazine.';

  const hasArticleImage = !!article?.imageUrl;
  const absoluteImageUrl = hasArticleImage
    ? `${siteUrl}/api/og-image?slug=${encodeURIComponent(slug)}`
    : `${siteUrl}/og-image.png`;
  const directImageUrl = hasArticleImage
    ? (article!.imageUrl!.startsWith('http') ? article!.imageUrl! : `${siteUrl}${article!.imageUrl}`)
    : `${siteUrl}/og-image.png`;

  return {
    title: pageTitle,
    description: ogDescription,
    alternates: { canonical: articleUrl },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large' as any,
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: articleUrl,
      siteName: 'Dink Authority Magazine',
      locale: 'en_US',
      images: [{ url: absoluteImageUrl, width: 1200, height: 630, alt: article?.title ?? 'Dink Authority Magazine', type: 'image/jpeg' }],
      ...(article?.publishedAt ? { publishedTime: new Date(article.publishedAt).toISOString() } : {}),
      ...(article?.updatedAt ? { modifiedTime: new Date(article.updatedAt).toISOString() } : {}),
      authors: [article?.authorName || 'Dink Authority Editorial Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [{ url: directImageUrl, width: 1200, height: 630, alt: article?.title ?? 'Dink Authority Magazine' }],
      site: '@DinkAuthority',
    },
  };
}

/** Build JSON-LD structured data for article pages */
export function buildArticleJsonLd(article: any, articleUrl: string, siteUrl: string) {
  const authorName = article?.authorName || 'Dink Authority Editorial Team';

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article?.title ?? '',
    description: article?.excerpt ?? '',
    image: article?.imageUrl
      ? [{ '@type': 'ImageObject', url: article.imageUrl, width: 1200, height: 630 }]
      : [],
    author: { '@type': 'Person', name: authorName, url: `${siteUrl}/news` },
    publisher: {
      '@type': 'Organization',
      name: 'Dink Authority Magazine',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512x512.png`, width: 512, height: 512 },
      sameAs: [],
    },
    datePublished: article?.publishedAt?.toISOString?.() ?? '',
    dateModified: article?.updatedAt?.toISOString?.() ?? article?.publishedAt?.toISOString?.() ?? '',
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    url: articleUrl,
    isAccessibleForFree: true,
  };

  // Determine breadcrumb section name
  const prefix = getCategoryPrefixFn(article?.category ?? 'news');
  const sectionName = prefix === 'players' ? 'Players' : prefix === 'tips' ? 'Tips' : 'News';

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: sectionName, item: `${siteUrl}/${prefix}` },
      { '@type': 'ListItem', position: 3, name: article?.title ?? '', item: articleUrl },
    ],
  };

  return { jsonLdArticle, jsonLdBreadcrumb };
}
