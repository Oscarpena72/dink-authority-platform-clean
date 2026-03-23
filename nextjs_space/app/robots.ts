import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') ?? 'dinkauthoritymagazine.com';
  const protocol = 'https';
  const siteUrl = `${protocol}://${host}`;
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
