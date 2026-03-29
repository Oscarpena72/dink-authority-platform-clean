export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const country = await prisma.country.findUnique({ where: { slug: params.slug } });
    if (!country) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(country);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const existing = await prisma.country.findUnique({ where: { slug: params.slug } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const country = await prisma.country.update({
      where: { slug: params.slug },
      data: {
        name: body.name ?? existing.name,
        flagEmoji: body.flagEmoji ?? existing.flagEmoji,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : existing.isActive,
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : existing.sortOrder,
        metaTitle: body.metaTitle ?? existing.metaTitle,
        metaDescription: body.metaDescription ?? existing.metaDescription,
        ogImage: body.ogImage ?? existing.ogImage,
        magazineCover: body.magazineCover ?? existing.magazineCover,
        magazineTitle: body.magazineTitle ?? existing.magazineTitle,
        magazineLink: body.magazineLink ?? existing.magazineLink,
        magazinePdfUrl: body.magazinePdfUrl ?? existing.magazinePdfUrl,
        newsBox: body.newsBox ?? existing.newsBox,
        proPlayersBox: body.proPlayersBox ?? existing.proPlayersBox,
        enthusiastsBox: body.enthusiastsBox ?? existing.enthusiastsBox,
        juniorsBox: body.juniorsBox ?? existing.juniorsBox,
        tipsBox: body.tipsBox ?? existing.tipsBox,
        bannerTopImage: body.bannerTopImage ?? existing.bannerTopImage,
        bannerTopLink: body.bannerTopLink ?? existing.bannerTopLink,
        bannerMidImage: body.bannerMidImage ?? existing.bannerMidImage,
        bannerMidLink: body.bannerMidLink ?? existing.bannerMidLink,
        bannerBottomImage: body.bannerBottomImage ?? existing.bannerBottomImage,
        bannerBottomLink: body.bannerBottomLink ?? existing.bannerBottomLink,
        stickyBannerImage: body.stickyBannerImage ?? existing.stickyBannerImage,
        stickyBannerMobileImage: body.stickyBannerMobileImage ?? existing.stickyBannerMobileImage,
        stickyBannerLink: body.stickyBannerLink ?? existing.stickyBannerLink,
        socialMedia: body.socialMedia ?? existing.socialMedia,
      },
    });
    return NextResponse.json(country);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
