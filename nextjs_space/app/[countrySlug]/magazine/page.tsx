export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MagazineArchiveClient from '@/app/magazine/_components/magazine-archive-client';

const VALID_SLUGS = ['colombia', 'canada', 'mexico'];

export async function generateMetadata({ params }: { params: { countrySlug: string } }): Promise<Metadata> {
  if (!VALID_SLUGS.includes(params.countrySlug)) return {};
  const country = await prisma.country.findUnique({ where: { slug: params.countrySlug } }).catch(() => null);
  if (!country) return {};
  const siteUrl = process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com';
  return {
    title: `Magazine | Dink Authority ${country.name}`,
    description: `Browse all magazine editions for Dink Authority ${country.name}.`,
    openGraph: {
      title: `Magazine | Dink Authority ${country.name}`,
      description: `Magazine editions for Dink Authority ${country.name}`,
      url: `${siteUrl}/${country.slug}/magazine`,
      type: 'website',
    },
    alternates: { canonical: `${siteUrl}/${country.slug}/magazine` },
  };
}

export default async function CountryMagazinePage({ params }: { params: { countrySlug: string } }) {
  if (!VALID_SLUGS.includes(params.countrySlug)) notFound();

  const country = await prisma.country.findUnique({ where: { slug: params.countrySlug } });
  if (!country) notFound();

  // Fetch all editions and filter for this country
  const allEditions = await prisma.magazineEdition.findMany({
    orderBy: { publishDate: 'desc' },
  });

  const editions = (allEditions ?? []).filter((e: any) => {
    try {
      const countries: string[] = JSON.parse(e.countries || '[]');
      return countries.includes(params.countrySlug);
    } catch { return false; }
  }).map((e: any) => ({
    ...e,
    publishDate: e.publishDate?.toISOString?.() ?? e.publishDate,
  }));

  // Fetch banner settings (use central banner for now — could be per-country later)
  const bannerSettings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          'magazine_banner_image',
          'magazine_banner_title',
          'magazine_banner_subtitle',
          'magazine_banner_button_text',
          'magazine_banner_button_link',
        ],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  (bannerSettings ?? []).forEach((s: any) => { settingsMap[s.key] = s.value; });

  const banner = settingsMap.magazine_banner_image
    ? {
        image: settingsMap.magazine_banner_image || '',
        title: settingsMap.magazine_banner_title || '',
        subtitle: settingsMap.magazine_banner_subtitle || '',
        buttonText: settingsMap.magazine_banner_button_text || '',
        buttonLink: settingsMap.magazine_banner_button_link || '',
      }
    : null;

  return (
    <MagazineArchiveClient
      editions={editions}
      banner={banner}
      countryName={country.name}
      countrySlug={country.slug}
    />
  );
}
