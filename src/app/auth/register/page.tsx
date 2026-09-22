'use client';

import { Suspense } from 'react';
import RegisterForm from './RegisterForm';

function RegisterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="animate-pulse space-y-4 max-w-2xl w-full mx-auto">
        <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
        <div className="h-32 bg-muted rounded" />
        <div className="h-10 bg-muted rounded w-full" />
        <div className="h-10 bg-muted rounded w-full" />
        <div className="h-10 bg-muted rounded w-full" />
        <div className="h-10 bg-muted rounded w-full" />
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}