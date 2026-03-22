'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { ScanInput } from '@/components/terminal/ScanInput';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { Button, Toggle } from '@/components/ui';
import { Trailer } from '@/lib/types';
import { findTrailerByBarcode } from '@/lib/fleet/trailers';

export default function ReturnPage() {
  const router = useRouter();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasDamage, setHasDamage] = useState(false);
  const [damageNotes, setDamageNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScan = useCallback((barcode: string) => {
    setError(null);
    const found = findTrailerByBarcode(barcode);
    if (!found) {
      setError(`Fant ingen tilhenger med strekkode "${barcode}"`);
      return;
    }
    if (found.status !== 'rented') {
      setError('Denne tilhengeren er ikke registrert som utleid');
      setTrailer(found);
      return;
    }
    setTrailer(found);
  }, []);

  const handleReturn = async () => {
    if (!trailer) return;
    setIsSubmitting(true);

    // TODO: Call Sharefox API to close booking / add to offline queue

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    // Show success and redirect
    router.push('/terminal');
  };

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
          <h1 className="text-xl font-bold">Innlevering</h1>
        </div>

        <ScanInput onScan={handleScan} placeholder="Skann tilhenger for innlevering..." />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {trailer && trailer.status === 'rented' && (
          <>
            <TrailerCard trailer={trailer} />

            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <Toggle
                label="Skade pa tilhengeren?"
                checked={hasDamage}
                onChange={setHasDamage}
              />

              {hasDamage && (
                <textarea
                  className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg text-base
                    focus:outline-none focus:ring-2 focus:ring-[#E52629]"
                  placeholder="Beskriv skaden..."
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                />
              )}
            </div>

            <div className="mt-auto pt-4">
              <Button
                size="terminal"
                variant="primary"
                onClick={handleReturn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrerer innlevering...' : 'Bekreft innlevering'}
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
