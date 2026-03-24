import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const edition = await prisma.magazineEdition.findFirst({ where: { slug } });
      if (!edition) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(edition);
    }

    const editions = await prisma.magazineEdition.findMany({
      orderBy: { publishDate: 'desc' },
    });
    return NextResponse.json(editions ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch editions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // If marking as current, unmark all others
    if (body?.isCurrent) {
      await prisma.magazineEdition.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
    }

    // Generate slug from title
    const slug = (body?.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const edition = await prisma.magazineEdition.create({
      data: {
        title: body?.title ?? '',
        slug,
        issueNumber: body?.issueNumber ?? null,
        coverUrl: body?.coverUrl ?? null,
        description: body?.description ?? null,
        pdfUrl: body?.pdfUrl ?? null,
        pdfCloudPath: body?.pdfCloudPath ?? null,
        pdfPageCount: body?.pdfPageCount ? parseInt(body.pdfPageCount) : null,
        externalUrl: body?.externalUrl ?? null,
        isCurrent: body?.isCurrent ?? false,
        publishDate: new Date(body?.publishDate ?? new Date()),
      },
    });
    return NextResponse.json(edition);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create edition' }, { status: 500 });
  }
}
