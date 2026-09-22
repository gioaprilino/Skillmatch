'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </ThemeProvider>
  );
}