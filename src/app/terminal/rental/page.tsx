'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { RentalSummary } from '@/components/terminal/RentalSummary';
import { Button, Input } from '@/components/ui';
import { Trailer, Customer, Rental } from '@/lib/types';
import { calculateDurationHours, validateRentalPeriod } from '@/lib/rental/rental-logic';
import { calculatePrice, formatPrice } from '@/lib/rental/pricing';
import { useSharefox } from '@/hooks/useSharefox';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { getRentalTrailer, getRentalCustomer, setRentalConfirmed } from '@/lib/storage';

export default function RentalConfirmPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const { createRental } = useSharefox();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('16:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [queuedBanner, setQueuedBanner] = useState(false);

  useEffect(() => {
    const storedTrailer = getRentalTrailer();
    const storedCustomer = getRentalCustomer();
    if (storedTrailer && storedCustomer) {
      setTrailer(storedTrailer);
      setCustomer(storedCustomer);
    } else {
      router.replace('/terminal/scan');
    }

    // Default return: today at 16:00
    const today = new Date();
    setReturnDate(today.toISOString().split('T')[0]);
  }, [router]);

  const plannedReturn = useMemo(() => {
    if (!returnDate || !returnTime) return '';
    return new Date(`${returnDate}T${returnTime}`).toISOString();
  }, [returnDate, returnTime]);

  const durationHours = useMemo(() => {
    if (!plannedReturn) return 0;
    // Use current time as pickup reference for preview
    return calculateDurationHours(new Date().toISOString(), plannedReturn);
  }, [plannedReturn]);

  const price = useMemo(() => {
    if (!trailer || durationHours <= 0) return null;
    return calculatePrice(trailer.type, durationHours);
  }, [trailer, durationHours]);

  const handleConfirm = async () => {
    if (!trailer || !customer || !plannedReturn) return;

    // FIX: capture pickupTime at confirm moment, NOT in useMemo
    const pickupTime = new Date().toISOString();

    // Validate rental period
    const periodErrors = validateRentalPeriod(pickupTime, plannedReturn);
    if (periodErrors.length > 0) {
      setValidationErrors(periodErrors);
      return;
    }
    setValidationErrors([]);

    setIsSubmitting(true);

    try {
      const result = await createRental({
        trailerId: trailer.id,
        trailer,
        customer,
        pickupTime,
        returnTime: plannedReturn,
        notes: notes.trim() || undefined,
      });

      // Store completed rental
      setRentalConfirmed(result.rental);

      if (result.queued) {
        setQueuedBanner(true);
        // Navigate after short delay so user sees banner
        setTimeout(() => {
          router.push('/terminal/checkout');
        }, 1500);
      } else {
        router.push('/terminal/checkout');
      }
    } catch {
      setValidationErrors(['Noe gikk galt. Prov igjen.']);
      setIsSubmitting(false);
    }
  };

  if (!trailer || !customer) return null;

  const rentalPreview: Partial<Rental> = {
    trailer,
    customer,
    pickupTime: new Date().toISOString(),
    returnTime: plannedReturn,
    durationHours,
    totalPrice: price?.totalPrice,
    notes: notes.trim() || undefined,
  };

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
          <h1 className="text-xl font-bold">Bekreft utleie</h1>
        </div>

        {/* Queued banner */}
        {queuedBanner && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center" role="alert">
            <p className="text-orange-800 font-medium">Lagret lokalt</p>
            <p className="text-orange-600 text-sm mt-1">
              Utleien er lagret og vil synkroniseres til Sharefox nar nett er tilgjengelig.
            </p>
          </div>
        )}

        <RentalSummary rental={rentalPreview} showPrice />

        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              label="Returdato"
              inputSize="terminal"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            <Input
              label="Klokkeslett"
              inputSize="terminal"
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          </div>

          <Input
            label="Merknad (valgfritt)"
            inputSize="terminal"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="F.eks. kundens bil, spesielle behov..."
          />
        </div>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1" role="alert">
            {validationErrors.map((err, i) => (
              <p key={i} className="text-red-700 text-sm">{err}</p>
            ))}
          </div>
        )}

        {price && (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Estimert pris</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatPrice(price.totalPrice)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {price.quantity} {price.basePeriod === 'day' ? 'dag(er)' : price.basePeriod} a {formatPrice(price.basePrice)}
            </p>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button
            size="terminal"
            variant="primary"
            onClick={handleConfirm}
            disabled={isSubmitting || durationHours <= 0}
            aria-label="Bekreft utleie"
          >
            {isSubmitting ? 'Oppretter utleie...' : 'Bekreft utleie'}
          </Button>
        </div>
      </main>
    </>
  );
}
