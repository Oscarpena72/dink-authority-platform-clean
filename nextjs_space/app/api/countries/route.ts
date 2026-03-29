export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(countries);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const country = await prisma.country.create({
      data: {
        name: body.name,
        slug: body.slug,
        code: body.code,
        flagEmoji: body.flagEmoji ?? '',
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        ogImage: body.ogImage ?? null,
        socialMedia: body.socialMedia ?? '{}',
      },
    });
    return NextResponse.json(country);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
