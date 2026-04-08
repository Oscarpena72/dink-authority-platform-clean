import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import MagazineViewerClient from './_components/magazine-viewer-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const edition = await prisma.magazineEdition.findFirst({ where: { slug: params.slug } });
  if (!edition) return { title: 'Magazine - Dink Authority' };

  const siteUrl = (process.env.SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.dinkauthoritymagazine.com').replace(/\/+$/, '');
  const pageUrl = `${siteUrl}/magazine/${edition.slug}`;
  const ogImageUrl = edition.slug
    ? `${siteUrl}/api/og-image?type=magazine&slug=${encodeURIComponent(edition.slug)}`
    : (edition.coverUrl ?? `${siteUrl}/og-image.png`);
  const description = edition.description ?? `Read ${edition.title} - Dink Authority Magazine`;

  return {
    title: `${edition.title} | Dink Authority Magazine`,
    description,
    openGraph: {
      title: edition.title,
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
          alt: edition.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: edition.title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MagazineViewerPage({ params }: Props) {
  const edition = await prisma.magazineEdition.findFirst({ where: { slug: params.slug } });
  if (!edition) notFound();

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
  };

  return <MagazineViewerClient edition={serialized} />;
}
