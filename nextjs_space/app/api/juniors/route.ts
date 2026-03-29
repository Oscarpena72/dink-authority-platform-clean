export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? undefined;
    const where: any = {};
    if (status) where.status = status;
    const juniors = await prisma.junior.findMany({
      where,
      orderBy: { publishDate: 'desc' },
    });
    return NextResponse.json(juniors ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch juniors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const slug = (body?.name ?? 'junior')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    const junior = await prisma.junior.create({
      data: {
        name: body?.name ?? 'Unnamed',
        title: body?.title ?? 'Untitled',
        slug,
        excerpt: body?.excerpt ?? null,
        country: body?.country ?? null,
        age: body?.age ? parseInt(body.age, 10) : null,
        featuredImage: body?.featuredImage ?? null,
        content: body?.content ?? '',
        galleryImages: body?.galleryImages ?? '[]',
        banner2Image: body?.banner2Image ?? null,
        banner2Link: body?.banner2Link ?? null,
        banner3Image: body?.banner3Image ?? null,
        banner3Link: body?.banner3Link ?? null,
        instagramVideoUrl: body?.instagramVideoUrl ?? null,
        videoUrl: body?.videoUrl ?? null,
        videoPosterImage: body?.videoPosterImage ?? null,
        status: body?.status ?? 'draft',
        language: body?.language ?? 'en',
        publishDate: body?.publishDate ? new Date(body.publishDate) : new Date(),
        metaTitle: body?.metaTitle ?? null,
        metaDescription: body?.metaDescription ?? null,
      },
    });
    return NextResponse.json(junior);
  } catch (error: any) {
    console.error('Failed to create junior:', error);
    return NextResponse.json({ error: 'Failed to create junior' }, { status: 500 });
  }
}
