'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { RentalSummary } from '@/components/terminal/RentalSummary';
import { Button } from '@/components/ui';
import { Rental } from '@/lib/types';
import { isOverdue } from '@/lib/rental/rental-logic';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useSharefox } from '@/hooks/useSharefox';

export default function ActiveRentalsPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const { getActiveRentals, loading } = useSharefox();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getActiveRentals().then(setRentals);
  }, [getActiveRentals]);

  const sorted = [...rentals].sort((a, b) => {
    const aOv = isOverdue(a as Rental);
    const bOv = isOverdue(b as Rental);
    if (aOv && !bOv) return -1;
    if (!aOv && bOv) return 1;
    return new Date(a.returnTime).getTime() - new Date(b.returnTime).getTime();
  });

  return (
    <>
      <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center" aria-label="Tilbake">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Aktive utleier</h1>
          {rentals.length > 0 && (
            <span className="bg-[#E52629] text-white text-xs px-2 py-0.5 rounded-full">{rentals.length}</span>
          )}
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path d="M3 17h2m4 0h8m4 0h2M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Ingen aktive utleier</p>
            <p className="text-gray-400 text-sm mt-1">Alle tilhengere er tilgjengelige</p>
          </div>
        )}

        {!loading && sorted.map(rental => (
          <div
            key={rental.id}
            className={`rounded-xl border ${isOverdue(rental as Rental) ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'}`}
          >
            <button
              onClick={() => setExpandedId(expandedId === rental.id ? null : rental.id)}
              className="w-full text-left p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{rental.trailer?.name || 'Ukjent'}</p>
                  <p className="text-sm text-gray-500">{rental.customer?.name} — {rental.customer?.phone}</p>
                </div>
                {isOverdue(rental as Rental) && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                    Forfalt
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>Retur: {new Date(rental.returnTime).toLocaleString('nb-NO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </button>

            {expandedId === rental.id && (
              <div className="border-t border-gray-100 p-4">
                <RentalSummary rental={rental} showPrice />
              </div>
            )}
          </div>
        ))}

        <div className="mt-auto pt-4">
          <Button size="terminal" variant="secondary" onClick={() => router.push('/terminal')}>
            Tilbake til start
          </Button>
        </div>
      </main>
    </>
  );
}
