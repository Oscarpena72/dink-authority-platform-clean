import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // Prefer direct public pdfUrl (works on any host without S3 credentials)
    if (edition.pdfUrl && edition.pdfUrl.trim().length > 0) {
      return NextResponse.json({ url: edition.pdfUrl, pageCount: edition.pdfPageCount });
    }

    // Fallback: generate signed URL from cloud path (requires S3 credentials)
    if (edition.pdfCloudPath && edition.pdfCloudPath.trim().length > 0) {
      try {
        const { getFileUrl } = await import('@/lib/s3');
        const url = await getFileUrl(edition.pdfCloudPath, false);
        return NextResponse.json({ url, pageCount: edition.pdfPageCount });
      } catch (s3Err: any) {
        console.error('S3 signed URL failed:', s3Err?.message);
        return NextResponse.json({ error: 'PDF storage not accessible' }, { status: 502 });
      }
    }

    return NextResponse.json({ error: 'No PDF available' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}
