export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

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
      const header = 'Email,Source,Status,Date Subscribed';
      const rows = (subscribers ?? []).map((s: any) =>
        `"${s.email}","${s.source ?? 'homepage'}","${s.isActive ? 'Active' : 'Inactive'}","${new Date(s.subscribedAt).toISOString()}"`
      );
      const csv = [header, ...rows].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="newsletter_subscribers.csv"',
        },
      });
    }

    return NextResponse.json(subscribers ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
