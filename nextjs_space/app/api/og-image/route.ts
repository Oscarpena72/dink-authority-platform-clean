export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import sharp from 'sharp';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * OG Image proxy endpoint — optimised for WhatsApp & social-media crawlers.
 *
 * Usage:  /api/og-image?slug=my-article-slug
 *
 * 1. Looks up the article's featured image in the DB.
 * 2. Downloads the original from S3.
 * 3. Resizes / crops it to exactly 1200 × 630 (landscape, centre-crop)
 *    using `sharp`.  This is critical because:
 *    - Many article images are **vertical / portrait** (e.g. 1545 × 2000).
 *    - WhatsApp rejects or ignores portrait images and falls back to the
 *      site-level og:image (the generic Dink logo).
 *    - The og:image:width / og:image:height tags already declare 1200 × 630,
 *      so the actual pixels must match.
 * 4. Serves the result with proper Content-Type and **without**
 *    Content-Disposition: attachment (which S3 sets on user uploads).
 *
 * The response is cached for 7 days to avoid hitting S3 + sharp on
 * every crawler request.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const siteUrl = (process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app').replace(/\/+$/, '');

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { imageUrl: true, focalPointX: true, focalPointY: true },
    });

    if (!article?.imageUrl) {
      return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
    }

    // Ensure absolute URL
    const imageUrl = article.imageUrl.startsWith('http')
      ? article.imageUrl
      : `${siteUrl}${article.imageUrl}`;

    // Fetch the original image from S3
    const imgResponse = await fetch(imageUrl, {
      headers: { 'Accept': 'image/*' },
    });

    if (!imgResponse.ok) {
      return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
    }

    const originalBuffer = Buffer.from(await imgResponse.arrayBuffer());

    // Use focal point from DB if available, otherwise centre
    const focalX = article.focalPointX ?? 50;
    const focalY = article.focalPointY ?? 50;

    // Resize + crop to 1200 × 630 using sharp
    // Strategy: cover (fill the 1200×630 box, crop the excess)
    // Position: use the article's focal-point percentage
    const resizedBuffer = await sharp(originalBuffer)
      .resize(OG_WIDTH, OG_HEIGHT, {
        fit: 'cover',
        position: focalPointToGravity(focalX, focalY),
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    return new NextResponse(resizedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(resizedBuffer.byteLength),
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('[og-image] Error:', error);
    const fallbackUrl = `${siteUrl}/og-image.png`;
    return NextResponse.redirect(fallbackUrl, 302);
  }
}

/**
 * Convert focal-point percentages (0-100) to a sharp gravity string.
 * sharp accepts: north, northeast, east, southeast, south, southwest, west, northwest, centre, entropy, attention
 * We map the focal-point into a 3×3 grid → one of the 9 compass positions.
 */
function focalPointToGravity(x: number, y: number): string {
  const col = x < 33 ? 'west' : x > 66 ? 'east' : '';
  const row = y < 33 ? 'north' : y > 66 ? 'south' : '';
  if (!col && !row) return 'centre';
  return `${row}${col}` || 'centre';
}