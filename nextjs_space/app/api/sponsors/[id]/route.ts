import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id } = await params;
    const sponsor = await prisma.sponsorBanner.update({
      where: { id },
      data: {
        sponsorName: body.sponsorName,
        imageUrl: body.imageUrl,
        link: body.link,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
        countries: body.countries,
        sections: body.sections,
      },
    });

    return NextResponse.json(sponsor);
  } catch (error: any) {
    console.error('PUT /api/sponsors error:', error);
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.sponsorBanner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/sponsors error:', error);
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}
