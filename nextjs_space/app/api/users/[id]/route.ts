export const dynamic = 'force-dynamic';
import { NextResponse, NextRequest } from 'next/server';
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

/* PUT — update user (admin+) */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: callerId, role: callerRole } = await getCallerInfo();
    if (!isAtLeast(callerRole ?? undefined, 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = params;
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const data: any = {};

    /* Name */
    if (body.name !== undefined) data.name = body.name;

    /* Email — check uniqueness */
    if (body.email && body.email !== target.email) {
      const dup = await prisma.user.findUnique({ where: { email: body.email } });
      if (dup) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      data.email = body.email;
    }

    /* Role change */
    if (body.role && body.role !== target.role) {
      const newRole = body.role as Role;
      /* Only super_admin can change to/from super_admin */
      if (callerRole !== 'super_admin') {
        if (target.role === 'super_admin') {
          return NextResponse.json({ error: 'Cannot modify a Super Admin' }, { status: 403 });
        }
        if ((ROLE_LEVEL[newRole] ?? 0) >= (ROLE_LEVEL[callerRole!] ?? 0)) {
          return NextResponse.json({ error: 'Cannot assign a role equal or higher than your own' }, { status: 403 });
        }
      }
      data.role = newRole;
    }

    /* isActive toggle */
    if (body.isActive !== undefined) {
      /* Cannot deactivate yourself */
      if (id === callerId && body.isActive === false) {
        return NextResponse.json({ error: 'Cannot deactivate your own account' }, { status: 400 });
      }
      /* Non-super_admin cannot deactivate super_admin */
      if (target.role === 'super_admin' && callerRole !== 'super_admin') {
        return NextResponse.json({ error: 'Cannot deactivate a Super Admin' }, { status: 403 });
      }
      data.isActive = body.isActive;
    }

    /* Password reset */
    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      data.password = await bcrypt.hash(body.password, 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

/* DELETE — delete user (super_admin only) */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: callerId, role: callerRole } = await getCallerInfo();
    if (callerRole !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can delete users' }, { status: 403 });
    }
    const { id } = params;
    if (id === callerId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed' }, { status: 500 });
  }
}
