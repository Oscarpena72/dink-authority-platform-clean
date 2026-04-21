export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { getArticlePath } from '@/lib/article-routes';

/**
 * Legacy /articles/[slug] route.
 * Redirects to the new canonical URL (/news/, /players/, /tips/).
 * The middleware handles most redirects, but this is a fallback for any edge cases.
 */
export default async function ArticleDetailRedirect({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params?.slug ?? '' },
    select: { slug: true, category: true },
  }).catch(() => null);

  if (article) {
    redirect(getArticlePath(article.slug, article.category));
  }

  return notFound();
}
