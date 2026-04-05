export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { isAtLeast, ROLE_LEVEL, type Role } from '@/lib/roles';

/* Helper: get fresh role from DB (JWT may be stale) */
async function getCallerInfo() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as any)?.id;
  if (!id) return { id: null as string | null, role: null as Role | null };
  try {
    const dbUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    return { id, role: (dbUser?.role ?? (session?.user as any)?.role) as Role };
  } catch {
    return { id, role: (session?.user as any)?.role as Role };
  }
}

/* GET — list all users (admin+) */
export async function GET() {
  try {
    const { role } = await getCallerInfo();
    if (!isAtLeast(role ?? undefined, 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

/* POST — create user (admin+) */
export async function POST(req: Request) {
  try {
    const { role: callerRole } = await getCallerInfo();
    if (!isAtLeast(callerRole ?? undefined, 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const { name, email, password, role, isActive } = body ?? {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    const targetRole = (role || 'editor') as Role;
    /* Non-super_admin cannot create users with higher/equal role */
    if (callerRole !== 'super_admin' && (ROLE_LEVEL[targetRole] ?? 0) >= (ROLE_LEVEL[callerRole!] ?? 0)) {
      return NextResponse.json({ error: 'Cannot assign a role equal or higher than your own' }, { status: 403 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name || email.split('@')[0], email, password: hashed, role: targetRole, isActive: isActive !== false },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed' }, { status: 500 });
  }
}
