export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import HomePageClient from './_components/homepage-client';

export default async function HomePage() {
  let heroArticle: any = null;
  let latestArticles: any[] = [];
  let featuredArticles: any[] = [];
  let events: any[] = [];
  let results: any[] = [];
  let editions: any[] = [];
  let settings: Record<string, string> = {};

  try {
    heroArticle = await prisma.article.findFirst({
      where: { isHeroStory: true, status: 'published' },
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, authorName: true, publishedAt: true },
    });
  } catch { /* empty */ }

  try {
    latestArticles = await prisma.article.findMany({
      where: { status: 'published', isHeroStory: false },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      select: { id: true, title: true, slug: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, publishedAt: true, authorName: true },
    });
  } catch { /* empty */ }

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

  try {
    editions = await prisma.magazineEdition.findMany({
      orderBy: { publishDate: 'desc' },
      take: 4,
      select: { id: true, title: true, slug: true, issueNumber: true, coverUrl: true, description: true, externalUrl: true, pdfUrl: true, isCurrent: true, currentFor: true, publishDate: true },
    });
  } catch { /* empty */ }

  try {
    const allSettings = await prisma.siteSetting.findMany();
    for (const s of allSettings ?? []) {
      settings[s?.key ?? ''] = s?.value ?? '';
    }
  } catch { /* empty */ }

  // Build hero config from settings
  const heroConfig: Record<string, string> = {};
  const heroKeys = ['hero_mode', 'hero_image_url', 'hero_label', 'hero_title', 'hero_subtitle', 'hero_button_text', 'hero_button_url', 'hero_button2_text', 'hero_button2_url', 'hero_link_type', 'hero_article_id', 'hero_section_path', 'hero_magazine_id', 'hero_custom_url', 'hero_focal_x', 'hero_focal_y'];
  for (const k of heroKeys) {
    if (settings[k]) heroConfig[k] = settings[k];
  }

  const serialized = {
    heroArticle: heroArticle ? { ...heroArticle, publishedAt: heroArticle?.publishedAt?.toISOString?.() ?? null } : null,
    heroConfig,
    latestArticles: (latestArticles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null })),
    featuredArticles: (featuredArticles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null })),
    events: (events ?? []).map((e: any) => ({ ...(e ?? {}), startDate: e?.startDate?.toISOString?.() ?? null, endDate: e?.endDate?.toISOString?.() ?? null })),
    results: (results ?? []).map((r: any) => ({ ...(r ?? {}), date: r?.date?.toISOString?.() ?? null })),
    editions: (editions ?? []).map((ed: any) => ({ ...(ed ?? {}), publishDate: ed?.publishDate?.toISOString?.() ?? null })),
    settings,
  };

  return <HomePageClient data={serialized} />;
}
