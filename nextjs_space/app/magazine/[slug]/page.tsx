import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import MagazineViewerClient from './_components/magazine-viewer-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

/** Build an SEO-optimized title: "Month Year Pickleball Magazine Issue – Cover Athlete | Dink Authority" */
function buildSeoTitle(edition: { publishDate: Date; coverAthlete: string | null; issueNumber: string | null; title: string }): string {
  const dateStr = edition.publishDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const athlete = edition.coverAthlete || edition.title.split('–')[0]?.trim() || 'Featured Edition';
  return `${dateStr} Pickleball Magazine Issue – ${athlete} | Dink Authority`;
}

/** Build SEO meta description */
function buildSeoDescription(edition: { publishDate: Date; coverAthlete: string | null; seoDescription: string | null; description: string | null; title: string }): string {
  if (edition.seoDescription) return edition.seoDescription;
  const dateStr = edition.publishDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const athlete = edition.coverAthlete || edition.title;
  return `Discover the ${dateStr} issue of Dink Authority, a leading pickleball magazine featuring ${athlete}, top players, tournaments, and global pickleball stories.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const edition = await prisma.magazineEdition.findFirst({ where: { slug: params.slug } });
  if (!edition) return { title: 'Pickleball Magazine – Dink Authority' };

  const siteUrl = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');
  const pageUrl = `${siteUrl}/magazine/${edition.slug}`;
  const ogImageUrl = edition.slug
    ? `${siteUrl}/api/og-image?type=magazine&slug=${encodeURIComponent(edition.slug)}`
    : (edition.coverUrl ?? `${siteUrl}/og-image.png`);

  const title = buildSeoTitle(edition);
  const description = buildSeoDescription(edition);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Dink Authority',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MagazineViewerPage({ params }: Props) {
  const edition = await prisma.magazineEdition.findFirst({ where: { slug: params.slug } });
  if (!edition) notFound();

  const dateStr = edition.publishDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const serialized = {
    id: edition.id,
    title: edition.title,
    slug: edition.slug ?? '',
    issueNumber: edition.issueNumber,
    coverUrl: edition.coverUrl,
    description: edition.description,
    pdfUrl: edition.pdfUrl,
    pdfCloudPath: edition.pdfCloudPath,
    pdfPageCount: edition.pdfPageCount,
    externalUrl: edition.externalUrl,
    isCurrent: edition.isCurrent,
    publishDate: edition.publishDate.toISOString(),
    coverAthlete: edition.coverAthlete,
    seoContent: edition.seoContent,
    seoH1: `${dateStr} Pickleball Magazine – ${edition.coverAthlete || edition.title.split('–')[0]?.trim() || 'Featured Edition'}`,
  };

  return <MagazineViewerClient edition={serialized} />;
}
