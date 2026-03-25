export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.findUnique({ where: { id: params?.id ?? '' } });
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (body?.isHeroStory) {
      await prisma.article.updateMany({ where: { isHeroStory: true, id: { not: params?.id } }, data: { isHeroStory: false } });
    }

    const existing = await prisma.article.findUnique({ where: { id: params?.id ?? '' } });
    const article = await prisma.article.update({
      where: { id: params?.id ?? '' },
      data: {
        title: body?.title ?? existing?.title,
        content: body?.content ?? existing?.content,
        excerpt: body?.excerpt ?? existing?.excerpt,
        imageUrl: body?.imageUrl ?? existing?.imageUrl,
        category: body?.category ?? existing?.category,
        status: body?.status ?? existing?.status,
        isFeatured: body?.isFeatured ?? existing?.isFeatured,
        isHeroStory: body?.isHeroStory ?? existing?.isHeroStory,
        authorName: body?.authorName ?? existing?.authorName,
        focalPointX: typeof body?.focalPointX === 'number' ? body.focalPointX : existing?.focalPointX,
        focalPointY: typeof body?.focalPointY === 'number' ? body.focalPointY : existing?.focalPointY,
        publishedAt: body?.status === 'published' && !existing?.publishedAt ? new Date() : existing?.publishedAt,
      },
    });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.article.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
