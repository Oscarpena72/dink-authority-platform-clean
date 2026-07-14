import { prisma } from '@/lib/db';
import type { Locale } from '@/lib/i18n/translations';

/**
 * Server-side data loader for the localized home pages (/es, /pt).
 *
 * Editions are associated to a locale through the existing MagazineEdition
 * mechanism (the same one Colombia/Mexico/Canada used):
 *   - `countries`  -> which sites the edition appears on (e.g. ["es"])
 *   - `currentFor` -> which sites show it as their "current" edition (e.g. ["es"])
 *
 * This lets the admin upload + manage the cover/PDF of each Spanish or
 * Portuguese edition and have it show up automatically on /es or /pt.
 */

function parseJsonArray(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value ?? '[]');
    return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
  } catch {
    return [];
  }
}

export interface LocaleEdition {
  id: string;
  title: string;
  slug: string | null;
  issueNumber: string | null;
  coverUrl: string | null;
  description: string | null;
  pdfCloudPath: string | null;
  externalUrl: string | null;
  publishDate: string | null;
}

export interface LocaleHomeData {
  currentEdition: LocaleEdition | null;
  pastEditions: LocaleEdition[];
  featuredArticles: any[];
  events: any[];
  results: any[];
  settings: Record<string, string>;
}

function serializeEdition(ed: any): LocaleEdition {
  return {
    id: ed?.id,
    title: ed?.title ?? '',
    slug: ed?.slug ?? null,
    issueNumber: ed?.issueNumber ?? null,
    coverUrl: ed?.coverUrl ?? null,
    description: ed?.description ?? null,
    pdfCloudPath: ed?.pdfCloudPath ?? null,
    externalUrl: ed?.externalUrl ?? null,
    publishDate: ed?.publishDate?.toISOString?.() ?? null,
  };
}

export async function getLocaleHomeData(locale: Locale): Promise<LocaleHomeData> {
  let currentEdition: LocaleEdition | null = null;
  let pastEditions: LocaleEdition[] = [];
  let featuredArticles: any[] = [];
  let events: any[] = [];
  let results: any[] = [];
  const settings: Record<string, string> = {};

  // ── Editions for this locale ──
  try {
    const allEditions = await prisma.magazineEdition.findMany({
      orderBy: { publishDate: 'desc' },
      select: {
        id: true, title: true, slug: true, issueNumber: true, coverUrl: true,
        description: true, pdfCloudPath: true, externalUrl: true, publishDate: true,
        isCurrent: true, countries: true, currentFor: true,
      },
    });

    // Editions that belong to this locale site
    const localeEditions = (allEditions ?? []).filter((ed: any) =>
      parseJsonArray(ed?.countries).includes(locale),
    );

    // Current edition: first one flagged currentFor this locale, else newest locale edition
    const flaggedCurrent = localeEditions.find((ed: any) =>
      parseJsonArray(ed?.currentFor).includes(locale),
    );
    const resolvedCurrent = flaggedCurrent ?? localeEditions[0] ?? null;

    if (resolvedCurrent) currentEdition = serializeEdition(resolvedCurrent);

    pastEditions = localeEditions
      .filter((ed: any) => ed?.id !== resolvedCurrent?.id)
      .slice(0, 3)
      .map(serializeEdition);
  } catch { /* empty */ }

  // ── Featured articles in this locale ──
  try {
    const rows = await prisma.article.findMany({
      where: { isFeatured: true, status: 'published', locale, isHeroStory: false },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, authorName: true, publishedAt: true },
    });
    featuredArticles = (rows ?? []).map((a: any) => ({ ...a, publishedAt: a?.publishedAt?.toISOString?.() ?? null }));
  } catch { /* empty */ }

  // ── Global events (not locale-specific) ──
  try {
    const rows = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'asc' },
      take: 3,
      select: { id: true, name: true, location: true, startDate: true, endDate: true, externalUrl: true },
    });
    events = (rows ?? []).map((e: any) => ({ ...e, startDate: e?.startDate?.toISOString?.() ?? null, endDate: e?.endDate?.toISOString?.() ?? null }));
  } catch { /* empty */ }

  // ── Global tournament results (not locale-specific) ──
  try {
    const rows = await prisma.tournamentResult.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
      take: 6,
      select: { id: true, tournamentName: true, division: true, winner: true, runnerUp: true, score: true, location: true, date: true, externalUrl: true },
    });
    results = (rows ?? []).map((r: any) => ({ ...r, date: r?.date?.toISOString?.() ?? null }));
  } catch { /* empty */ }

  // ── Site settings (whatsapp / sticky banner) ──
  try {
    const allSettings = await prisma.siteSetting.findMany();
    for (const s of allSettings ?? []) settings[s?.key ?? ''] = s?.value ?? '';
  } catch { /* empty */ }

  return { currentEdition, pastEditions, featuredArticles, events, results, settings };
}
