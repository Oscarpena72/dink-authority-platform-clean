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

    // If has cloud path, generate signed URL
    if (edition.pdfCloudPath && edition.pdfCloudPath.trim().length > 0) {
      const url = await getFileUrl(edition.pdfCloudPath, false);
      return NextResponse.json({ url, pageCount: edition.pdfPageCount });
    }

    // If has direct pdfUrl
    if (edition.pdfUrl && edition.pdfUrl.trim().length > 0) {
      return NextResponse.json({ url: edition.pdfUrl, pageCount: edition.pdfPageCount });
    }

    return NextResponse.json({ error: 'No PDF available' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed' }, { status: 500 });
  }
}
