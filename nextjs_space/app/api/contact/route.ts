export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
        subject: body?.subject ?? null,
        message: body.message,
      },
    });
    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(submissions ?? []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
