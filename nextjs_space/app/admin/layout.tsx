export const dynamic = "force-dynamic";
import AdminLayoutClient from './_components/admin-layout-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  /* Refresh role from DB so session stays accurate */
  const userId = (session.user as any)?.id;
  let freshRole = (session.user as any)?.role || 'viewer';
  if (userId) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, isActive: true } });
      if (dbUser) freshRole = dbUser.role;
      if (dbUser && !dbUser.isActive) redirect('/login');
    } catch { /* use session role */ }
  }
  const enrichedSession = { ...session, user: { ...session.user, role: freshRole } };
  return <AdminLayoutClient session={enrichedSession}>{children}</AdminLayoutClient>;
}
