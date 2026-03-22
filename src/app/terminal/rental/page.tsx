'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { RentalSummary } from '@/components/terminal/RentalSummary';
import { Button, Input } from '@/components/ui';
import { Trailer, Customer, Rental } from '@/lib/types';
import { calculateDurationHours, generateLocalRentalId } from '@/lib/rental/rental-logic';
import { calculatePrice, formatPrice } from '@/lib/rental/pricing';

export default function RentalConfirmPage() {
  const router = useRouter();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('16:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedTrailer = sessionStorage.getItem('rental_trailer');
    const storedCustomer = sessionStorage.getItem('rental_customer');
    if (storedTrailer && storedCustomer) {
      setTrailer(JSON.parse(storedTrailer));
      setCustomer(JSON.parse(storedCustomer));
    } else {
      router.replace('/terminal/scan');
    }

    // Default return: today at 16:00
    const today = new Date();
    setReturnDate(today.toISOString().split('T')[0]);
  }, [router]);

  const pickupTime = useMemo(() => new Date().toISOString(), []);

  const plannedReturn = useMemo(() => {
    if (!returnDate || !returnTime) return '';
    return new Date(`${returnDate}T${returnTime}`).toISOString();
  }, [returnDate, returnTime]);

  const durationHours = useMemo(() => {
    if (!plannedReturn) return 0;
    return calculateDurationHours(pickupTime, plannedReturn);
  }, [pickupTime, plannedReturn]);

  const price = useMemo(() => {
    if (!trailer || durationHours <= 0) return null;
    return calculatePrice(trailer.type, durationHours);
  }, [trailer, durationHours]);

  const handleConfirm = async () => {
    if (!trailer || !customer || !plannedReturn) return;

    setIsSubmitting(true);

    const rental: Partial<Rental> = {
      id: generateLocalRentalId(),
      sharefoxOrderId: '',
      sharefoxBookingRef: '',
      trailer,
      customer,
      warehouseCode: trailer.warehouseCode,
      status: 'active',
      createdAt: new Date().toISOString(),
      pickupTime,
      actualPickup: pickupTime,
      returnTime: plannedReturn,
      durationHours,
      staffPickup: 'Terminal',
      notes: notes.trim() || undefined,
      totalPrice: price?.totalPrice,
    };

    // Store completed rental
    sessionStorage.setItem('rental_confirmed', JSON.stringify(rental));

    // TODO: Send to Sharefox via BFF API / add to offline queue

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    router.push(`/terminal/rental/${rental.id}`);
  };

  if (!trailer || !customer) return null;

  const rentalPreview: Partial<Rental> = {
    trailer,
    customer,
    pickupTime,
    returnTime: plannedReturn,
    durationHours,
    totalPrice: price?.totalPrice,
    notes: notes.trim() || undefined,
  };

  return (
    <>
      <TerminalHeader warehouseName="Monter Skien" syncStatus="online" />

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Bekreft utleie</h1>
        </div>

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
          >
            {isSubmitting ? 'Oppretter utleie...' : 'Bekreft utleie'}
          </Button>
        </div>
      </main>
    </>
  );
}
