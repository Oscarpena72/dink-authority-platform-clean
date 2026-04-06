export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { csvResponse } from '@/lib/csv-export';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || !body?.email || !body?.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        subject: body?.subject ?? null,
        message: body.message,
        source: body?.source ?? 'contact-form',
      },
    });
    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });

    if (format === 'csv') {
      const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Source', 'Status', 'Date'];
      const rows = (submissions ?? []).map((s: any) => [
        s.name ?? '', s.email, s.phone ?? '', s.subject ?? '',
        (s.message ?? '').replace(/[\n\r]+/g, ' '), s.source ?? 'contact-form',
        s.status ?? 'new', new Date(s.createdAt).toISOString(),
      ]);
      return csvResponse(headers, rows, 'contacts');
    }

    return NextResponse.json(submissions ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
