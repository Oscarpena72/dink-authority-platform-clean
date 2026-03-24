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
  return {
    title: `${edition.title} | Dink Authority Magazine`,
    description: edition.description ?? `Read ${edition.title} - Dink Authority Magazine`,
    openGraph: {
      title: edition.title,
      description: edition.description ?? '',
      images: edition.coverUrl ? [edition.coverUrl] : [],
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
