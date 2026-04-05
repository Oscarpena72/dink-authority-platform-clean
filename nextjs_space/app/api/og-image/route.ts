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
  const type = request.nextUrl.searchParams.get('type') ?? 'article'; // 'article' | 'magazine'

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const siteUrl = (process.env.NEXTAUTH_URL ?? 'https://dink-authority-magaz-nlc0mg.abacusai.app').replace(/\/+$/, '');

  try {
    let rawImageUrl: string | null = null;
    let focalX = 50;
    let focalY = 50;

    if (type === 'magazine') {
      const edition = await prisma.magazineEdition.findFirst({
        where: { slug },
        select: { coverUrl: true },
      });
      rawImageUrl = edition?.coverUrl ?? null;
      // Magazine covers have no focal point — always centre crop
    } else {
      const article = await prisma.article.findUnique({
        where: { slug },
        select: { imageUrl: true, focalPointX: true, focalPointY: true },
      });
      rawImageUrl = article?.imageUrl ?? null;
      focalX = article?.focalPointX ?? 50;
      focalY = article?.focalPointY ?? 50;
    }

    if (!rawImageUrl) {
      return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
    }

    // Ensure absolute URL
    const imageUrl = rawImageUrl.startsWith('http')
      ? rawImageUrl
      : `${siteUrl}${rawImageUrl}`;

    // Fetch the original image from S3
    const imgResponse = await fetch(imageUrl, {
      headers: { 'Accept': 'image/*' },
    });

    if (!imgResponse.ok) {
      return NextResponse.redirect(`${siteUrl}/og-image.png`, 302);
    }

    const originalBuffer = Buffer.from(await imgResponse.arrayBuffer());

    // Resize + crop to 1200 × 630 using sharp
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
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    console.error(`[og-image] Error for type=${type} slug=${slug}: ${errMsg}`);
    if (errStack) console.error(`[og-image] Stack: ${errStack}`);
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