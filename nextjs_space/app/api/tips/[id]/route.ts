export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const tip = await prisma.tip.findUnique({ where: { id: params?.id ?? '' }, include: { author: true } });
    if (!tip) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(tip);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tip' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const existing = await prisma.tip.findUnique({ where: { id: params?.id ?? '' } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const tip = await prisma.tip.update({
      where: { id: params?.id ?? '' },
      data: {
        title: body?.title ?? existing.title,
        excerpt: body?.excerpt ?? existing.excerpt,
        featuredImage: body?.featuredImage ?? existing.featuredImage,
        authorId: body?.authorId ?? existing.authorId,
        publishDate: body?.publishDate ? new Date(body.publishDate) : existing.publishDate,
        category: body?.category ?? existing.category,
        content: body?.content ?? existing.content,
        galleryImages: body?.galleryImages ?? existing.galleryImages,
        banner1Image: body?.banner1Image ?? existing.banner1Image,
        banner1Link: body?.banner1Link ?? existing.banner1Link,
        banner2Image: body?.banner2Image ?? existing.banner2Image,
        banner2Link: body?.banner2Link ?? existing.banner2Link,
        banner3Image: body?.banner3Image ?? existing.banner3Image,
        banner3Link: body?.banner3Link ?? existing.banner3Link,
        youtubeUrl: body?.youtubeUrl ?? existing.youtubeUrl,
        videoCtaText: body?.videoCtaText ?? existing.videoCtaText,
        videoCtaLink: body?.videoCtaLink ?? existing.videoCtaLink,
        status: body?.status ?? existing.status,
        language: body?.language ?? existing.language,
        metaTitle: body?.metaTitle ?? existing.metaTitle,
        metaDescription: body?.metaDescription ?? existing.metaDescription,
      },
    });
    return NextResponse.json(tip);
  } catch {
    return NextResponse.json({ error: 'Failed to update tip' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.tip.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete tip' }, { status: 500 });
  }
}
