'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { Button } from '@/components/ui';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export default function TerminalHomePage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();

  return (
    <>
      <TerminalHeader
        warehouseName={warehouse.name}
        syncStatus={syncStatus}
        queueCount={pendingCount}
      />

      <main className="flex-1 flex flex-col p-4 gap-4">
        {/* Primary action */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <Button
            size="terminal"
            variant="primary"
            onClick={() => router.push('/terminal/scan')}
            aria-label="Start ny utleie ved a skanne tilhenger"
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
            aria-label="Registrer innlevering av tilhenger"
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
            onClick={() => router.push('/terminal/rentals')}
            aria-label="Vis aktive utleier"
          >
            <span>Aktive utleier</span>
            <span className="text-gray-400">&rarr;</span>
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-between"
            onClick={() => router.push('/terminal/queue')}
            aria-label="Vis synkroniseringsko"
          >
            <span>Synkroniseringsko</span>
            {pendingCount > 0 && (
              <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
            <span className="text-gray-400">&rarr;</span>
          </Button>
        </div>
      </main>
    </>
  );
}
