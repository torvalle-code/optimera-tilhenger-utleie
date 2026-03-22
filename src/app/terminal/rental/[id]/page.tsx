'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { RentalSummary } from '@/components/terminal/RentalSummary';
import { Button } from '@/components/ui';
import { Rental } from '@/lib/types';
import { getRentalConfirmed, clearRentalFlow } from '@/lib/storage';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export default function RentalReceiptPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const [rental, setRental] = useState<Partial<Rental> | null>(null);

  useEffect(() => {
    const stored = getRentalConfirmed();
    if (stored) {
      setRental(stored);
    }
  }, []);

  const isSynced = rental?.sharefoxOrderId ? true : false;

  if (!rental) {
    return (
      <>
        <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500">Ingen utleie funnet</p>
          <Button size="terminal" variant="primary" className="mt-4" onClick={() => router.push('/terminal')} aria-label="Tilbake til start">
            Tilbake til start
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        {/* Success banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-green-800">Utleie bekreftet!</h1>
          <p className="text-sm text-green-600 mt-1">
            Ordrenr: {rental.id}
          </p>
        </div>

        {/* Sync status badge */}
        {isSynced ? (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2" role="status">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-green-800 text-sm font-medium">Synkronisert &#x2713;</span>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 flex items-center gap-2" role="status">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-800 text-sm font-medium">Venter pa synkronisering &#x23F3;</span>
          </div>
        )}

        <RentalSummary rental={rental} showPrice />

        <div className="mt-auto space-y-3 pt-4">
          <Button
            size="terminal"
            variant="primary"
            onClick={() => {
              clearRentalFlow();
              router.push('/terminal/scan');
            }}
            aria-label="Start ny utleie"
          >
            Ny utleie
          </Button>

          <Button
            size="terminal"
            variant="secondary"
            onClick={() => {
              clearRentalFlow();
              router.push('/terminal');
            }}
            aria-label="Tilbake til startskjerm"
          >
            Tilbake til start
          </Button>
        </div>
      </main>
    </>
  );
}
