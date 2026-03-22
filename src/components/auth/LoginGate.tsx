'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Input } from '@/components/ui';
import { WAREHOUSES } from '@/lib/constants';

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { user, loading, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101920] flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Laster...</div>
      </div>
    );
  }

  if (user) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(username, password);
    if (!result.success) setError(result.error || 'Feil brukernavn eller passord');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#101920] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E52629] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h1 className="text-white text-xl font-bold">Optimera Tilhengerutleie</h1>
          <p className="text-gray-400 text-sm mt-1">Logg inn for a fortsette</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 space-y-4">
          <Input
            label="Brukernavn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Brukernavn"
            autoFocus
            autoComplete="username"
          />
          <Input
            label="Passord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            autoComplete="current-password"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full"
            disabled={isSubmitting || !username || !password}
          >
            {isSubmitting ? 'Logger inn...' : 'Logg inn'}
          </Button>
        </form>

        {/* Quick links */}
        <div className="mt-6">
          <p className="text-gray-500 text-xs text-center mb-3">Hurtiglenker etter innlogging</p>
          <div className="grid grid-cols-2 gap-2">
            {WAREHOUSES.map((wh) => (
              <div key={wh.code} className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-white text-xs font-medium">{wh.name}</p>
                <p className="text-gray-500 text-[10px]">{wh.code}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
