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
    // Resolve author: use authorName to find or create a TipAuthor, or fall back to authorId
    let resolvedAuthorId: string | null = body?.authorId || existing.authorId;
    const authorNameInput = (body?.authorName ?? '').trim();
    if (authorNameInput) {
      const authorSlug = authorNameInput.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const existingAuthor = await prisma.tipAuthor.findFirst({ where: { slug: authorSlug } });
      if (existingAuthor) {
        resolvedAuthorId = existingAuthor.id;
      } else {
        const newAuthor = await prisma.tipAuthor.create({ data: { name: authorNameInput, slug: authorSlug } });
        resolvedAuthorId = newAuthor.id;
      }
    }

    const tip = await prisma.tip.update({
      where: { id: params?.id ?? '' },
      data: {
        title: body?.title ?? existing.title,
        excerpt: body?.excerpt ?? existing.excerpt,
        featuredImage: body?.featuredImage ?? existing.featuredImage,
        authorId: resolvedAuthorId,
        authorName: authorNameInput || existing.authorName,
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
        videoUrl: body?.videoUrl ?? existing.videoUrl,
        videoPosterImage: body?.videoPosterImage ?? existing.videoPosterImage,
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
