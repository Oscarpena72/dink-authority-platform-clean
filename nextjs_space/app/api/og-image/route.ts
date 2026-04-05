export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * OG Image proxy endpoint.
 *
 * Usage:  /api/og-image?slug=my-article-slug
 *
 * Fetches the article's featured image from S3 and streams it back with
 * proper Content-Type (image/jpeg, image/png, etc.) and WITHOUT the
 * Content-Disposition: attachment header that S3 sets on user-uploaded files.
 *
 * This is important because social media crawlers (WhatsApp in particular)
 * may reject images that are served with Content-Disposition: attachment.
 *
 * The response is cached for 7 days (with 1 hour stale-while-revalidate)
 * to avoid hitting S3 on every crawler request.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { imageUrl: true },
    });

    if (!article?.imageUrl) {
      // Redirect to default OG image
      const siteUrl = process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app';
      return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
    }

    // Ensure absolute URL
    const imageUrl = article.imageUrl.startsWith('http')
      ? article.imageUrl
      : `${process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app'}${article.imageUrl}`;

    // Fetch the image from S3
    const imgResponse = await fetch(imageUrl, {
      headers: { 'Accept': 'image/*' },
    });

    if (!imgResponse.ok) {
      const siteUrl = process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app';
      return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
    }

    const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imgResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(imageBuffer.byteLength),
        // Cache for 7 days, revalidate in background after 1 hour
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=3600',
        // No Content-Disposition header — serve inline for crawlers
      },
    });
  } catch (error) {
    console.error('[og-image] Error:', error);
    const siteUrl = process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app';
    return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
  }
}
