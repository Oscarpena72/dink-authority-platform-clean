export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const event = await prisma.event.update({
      where: { id: params?.id ?? '' },
      data: {
        name: body?.name,
        description: body?.description,
        location: body?.location,
        startDate: body?.startDate ? new Date(body.startDate) : undefined,
        endDate: body?.endDate ? new Date(body.endDate) : null,
        imageUrl: body?.imageUrl,
        externalUrl: body?.externalUrl,
        isActive: body?.isActive,
      },
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.event.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
