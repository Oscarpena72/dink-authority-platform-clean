export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    const authors = await prisma.tipAuthor.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { tips: true } } } });
    return NextResponse.json(authors ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tip authors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const slug = (body?.name ?? 'author')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    const author = await prisma.tipAuthor.create({
      data: {
        name: body?.name ?? 'Unnamed',
        slug,
        photoUrl: body?.photoUrl ?? null,
        bio: body?.bio ?? null,
      },
    });
    return NextResponse.json(author);
  } catch {
    return NextResponse.json({ error: 'Failed to create tip author' }, { status: 500 });
  }
}
