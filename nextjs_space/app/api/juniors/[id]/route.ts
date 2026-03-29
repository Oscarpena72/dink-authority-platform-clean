export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const junior = await prisma.junior.findUnique({ where: { id: params?.id ?? '' } });
    if (!junior) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(junior);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch junior' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const existing = await prisma.junior.findUnique({ where: { id: params?.id ?? '' } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const junior = await prisma.junior.update({
      where: { id: params?.id ?? '' },
      data: {
        name: body?.name ?? existing.name,
        title: body?.title ?? existing.title,
        excerpt: body?.excerpt ?? existing.excerpt,
        country: body?.country ?? existing.country,
        age: body?.age !== undefined ? (body.age ? parseInt(body.age, 10) : null) : existing.age,
        featuredImage: body?.featuredImage ?? existing.featuredImage,
        content: body?.content ?? existing.content,
        galleryImages: body?.galleryImages ?? existing.galleryImages,
        banner2Image: body?.banner2Image ?? existing.banner2Image,
        banner2Link: body?.banner2Link ?? existing.banner2Link,
        banner3Image: body?.banner3Image ?? existing.banner3Image,
        banner3Link: body?.banner3Link ?? existing.banner3Link,
        instagramVideoUrl: body?.instagramVideoUrl ?? existing.instagramVideoUrl,
        videoUrl: body?.videoUrl ?? existing.videoUrl,
        status: body?.status ?? existing.status,
        language: body?.language ?? existing.language,
        publishDate: body?.publishDate ? new Date(body.publishDate) : existing.publishDate,
        metaTitle: body?.metaTitle ?? existing.metaTitle,
        metaDescription: body?.metaDescription ?? existing.metaDescription,
      },
    });
    return NextResponse.json(junior);
  } catch {
    return NextResponse.json({ error: 'Failed to update junior' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.junior.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete junior' }, { status: 500 });
  }
}
