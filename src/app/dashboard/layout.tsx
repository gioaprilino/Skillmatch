import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // During build time or static export
  }

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <DashboardLayoutClient session={session} children={children} />;
}