export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.magazineEdition.update({
      where: { id: params?.id ?? '' },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
