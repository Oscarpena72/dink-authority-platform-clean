export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? undefined;
    const category = url.searchParams.get('category') ?? undefined;
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    const tips = await prisma.tip.findMany({
      where,
      orderBy: { publishDate: 'desc' },
      include: { author: { select: { id: true, name: true, slug: true, photoUrl: true } } },
    });
    return NextResponse.json(tips ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const slug = (body?.title ?? 'tip')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    const tip = await prisma.tip.create({
      data: {
        title: body?.title ?? 'Untitled Tip',
        slug,
        excerpt: body?.excerpt ?? null,
        featuredImage: body?.featuredImage ?? null,
        authorId: body?.authorId ?? null,
        publishDate: body?.publishDate ? new Date(body.publishDate) : new Date(),
        category: body?.category ?? 'technique',
        content: body?.content ?? '',
        galleryImages: body?.galleryImages ?? '[]',
        banner1Image: body?.banner1Image ?? null,
        banner1Link: body?.banner1Link ?? null,
        banner2Image: body?.banner2Image ?? null,
        banner2Link: body?.banner2Link ?? null,
        banner3Image: body?.banner3Image ?? null,
        banner3Link: body?.banner3Link ?? null,
        youtubeUrl: body?.youtubeUrl ?? null,
        videoCtaText: body?.videoCtaText ?? null,
        videoCtaLink: body?.videoCtaLink ?? null,
        status: body?.status ?? 'draft',
        language: body?.language ?? 'en',
        metaTitle: body?.metaTitle ?? null,
        metaDescription: body?.metaDescription ?? null,
      },
    });
    return NextResponse.json(tip);
  } catch (error: any) {
    console.error('Failed to create tip:', error);
    return NextResponse.json({ error: 'Failed to create tip' }, { status: 500 });
  }
}
