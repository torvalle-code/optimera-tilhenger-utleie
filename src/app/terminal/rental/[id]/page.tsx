'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { RentalSummary } from '@/components/terminal/RentalSummary';
import { Button } from '@/components/ui';
import { Rental } from '@/lib/types';

export default function RentalReceiptPage() {
  const router = useRouter();
  const [rental, setRental] = useState<Partial<Rental> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('rental_confirmed');
    if (stored) {
      setRental(JSON.parse(stored));
      // Clean up session after displaying
      sessionStorage.removeItem('rental_trailer');
      sessionStorage.removeItem('rental_customer');
    }
  }, []);

  if (!rental) {
    return (
      <>
        <TerminalHeader warehouseName="Monter Skien" syncStatus="online" />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500">Ingen utleie funnet</p>
          <Button size="terminal" variant="primary" className="mt-4" onClick={() => router.push('/terminal')}>
            Tilbake til start
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <TerminalHeader warehouseName="Monter Skien" syncStatus="online" />

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

        <RentalSummary rental={rental} showPrice />

        <div className="mt-auto space-y-3 pt-4">
          <Button
            size="terminal"
            variant="primary"
            onClick={() => {
              sessionStorage.removeItem('rental_confirmed');
              router.push('/terminal/scan');
            }}
          >
            Ny utleie
          </Button>

          <Button
            size="terminal"
            variant="secondary"
            onClick={() => {
              sessionStorage.removeItem('rental_confirmed');
              router.push('/terminal');
            }}
          >
            Tilbake til start
          </Button>
        </div>
      </main>
    </>
  );
}
