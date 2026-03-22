'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { ScanInput } from '@/components/terminal/ScanInput';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { Button } from '@/components/ui';
import { useSharefox } from '@/hooks/useSharefox';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { setRentalTrailer } from '@/lib/storage';
import { Trailer } from '@/lib/types';

export default function ScanPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const { lookupByBarcode, loading: sfLoading } = useSharefox();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = useCallback(async (barcode: string) => {
    setError(null);
    setScanning(true);
    try {
      const found = await lookupByBarcode(barcode);
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
    } finally {
      setScanning(false);
    }
  }, [lookupByBarcode]);

  const handleContinue = () => {
    if (trailer && trailer.status === 'available') {
      setRentalTrailer(trailer);
      router.push('/terminal/customer');
    }
  };

  const isLoading = scanning || sfLoading;

  return (
    <>
      <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="touch-target flex items-center justify-center"
            aria-label="Tilbake"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Ny utleie</h1>
        </div>

        <ScanInput onScan={handleScan} placeholder="Skann tilhenger strekkode..." />

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-[#E52629] rounded-full" />
            <span className="ml-2 text-sm text-gray-500">Soker...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {trailer && (
          <>
            <TrailerCard trailer={trailer} />

            {trailer.status === 'available' && (
              <Button size="terminal" variant="primary" onClick={handleContinue} aria-label="Fortsett til kundeidentifisering">
                Fortsett — Identifiser kunde
              </Button>
            )}
          </>
        )}

        {/* Quick test buttons for demo */}
        {!trailer && !isLoading && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Hurtigtest (demo)</p>
            {['TH-SKI-001', 'TH-SKI-002', 'TH-SKI-003', 'TH-SKI-004'].map((code) => (
              <button
                key={code}
                onClick={() => handleScan(code)}
                className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                aria-label={`Test med strekkode ${code}`}
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
