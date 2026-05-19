export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { syncBatchToBrevo } from '@/lib/brevo';

/**
 * POST /api/brevo/sync — Sync all existing subscribers + newsletter subscribers to Brevo.
 * Protected: admin only.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Gather all subscribers from both models
    const [subscribers, newsletterSubs] = await Promise.all([
      prisma.subscriber.findMany(),
      prisma.newsletterSubscriber.findMany({ where: { isActive: true } }),
    ]);

    // Merge into a deduplicated list by email
    const emailMap = new Map<string, { email: string; phone?: string | null; name?: string | null; source: string; subscribedAt: string }>();

    for (const s of subscribers) {
      emailMap.set(s.email, {
        email: s.email,
        phone: s.phoneNumber,
        name: s.name,
        source: s.source || 'footer',
        subscribedAt: s.subscribedAt?.toISOString() || new Date().toISOString(),
      });
    }

    for (const n of newsletterSubs) {
      if (!emailMap.has(n.email)) {
        emailMap.set(n.email, {
          email: n.email,
          name: n.name,
          source: n.source || 'homepage',
          subscribedAt: n.subscribedAt?.toISOString() || new Date().toISOString(),
        });
      }
    }

    const contacts = Array.from(emailMap.values());
    const result = await syncBatchToBrevo(contacts);

    return NextResponse.json({
      message: `Sync complete: ${result.synced} synced, ${result.failed} failed out of ${contacts.length} total.`,
      ...result,
      total: contacts.length,
    });
  } catch (err: any) {
    console.error('[Brevo sync API error]', err);
    return NextResponse.json({ error: 'Sync failed: ' + (err?.message || 'Unknown error') }, { status: 500 });
  }
}
