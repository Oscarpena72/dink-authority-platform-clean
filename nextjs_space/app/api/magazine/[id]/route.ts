import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    if (body?.isCurrent) {
      await prisma.magazineEdition.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
    }

    const edition = await prisma.magazineEdition.update({
      where: { id: params?.id ?? '' },
      data: {
        title: body?.title,
        issueNumber: body?.issueNumber ?? null,
        coverUrl: body?.coverUrl ?? null,
        description: body?.description ?? null,
        pdfUrl: body?.pdfUrl ?? null,
        externalUrl: body?.externalUrl ?? null,
        isCurrent: body?.isCurrent,
        publishDate: body?.publishDate ? new Date(body.publishDate) : undefined,
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
