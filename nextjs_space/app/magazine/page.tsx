export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import type { Metadata } from 'next';
import MagazineArchiveClient from './_components/magazine-archive-client';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com';
  return {
    title: 'Magazine Archive | Dink Authority',
    description: 'Browse all editions of Dink Authority Magazine. Read the latest and past issues online.',
    openGraph: {
      title: 'Magazine Archive | Dink Authority',
      description: 'Browse all editions of Dink Authority Magazine.',
      url: `${siteUrl}/magazine`,
      type: 'website',
    },
    alternates: { canonical: `${siteUrl}/magazine` },
  };
}

export default async function MagazineArchivePage() {
  // Fetch all editions visible on "central"
  const allEditions = await prisma.magazineEdition.findMany({
    orderBy: { publishDate: 'desc' },
  });

  const editions = (allEditions ?? []).filter((e: any) => {
    try {
      const countries: string[] = JSON.parse(e.countries || '["central"]');
      return countries.includes('central');
    } catch { return true; }
  }).map((e: any) => ({
    ...e,
    publishDate: e.publishDate?.toISOString?.() ?? e.publishDate,
  }));

  // Fetch banner + hero settings
  const allSettings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          'magazine_banner_image',
          'magazine_banner_title',
          'magazine_banner_subtitle',
          'magazine_banner_button_text',
          'magazine_banner_button_link',
          'magazine_hero_headline',
          'magazine_hero_description',
          'magazine_hero_button_text',
          'magazine_hero_button_link',
          'magazine_hero_background_word',
          'magazine_hero_background_image',
          'magazine_hero_enabled',
        ],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  (allSettings ?? []).forEach((s: any) => { settingsMap[s.key] = s.value; });

  const banner = settingsMap.magazine_banner_image
    ? {
        image: settingsMap.magazine_banner_image || '',
        title: settingsMap.magazine_banner_title || '',
        subtitle: settingsMap.magazine_banner_subtitle || '',
        buttonText: settingsMap.magazine_banner_button_text || '',
        buttonLink: settingsMap.magazine_banner_button_link || '',
      }
    : null;

  const heroEnabled = (settingsMap.magazine_hero_enabled ?? 'true') === 'true';
  const hero = heroEnabled
    ? {
        headline: settingsMap.magazine_hero_headline || '',
        description: settingsMap.magazine_hero_description || '',
        buttonText: settingsMap.magazine_hero_button_text || '',
        buttonLink: settingsMap.magazine_hero_button_link || '',
        backgroundWord: settingsMap.magazine_hero_background_word || '',
        backgroundImage: settingsMap.magazine_hero_background_image || '',
      }
    : null;

  return <MagazineArchiveClient editions={editions} banner={banner} hero={hero} />;
}
