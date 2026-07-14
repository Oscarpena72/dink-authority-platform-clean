export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ArticleFormClient from '../../_components/article-form-client';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  let article: any = null;
  try {
    article = await prisma.article.findUnique({ where: { id: params?.id ?? '' } });
  } catch { /* empty */ }
  if (!article) return notFound();

  // Resolve the whole language family: the English base + all its translations.
  const baseId = article.translationOf ?? article.id;
  let versions: Record<string, { id: string; status: string; slug: string; locale: string }> = {};
  try {
    const family = await prisma.article.findMany({
      where: { OR: [{ id: baseId }, { translationOf: baseId }] },
      select: { id: true, locale: true, status: true, slug: true },
    });
    for (const v of family) {
      versions[v.locale ?? 'en'] = { id: v.id, status: v.status, slug: v.slug, locale: v.locale ?? 'en' };
    }
  } catch { /* empty */ }

  const serialized = {
    ...article,
    publishedAt: article?.publishedAt?.toISOString?.() ?? null,
    createdAt: article?.createdAt?.toISOString?.() ?? null,
    updatedAt: article?.updatedAt?.toISOString?.() ?? null,
  };

  return <ArticleFormClient article={serialized} versions={versions} baseId={baseId} />;
}
