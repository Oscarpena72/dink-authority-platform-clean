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
  const siteUrl = process.env.NEXTAUTH_URL || 'https://dink-authority-magaz-nlc0mg.abacusai.app';
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
      if (type === 'articles') {
        const a = await prisma.article.findFirst({ where: { slug, status: 'published' }, select: { id: true, title: true, slug: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, excerpt: true, publishedAt: true, authorName: true } });
        if (a) results.push({ ...a, type: 'article', path, publishedAt: a.publishedAt?.toISOString() ?? null });
      } else if (type === 'tips') {
        const t = await prisma.tip.findFirst({ where: { slug, status: 'published' }, include: { author: { select: { name: true } } } });
        if (t) results.push({ ...t, type: 'tip', path, imageUrl: t.featuredImage, authorName: (t as any).author?.name, publishedAt: t.publishDate?.toISOString() ?? null });
      } else if (type === 'juniors') {
        const j = await prisma.junior.findFirst({ where: { slug, status: 'published' }, select: { id: true, name: true, title: true, slug: true, featuredImage: true, excerpt: true, country: true, publishDate: true } });
        if (j) results.push({ ...j, type: 'junior', path, imageUrl: j.featuredImage, authorName: j.country, publishedAt: j.publishDate?.toISOString() ?? null });
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

  const socialMedia = (() => { try { return JSON.parse(country.socialMedia ?? '{}'); } catch { return {}; } })();

  return (
    <CountryPageClient
      country={{
        name: country.name,
        slug: country.slug,
        flagEmoji: country.flagEmoji,
        magazineCover: country.magazineCover,
        magazineTitle: country.magazineTitle,
        magazineLink: country.magazineLink,
        magazinePdfUrl: country.magazinePdfUrl,
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
    />
  );
}
