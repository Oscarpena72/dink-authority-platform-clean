export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import TipDetailClient from './_components/tip-detail-client';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let tip: any = null;
  try {
    tip = await prisma.tip.findFirst({ where: { slug: params?.slug ?? '', status: 'published' }, include: { author: true } });
  } catch {}
  if (!tip) return { title: 'Tip Not Found' };
  const title = tip.metaTitle || tip.title;
  const description = tip.metaDescription || tip.excerpt || '';
  return {
    title: `${title} | Dink Authority Magazine`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: tip.featuredImage ? [{ url: tip.featuredImage }] : [],
      publishedTime: tip.publishDate?.toISOString?.(),
      authors: tip.author?.name ? [tip.author.name] : [],
    },
  };
}

export default async function TipPage({ params }: { params: { slug: string } }) {
  let tip: any = null;
  try {
    tip = await prisma.tip.findFirst({ where: { slug: params?.slug ?? '', status: 'published' }, include: { author: true } });
  } catch {}
  if (!tip) return notFound();

  // Related tips (same category, different id)
  let related: any[] = [];
  try {
    related = await prisma.tip.findMany({
      where: { status: 'published', category: tip.category, id: { not: tip.id } },
      orderBy: { publishDate: 'desc' },
      take: 3,
      include: { author: { select: { name: true, photoUrl: true } } },
    });
  } catch {}

  const serialized = {
    ...tip,
    publishDate: tip?.publishDate?.toISOString?.() ?? null,
    createdAt: tip?.createdAt?.toISOString?.() ?? null,
    updatedAt: tip?.updatedAt?.toISOString?.() ?? null,
    author: tip?.author ? {
      ...tip.author,
      createdAt: tip.author?.createdAt?.toISOString?.() ?? null,
      updatedAt: tip.author?.updatedAt?.toISOString?.() ?? null,
    } : null,
  };

  const serializedRelated = (related ?? []).map((r: any) => ({
    ...r,
    publishDate: r?.publishDate?.toISOString?.() ?? null,
    createdAt: r?.createdAt?.toISOString?.() ?? null,
    updatedAt: r?.updatedAt?.toISOString?.() ?? null,
  }));

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tip.title,
    description: tip.metaDescription || tip.excerpt || '',
    image: tip.featuredImage || undefined,
    datePublished: tip.publishDate?.toISOString?.(),
    author: tip.author ? { '@type': 'Person', name: tip.author.name } : undefined,
    publisher: { '@type': 'Organization', name: 'Dink Authority Magazine' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TipDetailClient tip={serialized} related={serializedRelated} />
    </>
  );
}
