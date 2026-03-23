export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { startDate: 'asc' } });
    return NextResponse.json(events ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        name: body?.name ?? 'New Event',
        description: body?.description ?? null,
        location: body?.location ?? '',
        startDate: new Date(body?.startDate ?? Date.now()),
        endDate: body?.endDate ? new Date(body.endDate) : null,
        imageUrl: body?.imageUrl ?? null,
        externalUrl: body?.externalUrl ?? null,
        isActive: body?.isActive ?? true,
      },
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
