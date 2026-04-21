export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import ArticlesPageClient from '@/app/articles/_components/articles-page-client';
import { SECTION_CATEGORIES } from '@/lib/article-routes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pickleball News | Dink Authority Magazine',
  description: 'The latest pickleball news, editorials, event coverage, and industry updates from Dink Authority Magazine.',
  openGraph: {
    title: 'Pickleball News | Dink Authority Magazine',
    description: 'The latest pickleball news, editorials, event coverage, and industry updates.',
    type: 'website',
  },
};

export default async function NewsPage({ searchParams }: { searchParams: { q?: string; category?: string; page?: string } }) {
  const query = searchParams?.q ?? '';
  const subCategory = searchParams?.category ?? '';
  const page = parseInt(searchParams?.page ?? '1', 10);
  const perPage = 9;
  const skip = ((page > 0 ? page : 1) - 1) * perPage;

  const categories = SECTION_CATEGORIES.news;
  let where: any = { status: 'published', category: { in: categories } };
  if (subCategory && categories.includes(subCategory)) {
    where.category = subCategory;
  }
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
    ];
  }

  let articles: any[] = [];
  let total = 0;
  try {
    [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: perPage,
        select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, focalPointX: true, focalPointY: true, category: true, publishedAt: true, authorName: true },
      }),
      prisma.article.count({ where }),
    ]);
  } catch { /* empty */ }

  const serialized = (articles ?? []).map((a: any) => ({ ...(a ?? {}), publishedAt: a?.publishedAt?.toISOString?.() ?? null }));
  const totalPages = Math.ceil((total ?? 0) / perPage);

  return <ArticlesPageClient articles={serialized} currentPage={page} totalPages={totalPages} query={query} category={subCategory} section="news" />;
}
