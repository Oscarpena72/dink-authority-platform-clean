import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const country = searchParams.get('country'); // 'central', 'colombia', etc.

    if (slug) {
      const edition = await prisma.magazineEdition.findFirst({ where: { slug } });
      if (!edition) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(edition);
    }

    const editions = await prisma.magazineEdition.findMany({
      orderBy: { publishDate: 'desc' },
    });

    // Filter by country if specified
    let filtered = editions ?? [];
    if (country) {
      filtered = filtered.filter((e: any) => {
        try {
          const countries: string[] = JSON.parse(e.countries || '[]');
          return countries.includes(country);
        } catch { return false; }
      });
    }

    return NextResponse.json(filtered);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch editions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Parse currentFor regions array
    const currentForRegions: string[] = Array.isArray(body?.currentFor) ? body.currentFor : [];

    // For each region in currentFor, remove it from all other editions' currentFor
    if (currentForRegions.length > 0) {
      const allEditions = await prisma.magazineEdition.findMany({ select: { id: true, currentFor: true } });
      for (const ed of allEditions) {
        let edRegions: string[] = [];
        try { edRegions = JSON.parse(ed.currentFor || '[]'); } catch { edRegions = []; }
        const filtered = edRegions.filter((r: string) => !currentForRegions.includes(r));
        if (filtered.length !== edRegions.length) {
          await prisma.magazineEdition.update({
            where: { id: ed.id },
            data: { currentFor: JSON.stringify(filtered), isCurrent: filtered.length > 0 },
          });
        }
      }
    }

    // Generate slug from title
    const slug = (body?.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const edition = await prisma.magazineEdition.create({
      data: {
        title: body?.title ?? '',
        slug,
        issueNumber: body?.issueNumber ?? null,
        coverUrl: body?.coverUrl ?? null,
        description: body?.description ?? null,
        externalUrl: body?.externalUrl ?? null,
        isCurrent: currentForRegions.length > 0,
        publishDate: new Date(body?.publishDate ?? new Date()),
        countries: body?.countries ? JSON.stringify(body.countries) : '["central"]',
        currentFor: JSON.stringify(currentForRegions),
      },
    });
    return NextResponse.json(edition);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create edition' }, { status: 500 });
  }
}
