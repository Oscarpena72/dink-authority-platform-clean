import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const edition = await prisma.magazineEdition.findUnique({ where: { id: params?.id ?? '' } });
    if (!edition) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(edition);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    if (body?.isCurrent) {
      await prisma.magazineEdition.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
    }

    // Generate slug from title if not provided
    let slug = body?.slug;
    if (!slug && body?.title) {
      slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const edition = await prisma.magazineEdition.update({
      where: { id: params?.id ?? '' },
      data: {
        title: body?.title,
        slug: slug ?? undefined,
        issueNumber: body?.issueNumber ?? null,
        coverUrl: body?.coverUrl ?? null,
        description: body?.description ?? null,
        pdfUrl: body?.pdfUrl ?? null,
        pdfCloudPath: body?.pdfCloudPath ?? null,
        pdfPageCount: body?.pdfPageCount ? parseInt(body.pdfPageCount) : null,
        externalUrl: body?.externalUrl ?? null,
        isCurrent: body?.isCurrent,
        publishDate: body?.publishDate ? new Date(body.publishDate) : undefined,
        countries: body?.countries ? JSON.stringify(body.countries) : undefined,
      },
    });
    return NextResponse.json(edition);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.magazineEdition.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to delete' }, { status: 500 });
  }
}
