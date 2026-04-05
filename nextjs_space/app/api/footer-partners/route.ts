import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (!all) {
      where.isActive = true;
    }

    const partners = await prisma.footerPartner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(partners);
  } catch (error: any) {
    console.error('GET /api/footer-partners error:', error);
    return NextResponse.json({ error: 'Failed to fetch footer partners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const partner = await prisma.footerPartner.create({
      data: {
        name: body.name || '',
        logoUrl: body.logoUrl || '',
        websiteUrl: body.websiteUrl || null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json(partner);
  } catch (error: any) {
    console.error('POST /api/footer-partners error:', error);
    return NextResponse.json({ error: 'Failed to create footer partner' }, { status: 500 });
  }
}
