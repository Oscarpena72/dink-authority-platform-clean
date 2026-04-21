import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { getArticlePath } from '@/lib/article-routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') ?? 'dinkauthoritymagazine.com';
  const siteUrl = `https://${host}`;

  const [articles, editions] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'published' },
      select: { slug: true, category: true, updatedAt: true },
    }).catch(() => []),
    prisma.magazineEdition.findMany({
      select: { slug: true, updatedAt: true },
    }).catch(() => []),
  ]);

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/players`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/tips`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...(articles ?? []).map((a: any) => ({
      url: `${siteUrl}${getArticlePath(a?.slug ?? '', a?.category ?? 'news')}`,
      lastModified: a?.updatedAt ?? new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...(editions ?? []).map((e: any) => ({
      url: `${siteUrl}/magazine/${e?.slug ?? ''}`,
      lastModified: e?.updatedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
