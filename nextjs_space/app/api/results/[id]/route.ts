import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = await prisma.tournamentResult.update({
      where: { id: params?.id ?? '' },
      data: {
        tournamentName: body?.tournamentName,
        division: body?.division,
        winner: body?.winner,
        runnerUp: body?.runnerUp,
        score: body?.score ?? null,
        location: body?.location ?? null,
        date: body?.date ? new Date(body.date) : undefined,
        externalUrl: body?.externalUrl ?? null,
        isActive: body?.isActive,
      },
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.tournamentResult.delete({ where: { id: params?.id ?? '' } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to delete' }, { status: 500 });
  }
}
