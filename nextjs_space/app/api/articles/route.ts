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
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true } } },
    });
    return NextResponse.json(articles ?? []);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const slug = (body?.title ?? 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    if (body?.isHeroStory) {
      await prisma.article.updateMany({ where: { isHeroStory: true }, data: { isHeroStory: false } });
    }

    const article = await prisma.article.create({
      data: {
        title: body?.title ?? 'Untitled',
        slug,
        content: body?.content ?? '',
        excerpt: body?.excerpt ?? null,
        imageUrl: body?.imageUrl ?? null,
        focalPointX: typeof body?.focalPointX === 'number' ? body.focalPointX : 50,
        focalPointY: typeof body?.focalPointY === 'number' ? body.focalPointY : 50,
        category: body?.category ?? 'news',
        status: body?.status ?? 'draft',
        isFeatured: body?.isFeatured ?? false,
        isHeroStory: body?.isHeroStory ?? false,
        authorId: (session.user as any)?.id ?? null,
        authorName: body?.authorName ?? session.user?.name ?? 'Staff',
        videoUrl: body?.videoUrl ?? null,
        videoPosterImage: body?.videoPosterImage ?? null,
        galleryImages: body?.galleryImages ?? '[]',
        socialMediaLink: body?.socialMediaLink ?? null,
        banner1Image: body?.banner1Image ?? null,
        banner1Link: body?.banner1Link ?? null,
        banner2Image: body?.banner2Image ?? null,
        banner2Link: body?.banner2Link ?? null,
        banner3Image: body?.banner3Image ?? null,
        banner3Link: body?.banner3Link ?? null,
        metaTitle: body?.metaTitle ?? null,
        metaDescription: body?.metaDescription ?? null,
        publishedAt: body?.publishedAt ? new Date(body.publishedAt) : (body?.status === 'published' ? new Date() : null),
      },
    });
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Article creation error:', error?.message, error?.code, error?.meta);
    return NextResponse.json({ error: `Failed to create article: ${error?.message ?? 'unknown'}` }, { status: 500 });
  }
}
