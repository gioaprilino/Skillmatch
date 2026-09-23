import DashboardClient from './DashboardClient';

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-10 bg-muted rounded w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 bg-muted rounded" />
        <div className="h-64 bg-muted rounded" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 bg-muted rounded lg:col-span-2" />
        <div className="h-64 bg-muted rounded" />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    
    if (!session?.user) {
      return <DashboardClient session={{ user: { name: '', role: 'WORKER' } }} />;
    }

    return <DashboardClient session={session} />;
  } catch {
    // During static generation, auth() might fail
    return <DashboardClient session={{ user: { name: '', role: 'WORKER' } }} />;
  }
}