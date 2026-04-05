export const dynamic = 'force-dynamic';
import AdminUsersClient from './_components/admin-users-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  let freshRole = (session?.user as any)?.role || 'viewer';
  if (userId) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (dbUser) freshRole = dbUser.role;
    } catch { /* use session role */ }
  }
  return <AdminUsersClient serverRole={freshRole} serverUserId={userId} />;
}
