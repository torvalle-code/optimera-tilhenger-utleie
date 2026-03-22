'use client';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { LoginGate } from '@/components/auth/LoginGate';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoginGate>{children}</LoginGate>
    </AuthProvider>
  );
}
