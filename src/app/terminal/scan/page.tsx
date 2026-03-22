'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { ScanInput } from '@/components/terminal/ScanInput';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { Button } from '@/components/ui';
import { findTrailerByBarcode } from '@/lib/fleet/trailers';
import { Trailer } from '@/lib/types';

export default function ScanPage() {
  const router = useRouter();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus] = useState<'online' | 'syncing' | 'offline'>('online');

  const handleScan = useCallback((barcode: string) => {
    setError(null);
    const found = findTrailerByBarcode(barcode);
    if (!found) {
      setError(`Fant ingen tilhenger med strekkode "${barcode}"`);
      setTrailer(null);
      return;
    }
    if (found.status === 'rented') {
      setError('Denne tilhengeren er allerede utleid');
      setTrailer(found);
      return;
    }
    if (found.status === 'maintenance') {
      setError('Denne tilhengeren er under vedlikehold');
      setTrailer(found);
      return;
    }
    setTrailer(found);
  }, []);

  const handleContinue = () => {
    if (trailer && trailer.status === 'available') {
      // Store trailer in sessionStorage for the next step
      sessionStorage.setItem('rental_trailer', JSON.stringify(trailer));
      router.push('/terminal/customer');
    }
  };

  return (
    <>
      <TerminalHeader warehouseName="Monter Skien" syncStatus={syncStatus} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="touch-target flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Ny utleie</h1>
        </div>

        <ScanInput onScan={handleScan} placeholder="Skann tilhenger strekkode..." />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {trailer && (
          <>
            <TrailerCard trailer={trailer} />

            {trailer.status === 'available' && (
              <Button size="terminal" variant="primary" onClick={handleContinue}>
                Fortsett — Identifiser kunde
              </Button>
            )}
          </>
        )}

        {/* Quick test buttons for demo */}
        {!trailer && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Hurtigtest (demo)</p>
            {['TH-SKI-001', 'TH-SKI-002', 'TH-SKI-003', 'TH-SKI-004'].map((code) => (
              <button
                key={code}
                onClick={() => handleScan(code)}
                className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
