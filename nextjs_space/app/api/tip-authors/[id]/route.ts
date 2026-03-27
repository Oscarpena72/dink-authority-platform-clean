export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const author = await prisma.tipAuthor.findUnique({ where: { id: params?.id ?? '' }, include: { tips: { orderBy: { publishDate: 'desc' } } } });
    if (!author) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(author);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tip author' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const existing = await prisma.tipAuthor.findUnique({ where: { id: params?.id ?? '' } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const author = await prisma.tipAuthor.update({
      where: { id: params?.id ?? '' },
      data: {
        name: body?.name ?? existing.name,
        photoUrl: body?.photoUrl ?? existing.photoUrl,
        bio: body?.bio ?? existing.bio,
      },
    });
    return NextResponse.json(author);
  } catch {
    return NextResponse.json({ error: 'Failed to update tip author' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.tipAuthor.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete tip author' }, { status: 500 });
  }
}
