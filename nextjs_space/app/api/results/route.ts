import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    const results = await prisma.tournamentResult.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(results ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = await prisma.tournamentResult.create({
      data: {
        tournamentName: body?.tournamentName ?? '',
        division: body?.division ?? '',
        winner: body?.winner ?? '',
        runnerUp: body?.runnerUp ?? '',
        score: body?.score ?? null,
        location: body?.location ?? null,
        date: new Date(body?.date ?? new Date()),
        externalUrl: body?.externalUrl ?? null,
      },
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create result' }, { status: 500 });
  }
}
