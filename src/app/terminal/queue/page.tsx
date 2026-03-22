'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { Button, Badge } from '@/components/ui';

export default function QueuePage() {
  const router = useRouter();

  // TODO: Read queue from IndexedDB via useSyncQueue hook

  return (
    <>
      <TerminalHeader warehouseName="Monter Skien" syncStatus="online" />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Synkroniseringsko</h1>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">Alt er synkronisert</p>
          <p className="text-green-600 text-sm mt-1">Ingen ventende operasjoner</p>
        </div>

        <div className="mt-auto pt-4">
          <Button size="terminal" variant="secondary" onClick={() => router.push('/terminal')}>
            Tilbake til start
          </Button>
        </div>
      </main>
    </>
  );
}
