import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
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

    const edition = await prisma.magazineEdition.create({
      data: {
        title: body?.title ?? '',
        issueNumber: body?.issueNumber ?? null,
        coverUrl: body?.coverUrl ?? null,
        description: body?.description ?? null,
        pdfUrl: body?.pdfUrl ?? null,
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
