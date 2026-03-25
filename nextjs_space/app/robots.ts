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
        allow: ['/', '/articles', '/articles/', '/magazine', '/magazine/', '/about', '/contact'],
        disallow: ['/admin', '/admin/', '/api', '/api/', '/login'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
