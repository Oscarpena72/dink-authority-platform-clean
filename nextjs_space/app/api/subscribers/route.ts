import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { csvResponse } from '@/lib/csv-export';
import { syncContactToBrevo, sendWelcomeEmail } from '@/lib/brevo';

export const dynamic = 'force-dynamic';

// POST — subscribe (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? '').trim().toLowerCase();
    const phoneNumber = (body.phoneNumber ?? '').trim() || null;
    const source = body.source ?? 'footer';
    const name = (body.name ?? '').trim() || null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Check if this is a brand-new subscriber (for welcome email)
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
    const isNewSubscriber = !existingSubscriber;

    // Upsert — if email exists, update phone/name if provided
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(name ? { name } : {}),
      },
      create: { email, phoneNumber, source, name },
    });

    // Sync to Brevo (fire-and-forget, non-blocking)
    syncContactToBrevo({
      email,
      phone: phoneNumber,
      name,
      source,
      subscribedAt: subscriber.subscribedAt?.toISOString(),
    }).catch((err) => console.error('[Brevo sync error]', err));

    // Send welcome email only for new subscribers
    if (isNewSubscriber) {
      sendWelcomeEmail({ email, name: name || undefined }).catch((err) =>
        console.error('[Brevo welcome email error]', err)
      );
    }

    return NextResponse.json({ success: true, message: 'Thanks for subscribing to Dink Authority Magazine!' });
  } catch (err: any) {
    console.error('Subscriber POST error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

// GET — admin list (protected)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });

    if (format === 'csv') {
      const headers = ['Name', 'Email', 'Phone', 'Source', 'Date Subscribed'];
      const rows = subscribers.map((s: any) => [
        s.name ?? '', s.email, s.phoneNumber ?? '', s.source, new Date(s.subscribedAt).toISOString(),
      ]);
      return csvResponse(headers, rows, 'subscribers');
    }

    return NextResponse.json({ subscribers, total: subscribers.length });
  } catch (err: any) {
    console.error('Subscriber GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
