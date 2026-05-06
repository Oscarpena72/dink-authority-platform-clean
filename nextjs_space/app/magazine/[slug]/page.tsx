import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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

  /* ---------- Build first-paragraph fallback if no seoContent ---------- */
  const athlete = edition.coverAthlete || edition.title.split('–')[0]?.trim() || 'Featured Edition';
  const firstParagraph = `Check out the ${dateStr} issue of Dink Authority, a leading pickleball magazine featuring ${athlete}, highlighting the biggest players, tournaments, and stories in the sport.`;

  return (
    <>
      {/* ===== SERVER-RENDERED SEO — sr-only for crawlers, single visual header lives in client ===== */}
      <h1 className="sr-only">{serialized.seoH1}</h1>
      <p className="sr-only">{firstParagraph}</p>

      {/* ===== VIEWER — client-side with single visual header ===== */}
      <MagazineViewerClient edition={serialized} />

      {/* ===== SERVER-RENDERED SEO CONTENT BELOW VIEWER ===== */}
      {edition.seoContent && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-[900px] mx-auto px-4 py-10 md:py-14">
            <div
              className="prose prose-sm md:prose-base prose-gray max-w-none text-gray-600 leading-relaxed [&>p]:mb-4 [&>p:first-child]:text-base [&>p:first-child]:font-medium [&>p:first-child]:text-gray-700"
              dangerouslySetInnerHTML={{ __html: edition.seoContent }}
            />
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-4">
              <Link href="/magazine" className="text-brand-purple font-medium text-sm hover:text-brand-purple-light transition-colors">
                ← Browse all editions of our <span className="underline">pickleball magazine</span>
              </Link>
              <span className="text-gray-300 hidden md:inline">|</span>
              <Link href="/magazine" className="text-brand-purple/70 text-sm hover:text-brand-purple transition-colors">
                Dink Authority — a <span className="underline">leading pickleball magazine</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
