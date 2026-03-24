import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getFileUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    let edition;
    if (slug) {
      edition = await prisma.magazineEdition.findFirst({ where: { slug } });
    } else if (id) {
      edition = await prisma.magazineEdition.findUnique({ where: { id } });
    }

    if (!edition) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let pdfUrlToFetch: string | null = null;

    if (edition.pdfCloudPath) {
      pdfUrlToFetch = await getFileUrl(edition.pdfCloudPath, false);
    } else if (edition.pdfUrl) {
      pdfUrlToFetch = edition.pdfUrl;
    }

    if (!pdfUrlToFetch) {
      return NextResponse.json({ error: 'No PDF available' }, { status: 404 });
    }

    // Fetch the PDF from S3 and stream it back
    const pdfResponse = await fetch(pdfUrlToFetch);
    if (!pdfResponse.ok) {
      console.error('PDF fetch failed:', pdfResponse.status, pdfResponse.statusText);
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdfBuffer.byteLength),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('PDF proxy error:', err);
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}
