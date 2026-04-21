export const dynamic = "force-dynamic";
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { getArticlePath } from '@/lib/article-routes';

export async function GET() {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') ?? 'dinkauthoritymagazine.com';
  const siteUrl = `https://${host}`;

  // Google News sitemap: only articles published in last 48 hours
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: {
        status: 'published',
        publishedAt: { gte: cutoff },
      },
      select: {
        slug: true,
        title: true,
        category: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  } catch {
    articles = [];
  }

  const entries = (articles ?? []).map((a: any) => {
    const pubDate = a?.publishedAt ? new Date(a.publishedAt).toISOString() : new Date().toISOString();
    return `  <url>
    <loc>${siteUrl}${getArticlePath(a?.slug ?? '', a?.category ?? 'news')}</loc>
    <news:news>
      <news:publication>
        <news:name>Dink Authority Magazine</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(a?.title ?? '')}</news:title>
    </news:news>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
