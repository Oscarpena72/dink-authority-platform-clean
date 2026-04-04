export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

export default async function TipSlugRedirect({ params }: { params: { slug: string } }) {
  // All tips content now lives in Articles with category='tips'
  // Redirect old /tips/[slug] URLs to /articles/[slug]
  const article = await prisma.article.findFirst({
    where: { slug: params?.slug ?? '', status: 'published', category: 'tips' },
    select: { slug: true },
  }).catch(() => null);

  if (article) {
    redirect(`/articles/${article.slug}`);
  }

  return notFound();
}
