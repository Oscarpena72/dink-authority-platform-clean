import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import AdminSponsorsClient from './_components/admin-sponsors-client';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  return <AdminSponsorsClient />;
}
