'use client';

import * as React from 'react';
import { SessionProvider } from '@/lib/auth-client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { Toaster } from 'react-hot-toast';

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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: '!bg-card !text-card-foreground !border !border-border !shadow-lg',
              style: {
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
              },
              error: {
                duration: 5000,
              },
            }}
          />
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}