export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { deleteFile } from '@/lib/s3';

export async function GET() {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(media ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const media = await prisma.media.create({
      data: {
        fileName: body?.fileName ?? 'file',
        cloudStoragePath: body?.cloudStoragePath ?? null,
        url: body?.url ?? '',
        altText: body?.altText ?? null,
        mimeType: body?.mimeType ?? null,
        size: body?.size ?? null,
        isPublic: body?.isPublic ?? true,
      },
    });
    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: 'Failed to create media record' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const media = await prisma.media.findUnique({ where: { id } });
    if (media?.cloudStoragePath) {
      await deleteFile(media.cloudStoragePath).catch(() => {});
    }
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
