export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { csvResponse } from '@/lib/csv-export';
import { syncContactToBrevo, sendWelcomeEmail } from '@/lib/brevo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body?.email ?? '').trim().toLowerCase();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    const source = body?.source ?? 'homepage';

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true, source } });
        return NextResponse.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return NextResponse.json({ error: 'This email is already subscribed' }, { status: 409 });
    }

    await prisma.newsletterSubscriber.create({ data: { email, source } });

    // Sync to Brevo (fire-and-forget)
    syncContactToBrevo({ email, source }).catch((err) =>
      console.error('[Brevo newsletter sync error]', err)
    );

    // Send welcome email
    sendWelcomeEmail({ email }).catch((err) =>
      console.error('[Brevo newsletter welcome email error]', err)
    );

    return NextResponse.json({ message: 'Successfully subscribed! Welcome to Dink Authority.' });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } });

    if (format === 'csv') {
      const headers = ['Email', 'Source', 'Status', 'Date Subscribed'];
      const rows = (subscribers ?? []).map((s: any) => [
        s.email, s.source ?? 'homepage', s.isActive ? 'Active' : 'Inactive', new Date(s.subscribedAt).toISOString(),
      ]);
      return csvResponse(headers, rows, 'newsletter_subscribers');
    }

    return NextResponse.json(subscribers ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
