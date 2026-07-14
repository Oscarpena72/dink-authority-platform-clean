import { prisma } from '@/lib/db';
import { SECTION_CATEGORIES } from '@/lib/article-routes';

const LIST_SELECT = {
  id: true, title: true, slug: true, excerpt: true, imageUrl: true,
  focalPointX: true, focalPointY: true, category: true, publishedAt: true, authorName: true,
};

/**
 * Shared fetcher for the paginated section listing pages (news, players).
 * Used by both the English routes and the /es, /pt localized routes.
 */
export async function getPaginatedSectionData(
  sectionKey: 'news' | 'players',
  searchParams: { q?: string; category?: string; page?: string } | undefined,
  locale: string = 'en',
) {
  const query = searchParams?.q ?? '';
  const subCategory = searchParams?.category ?? '';
  const page = parseInt(searchParams?.page ?? '1', 10);
  const perPage = 9;
  const skip = ((page > 0 ? page : 1) - 1) * perPage;

  const categories = SECTION_CATEGORIES[sectionKey];
  const where: any = { status: 'published', locale, category: { in: categories } };
  if (subCategory && categories.includes(subCategory)) {
    where.category = subCategory;
  }
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
    ];
  }

  let articles: any[] = [];
  let total = 0;
  try {
    [articles, total] = await Promise.all([
      prisma.article.findMany({ where, orderBy: { publishedAt: 'desc' }, skip, take: perPage, select: LIST_SELECT }),
      prisma.article.count({ where }),
    ]);
  } catch { /* empty */ }

  const serialized = (articles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null }));
  const totalPages = Math.ceil((total ?? 0) / perPage);
  return { serialized, page, totalPages, query, subCategory };
}

/**
 * Shared fetcher for the tips listing page (grid + sticky banner).
 * Used by both the English route and the /es, /pt localized routes.
 */
export async function getTipsPageData(locale: string = 'en') {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { status: 'published', locale, category: 'tips' },
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
  } catch { /* empty */ }

  const serialized = (articles ?? []).map((a: any) => ({
    ...(a ?? {}),
    publishedAt: a?.publishedAt?.toISOString?.() ?? null,
    createdAt: a?.createdAt?.toISOString?.() ?? null,
    updatedAt: a?.updatedAt?.toISOString?.() ?? null,
  }));

  return { serialized, bannerData };
}
