export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

export default async function JuniorSlugRedirect({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findFirst({
    where: { slug: params?.slug ?? '', status: 'published', category: 'juniors' },
    select: { slug: true },
  }).catch(() => null);

  if (article) {
    redirect(`/articles/${article.slug}`);
  }

  return notFound();
}
