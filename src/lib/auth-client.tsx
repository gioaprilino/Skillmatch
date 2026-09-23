'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface Session {
  user?: SessionUser;
  expires?: string;
}

export interface SessionContextValue {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: (data?: any) => Promise<Session | null>;
}

const defaultContextValue: SessionContextValue = {
  data: null,
  status: 'unauthenticated',
  update: async () => null,
};

export const SessionContext = createContext<SessionContextValue>(defaultContextValue);

export interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
  basePath?: string;
  refetchInterval?: number;
}

export function SessionProvider({
  children,
  session: initialSession,
}: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [loading, setLoading] = useState<boolean>(initialSession === undefined);

  useEffect(() => {
    let isMounted = true;

    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSession(data && data.user ? data : null);
          }
        }
      } catch (err) {
        console.warn('[SkillMatch Auth] Could not fetch session:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!initialSession?.user) {
      fetchSession();
    } else {
      setSession(initialSession);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [initialSession]);

  const value = useMemo<SessionContextValue>(
    () => ({
      data: session,
      status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
      update: async (newData?: any) => {
        if (newData) {
          setSession((prev) => (prev ? { ...prev, ...newData } : newData));
        }
        return session;
      },
    }),
    [session, loading]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  // Fail-safe: if context is somehow unavailable, return default unauthenticated state instead of throwing
  if (!context) {
    return defaultContextValue;
  }
  return context;
}

export async function signIn(provider?: string, options?: any) {
  if (typeof window !== 'undefined') {
    const callbackUrl = options?.callbackUrl || '/dashboard';
    window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }
}

export async function signOut(options?: any) {
  try {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  } finally {
    if (typeof window !== 'undefined') {
      const callbackUrl = options?.callbackUrl || '/auth/login';
      window.location.href = callbackUrl;
    }
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data?.user ? data : null;
    }
  } catch {
    // fallback
  }
  return null;
}

export async function getCsrfToken(): Promise<string> {
  return '';
}

export async function getProviders(): Promise<any> {
  return {};
}
