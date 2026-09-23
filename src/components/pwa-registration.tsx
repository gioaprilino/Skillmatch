'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

export function PWARegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsInstalled(isStandalone || (isIOS && (navigator as any).standalone === true));

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isStandalone) {
        setTimeout(() => setShowPrompt(true), 30000); // Show after 30s
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register Service Worker only in production to avoid intercepting dev HMR
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('[PWA] SW registered:', registration.scope),
        (error) => console.log('[PWA] SW registration failed:', error)
      );
    } else if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install');
      setShowPrompt(false);
      setDeferredPrompt(null);
    } else {
      console.log('[PWA] User dismissed install');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      setShowPrompt(false);
    }
  }, []);

  if (isInstalled || !showPrompt || typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:right-4 md:left-auto md:bottom-4 md:top-auto md:w-96 z-50 animate-slide-in" role="dialog" aria-label="Install SkillMatch app">
      <div className="bg-background border rounded-xl shadow-xl p-4 flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
          <Smartphone className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">Pasang SkillMatch</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Akses cepat offline, notifikasi real-time, & pengalaman seperti aplikasi native
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleInstall} className="flex-1 sm:flex-none">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Pasang
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss} aria-label="Tutup">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}