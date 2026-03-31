import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'central';
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (!all) {
      where.isActive = true;
      where.countries = { contains: country };
    }

    const sponsors = await prisma.sponsorBanner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(sponsors);
  } catch (error: any) {
    console.error('GET /api/sponsors error:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const sponsor = await prisma.sponsorBanner.create({
      data: {
        sponsorName: body.sponsorName || '',
        imageUrl: body.imageUrl || '',
        link: body.link || '',
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
        countries: body.countries || '["central"]',
      },
    });

    return NextResponse.json(sponsor);
  } catch (error: any) {
    console.error('POST /api/sponsors error:', error);
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  }
}
