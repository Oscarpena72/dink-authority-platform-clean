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

  const serialized = {
    ...article,
    publishedAt: article?.publishedAt?.toISOString?.() ?? null,
    createdAt: article?.createdAt?.toISOString?.() ?? null,
    updatedAt: article?.updatedAt?.toISOString?.() ?? null,
  };

  return <ArticleFormClient article={serialized} />;
}
