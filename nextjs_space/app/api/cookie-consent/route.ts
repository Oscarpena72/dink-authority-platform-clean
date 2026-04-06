export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { csvResponse } from '@/lib/csv-export';
import crypto from 'crypto';

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'dink-salt-2026').digest('hex').slice(0, 16);
}

// POST — Public: Record a new consent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, analytics, marketing } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const ipHash = hashIp(ip);
    const userAgent = req.headers.get('user-agent')?.slice(0, 200) || null;

    // Upsert by sessionId so repeat clicks don't create duplicates
    const consent = await prisma.cookieConsent.upsert({
      where: { sessionId },
      create: {
        sessionId,
        essential: true,
        analytics: !!analytics,
        marketing: !!marketing,
        ipHash,
        userAgent,
      },
      update: {
        essential: true,
        analytics: !!analytics,
        marketing: !!marketing,
        ipHash,
        userAgent,
      },
    });

    return NextResponse.json({ success: true, id: consent.id });
  } catch (err: any) {
    console.error('Cookie consent POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — Admin only: fetch consent records + stats
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Look up by id first (reliable), fall back to email
    const userId = (session.user as any).id as string | undefined;
    const dbUser = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : session.user.email
        ? await prisma.user.findUnique({ where: { email: session.user.email } })
        : null;
    if (!dbUser || !['super_admin', 'admin'].includes(dbUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format');

    // Stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [total, analyticsAccepted, marketingAccepted, last30Total, last30Analytics, last30Marketing, recentRecords] = await Promise.all([
      prisma.cookieConsent.count(),
      prisma.cookieConsent.count({ where: { analytics: true } }),
      prisma.cookieConsent.count({ where: { marketing: true } }),
      prisma.cookieConsent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.cookieConsent.count({ where: { analytics: true, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.cookieConsent.count({ where: { marketing: true, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.cookieConsent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          sessionId: true,
          essential: true,
          analytics: true,
          marketing: true,
          ipHash: true,
          consentVersion: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    if (format === 'csv') {
      const csvHeaders = ['ID', 'Session ID', 'Essential', 'Analytics', 'Marketing', 'IP Hash', 'Version', 'Date'];
      const csvRows = recentRecords.map((r: any) => [
        r.id, r.sessionId, r.essential, r.analytics, r.marketing,
        r.ipHash || '', r.consentVersion, r.createdAt.toISOString(),
      ]);
      return csvResponse(csvHeaders, csvRows, 'cookie_consent');
    }

    return NextResponse.json({
      stats: {
        total,
        analyticsAccepted,
        marketingAccepted,
        analyticsRejected: total - analyticsAccepted,
        marketingRejected: total - marketingAccepted,
        last30Days: {
          total: last30Total,
          analyticsAccepted: last30Analytics,
          marketingAccepted: last30Marketing,
        },
      },
      records: recentRecords.map((r: any) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error('Cookie consent GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
