'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { Button } from '@/components/ui';

export default function TerminalHomePage() {
  const router = useRouter();
  const [syncStatus] = useState<'online' | 'syncing' | 'offline'>('online');

  return (
    <>
      <TerminalHeader
        warehouseName="Monter Skien"
        syncStatus={syncStatus}
        queueCount={0}
      />

      <main className="flex-1 flex flex-col p-4 gap-4">
        {/* Primary action */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <Button
            size="terminal"
            variant="primary"
            onClick={() => router.push('/terminal/scan')}
          >
            <span className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                <line x1="7" y1="12" x2="17" y2="12" />
              </svg>
              Ny utleie — Skann tilhenger
            </span>
          </Button>

          <Button
            size="terminal"
            variant="secondary"
            onClick={() => router.push('/terminal/return')}
          >
            <span className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Innlevering
            </span>
          </Button>
        </div>

        {/* Secondary actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-between"
            onClick={() => {/* TODO: active rentals list */}}
          >
            <span>Aktive utleier</span>
            <span className="text-gray-400">→</span>
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-between"
            onClick={() => router.push('/terminal/queue')}
          >
            <span>Synkroniseringsko</span>
            <span className="text-gray-400">→</span>
          </Button>
        </div>
      </main>
    </>
  );
}
