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
import { Shield, LayoutDashboard, BookOpen, Briefcase, Award, Globe, PiggyBank, Users, Settings, LogOut, Menu, X, ChevronDown, FileText, PhoneCall, LifeBuoy } from 'lucide-react';
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
        <SidebarContent className="hidden lg:flex flex-col justify-between h-full">
          <div>
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
          </div>

          {/* Emergency SOS Banner in Sidebar Footer for PMI Protection */}
          {!isEmployer && (
            <div className="p-3 border-t border-border/60">
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-destructive">
                  <LifeBuoy className="h-4 w-4 shrink-0 animate-pulse" />
                  <span>Hotline Darurat PMI</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Bantuan perlindungan KBRI & Kemlu RI 24 jam di luar negeri
                </p>
                <Link
                  href="/dashboard/migration"
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium transition-colors"
                >
                  <PhoneCall className="h-3 w-3" />
                  <span>Kontak & Hotline KBRI</span>
                </Link>
              </div>
            </div>
          )}
        </SidebarContent>

        {sidebarOpen && (
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

            {!isEmployer && (
              <div className="p-4 border-t border-border mt-auto">
                <Link
                  href="/dashboard/migration"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Hotline Bantuan Darurat PMI</span>
                </Link>
              </div>
            )}
          </SidebarContent>
        )}
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}