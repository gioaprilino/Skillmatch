import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      redirect('/auth/login');
    }

    return <DashboardLayoutClient session={session} children={children} />;
  } catch {
    // During static generation, auth() might fail
    return <DashboardLayoutClient session={{ user: { name: '', email: '', role: 'WORKER', image: null } }} children={children} />;
  }
}