export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import AdminDashboardClient from './_components/admin-dashboard-client';

export default async function AdminDashboardPage() {
  let stats = { articles: 0, published: 0, drafts: 0, subscribers: 0, events: 0, contacts: 0 };
  try {
    const [articles, published, drafts, subscribers, events, contacts] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'published' } }),
      prisma.article.count({ where: { status: 'draft' } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.event.count({ where: { isActive: true } }),
      prisma.contactSubmission.count(),
    ]);
    stats = { articles, published, drafts, subscribers, events, contacts };
  } catch { /* empty */ }

  let recentArticles: any[] = [];
  try {
    recentArticles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, status: true, createdAt: true } });
  } catch { /* empty */ }
  const serialized = (recentArticles ?? []).map((a: any) => ({ ...(a ?? {}), createdAt: a?.createdAt?.toISOString?.() ?? null }));

  return <AdminDashboardClient stats={stats} recentArticles={serialized} />;
}
