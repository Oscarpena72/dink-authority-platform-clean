export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CountryPageClient from './_components/country-page-client';

const VALID_SLUGS = ['colombia', 'canada', 'mexico'];

export async function generateMetadata({ params }: { params: { countrySlug: string } }): Promise<Metadata> {
  if (!VALID_SLUGS.includes(params.countrySlug)) return {};
  const country = await prisma.country.findUnique({ where: { slug: params.countrySlug } }).catch(() => null);
  if (!country) return {};
  const siteUrl = process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com';
  return {
    title: country.metaTitle || `Dink Authority ${country.name} | Pickleball News and Community`,
    description: country.metaDescription || `The latest pickleball news, pro players, tips, and community content for ${country.name}.`,
    openGraph: {
      title: country.metaTitle || `Dink Authority ${country.name}`,
      description: country.metaDescription || `Pickleball news and community for ${country.name}`,
      url: `${siteUrl}/${country.slug}`,
      images: country.ogImage ? [{ url: country.ogImage, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    alternates: { canonical: `${siteUrl}/${country.slug}` },
  };
}

// Helper to resolve content paths to actual DB records
async function resolveContentPaths(paths: string[]): Promise<any[]> {
  const results: any[] = [];
  for (const path of paths) {
    try {
      const parts = path.replace(/^\//, '').split('/');
      if (parts.length < 2) continue;
      const [type, slug] = parts;
      // All content types now resolve from the unified Article table
      if (type === 'articles' || type === 'tips' || type === 'juniors') {
        const a = await prisma.article.findFirst({ where: { slug, status: 'published' }, select: { id: true, title: true, slug: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, excerpt: true, publishedAt: true, authorName: true } });
        const catPrefix: Record<string, string> = { news: 'news', editorial: 'news', events: 'news', places: 'news', 'pro-players': 'players', enthusiasts: 'players', juniors: 'players', tips: 'tips' };
        if (a) results.push({ ...a, type: 'article', path: `/${catPrefix[a.category] || 'news'}/${a.slug}`, publishedAt: a.publishedAt?.toISOString() ?? null });
      }
    } catch { /* skip broken refs */ }
  }
  return results;
}

export default async function CountryPage({ params }: { params: { countrySlug: string } }) {
  if (!VALID_SLUGS.includes(params.countrySlug)) notFound();

  const country = await prisma.country.findUnique({ where: { slug: params.countrySlug } }).catch(() => null);
  if (!country || !country.isActive) notFound();

  const parseJSON = (s: string | null | undefined): string[] => {
    try { return JSON.parse(s ?? '[]'); } catch { return []; }
  };

  // Resolve all content boxes in parallel
  const [newsItems, proItems, enthItems, juniorItems, tipItems] = await Promise.all([
    resolveContentPaths(parseJSON(country.newsBox)),
    resolveContentPaths(parseJSON(country.proPlayersBox)),
    resolveContentPaths(parseJSON(country.enthusiastsBox)),
    resolveContentPaths(parseJSON(country.juniorsBox)),
    resolveContentPaths(parseJSON(country.tipsBox)),
  ]);

  // Fetch shared global data (same as homepage)
  let featuredArticles: any[] = [];
  let events: any[] = [];
  let results: any[] = [];

  try {
    featuredArticles = await prisma.article.findMany({
      where: { isFeatured: true, status: 'published', isHeroStory: false },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, authorName: true },
    });
  } catch { /* empty */ }

  try {
    events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'asc' },
      take: 3,
      select: { id: true, name: true, location: true, startDate: true, endDate: true, externalUrl: true },
    });
  } catch { /* empty */ }

  try {
    results = await prisma.tournamentResult.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
      take: 6,
      select: { id: true, tournamentName: true, division: true, winner: true, runnerUp: true, score: true, location: true, date: true, externalUrl: true },
    });
  } catch { /* empty */ }

  // Fetch current magazine edition for this country from MagazineEdition table
  let currentEdition: any = null;
  try {
    const allEditions = await prisma.magazineEdition.findMany({
      orderBy: { publishDate: 'desc' },
      select: { id: true, title: true, slug: true, coverUrl: true, pdfUrl: true, pdfCloudPath: true, externalUrl: true, currentFor: true, publishDate: true },
    });
    // Find edition where currentFor includes this country slug
    currentEdition = allEditions.find((ed: any) => {
      try { return JSON.parse(ed.currentFor || '[]').includes(params.countrySlug); } catch { return false; }
    });
    // Fallback: find any edition whose countries includes this slug
    if (!currentEdition) {
      const countryEditions = await prisma.magazineEdition.findMany({
        orderBy: { publishDate: 'desc' },
        take: 1,
      });
      currentEdition = countryEditions.find((ed: any) => {
        try { return JSON.parse(ed.countries || '[]').includes(params.countrySlug); } catch { return false; }
      }) ?? null;
    }
  } catch { /* empty */ }

  const socialMedia = (() => { try { return JSON.parse(country.socialMedia ?? '{}'); } catch { return {}; } })();

  // Build magazine info: prefer MagazineEdition data, fallback to Country model fields
  const magazineCover = currentEdition?.coverUrl || country.magazineCover;
  const magazineTitle = currentEdition?.title || country.magazineTitle;
  const magazineLink = currentEdition?.slug && currentEdition?.pdfCloudPath
    ? `/magazine/${currentEdition.slug}`
    : currentEdition?.externalUrl || country.magazineLink;
  const magazinePdfUrl = currentEdition?.pdfUrl || country.magazinePdfUrl;

  return (
    <CountryPageClient
      country={{
        name: country.name,
        slug: country.slug,
        flagEmoji: country.flagEmoji,
        magazineCover,
        magazineTitle,
        magazineLink,
        magazinePdfUrl,
        bannerTopImage: country.bannerTopImage,
        bannerTopLink: country.bannerTopLink,
        bannerMidImage: country.bannerMidImage,
        bannerMidLink: country.bannerMidLink,
        bannerBottomImage: country.bannerBottomImage,
        bannerBottomLink: country.bannerBottomLink,
        stickyBannerImage: country.stickyBannerImage,
        stickyBannerMobileImage: country.stickyBannerMobileImage,
        stickyBannerLink: country.stickyBannerLink,
        socialMedia,
      }}
      newsItems={newsItems}
      proItems={proItems}
      enthItems={enthItems}
      juniorItems={juniorItems}
      tipItems={tipItems}
      featuredArticles={(featuredArticles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null }))}
      events={(events ?? []).map((e: any) => ({ ...(e ?? {}), startDate: e?.startDate?.toISOString?.() ?? null, endDate: e?.endDate?.toISOString?.() ?? null }))}
      results={(results ?? []).map((r: any) => ({ ...(r ?? {}), date: r?.date?.toISOString?.() ?? null }))}
    />
  );
}
