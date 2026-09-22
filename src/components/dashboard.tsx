import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center space-x-2" aria-label="SkillMatch Dashboard">
      <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
      <span className="font-bold text-xl">SkillMatch</span>
    </Link>
  );
}

export function NavItem({
  name,
  href,
  icon: Icon,
  active,
}: {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {name}
    </Link>
  );
}

export function UserMenu({
  user,
  onSignOut,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
  onSignOut: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
      </div>
      <button
        onClick={onSignOut}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-accent transition-colors"
        aria-label="Menu pengguna"
      >
        {user.image ? (
          <img src={user.image} alt="" className="h-10 w-10 rounded-full" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </button>
    </div>
  );
}