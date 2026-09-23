'use client';

import * as React from 'react';
import { SessionProvider } from '@/lib/auth-client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}