import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') ?? 'dinkauthoritymagazine.com';
  const siteUrl = `https://${host}`;
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          // New canonical section routes under /pickleball
          '/pickleball/', '/pickleball/news', '/pickleball/players', '/pickleball/tips', '/pickleball/magazine', '/pickleball/shop',
          // Individual article / edition / product detail routes (unchanged)
          '/news/', '/players/', '/tips/', '/magazine/', '/shop/',
          '/about', '/contact',
        ],
        disallow: ['/admin', '/admin/', '/api', '/api/', '/login', '/articles', '/articles/'],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/news-sitemap.xml`],
  };
}
