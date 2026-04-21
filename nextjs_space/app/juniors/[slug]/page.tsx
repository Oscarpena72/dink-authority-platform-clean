export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { getArticlePath } from '@/lib/article-routes';

/**
 * /juniors/[slug] now redirects to /players/[slug] (the new canonical URL for junior players).
 */
export default async function JuniorSlugRedirect({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findFirst({
    where: { slug: params?.slug ?? '', status: 'published', category: 'juniors' },
    select: { slug: true, category: true },
  }).catch(() => null);

  if (article) {
    redirect(getArticlePath(article.slug, article.category));
  }

  return notFound();
}
