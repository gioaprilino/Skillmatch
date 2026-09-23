'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Logo, NavItem } from '@/components/dashboard';
import { Shield, LayoutDashboard, BookOpen, Briefcase, Award, Globe, PiggyBank, Users, Settings, LogOut, Menu, X, ChevronDown, FileText } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { NotificationBell } from '@/components/notification-bell';

interface DashboardLayoutClientProps {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      role: string;
      image?: string | null;
    };
  };
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upskilling', href: '/dashboard/upskilling', icon: BookOpen },
  { name: 'Lowongan', href: '/dashboard/jobs', icon: Briefcase },
  { name: 'Lamaran Saya', href: '/dashboard/applications', icon: FileText },
  { name: 'Sertifikat', href: '/dashboard/certificates', icon: Award },
  { name: 'Migrasi', href: '/dashboard/migration', icon: Globe },
  { name: 'Keuangan', href: '/dashboard/finance', icon: PiggyBank },
  { name: 'Komunitas', href: '/dashboard/community', icon: Users },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
];

const employerNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lowongan Saya', href: '/dashboard/employer/jobs', icon: Briefcase },
  { name: 'Kandidat', href: '/dashboard/employer/candidates', icon: Users },
  { name: 'Verifikasi VC', href: '/dashboard/employer/verify', icon: Award },
  { name: 'Profil Perusahaan', href: '/dashboard/employer/profile', icon: Settings },
];

export default function DashboardLayoutClient({ session, children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEmployer = session.user.role === 'EMPLOYER';
  const navItems = isEmployer ? employerNavigation : navigation;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar>
        <SidebarContent className="hidden lg:flex">
          <SidebarHeader className="p-4">
            <Logo />
          </SidebarHeader>
          <SidebarMenu>
            {navItems.map(item => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    pathname === item.href && 'bg-primary/10 text-primary'
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarContent className="lg:hidden fixed inset-0 z-50 flex flex-col bg-background border-r">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </SidebarHeader>
          <SidebarMenu className="flex-1 overflow-y-auto">
            {navItems.map(item => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    pathname === item.href && 'bg-primary/10 text-primary'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 lg:hidden" />

          <div className="flex items-center gap-3">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                    <AvatarFallback name={session.user.name || 'User'} />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                      {session.user.role === 'WORKER' ? 'Pekerja' : session.user.role === 'EMPLOYER' ? 'Perusahaan' : session.user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Pengaturan</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {false && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}