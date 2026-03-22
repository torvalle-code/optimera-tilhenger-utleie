'use client';

import { useState, useCallback } from 'react';
import { Trailer, Customer, Rental, DamageReport } from '@/lib/types';
import { useSyncQueue } from './useSyncQueue';
import { useOnlineStatus } from './useOnlineStatus';
import { findTrailerByBarcode, DEMO_FLEET } from '@/lib/fleet/trailers';
import { generateLocalRentalId, calculateDurationHours } from '@/lib/rental/rental-logic';
import { calculatePrice } from '@/lib/rental/pricing';

interface CreateRentalData {
  trailerId: string;
  trailer: Trailer;
  customer: Customer;
  pickupTime: string;
  returnTime: string;
  notes?: string;
}

interface UseSharefoxReturn {
  lookupByBarcode: (barcode: string) => Promise<Trailer | null>;
  getFleet: () => Promise<Trailer[]>;
  createRental: (data: CreateRentalData) => Promise<{ rental: Partial<Rental>; queued: boolean }>;
  confirmReturn: (rentalId: string, sharefoxOrderId: string, damage?: DamageReport) => Promise<{ success: boolean; queued: boolean }>;
  getActiveRentals: () => Promise<Rental[]>;
  searchCustomers: (query: string) => Promise<Customer[]>;
  loading: boolean;
  error: string | null;
}

export function useSharefox(): UseSharefoxReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToQueue } = useSyncQueue();
  const { isOnline } = useOnlineStatus();

  const lookupByBarcode = useCallback(
    async (barcode: string): Promise<Trailer | null> => {
      setLoading(true);
      setError(null);
      try {
        if (isOnline) {
          const res = await fetch(`/api/sharefox/inventory/barcode/${encodeURIComponent(barcode)}`);
          if (res.status === 404) {
            setLoading(false);
            return null;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const trailer = await res.json();
          setLoading(false);
          return trailer;
        }
        // Offline: fall back to cached/demo data
        const cached = findTrailerByBarcode(barcode);
        setLoading(false);
        return cached || null;
      } catch (err) {
        setError(String(err));
        // Fall back to demo data
        const cached = findTrailerByBarcode(barcode);
        setLoading(false);
        return cached || null;
      }
    },
    [isOnline]
  );

  const getFleet = useCallback(async (): Promise<Trailer[]> => {
    setLoading(true);
    setError(null);
    try {
      if (isOnline) {
        const res = await fetch('/api/sharefox/fleet');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const fleet = await res.json();
        setLoading(false);
        return fleet;
      }
      setLoading(false);
      return DEMO_FLEET;
    } catch {
      setLoading(false);
      return DEMO_FLEET;
    }
  }, [isOnline]);

  const createRental = useCallback(
    async (data: CreateRentalData): Promise<{ rental: Partial<Rental>; queued: boolean }> => {
      setLoading(true);
      setError(null);

      const durationHours = calculateDurationHours(data.pickupTime, data.returnTime);
      const price = calculatePrice(data.trailer.type, durationHours);

      const rental: Partial<Rental> = {
        id: generateLocalRentalId(),
        trailer: data.trailer,
        customer: data.customer,
        warehouseCode: data.trailer.warehouseCode,
        status: 'active',
        createdAt: new Date().toISOString(),
        pickupTime: data.pickupTime,
        actualPickup: data.pickupTime,
        returnTime: data.returnTime,
        durationHours,
        staffPickup: 'Terminal',
        notes: data.notes,
        totalPrice: price.totalPrice,
      };

      try {
        if (isOnline) {
          const res = await fetch('/api/sharefox/rentals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const result = await res.json();
            rental.sharefoxOrderId = result.sharefoxOrderId;
            rental.sharefoxBookingRef = result.sharefoxBookingRef;
            setLoading(false);
            return { rental, queued: false };
          }
          throw new Error(`HTTP ${res.status}`);
        }
        throw new Error('Offline');
      } catch {
        // Queue for later sync
        addToQueue('create_rental', rental as Record<string, unknown>);
        rental.sharefoxOrderId = '';
        rental.sharefoxBookingRef = '';
        setLoading(false);
        return { rental, queued: true };
      }
    },
    [isOnline, addToQueue]
  );

  const confirmReturn = useCallback(
    async (
      rentalId: string,
      sharefoxOrderId: string,
      damage?: DamageReport
    ): Promise<{ success: boolean; queued: boolean }> => {
      setLoading(true);
      setError(null);
      try {
        if (isOnline) {
          const res = await fetch('/api/sharefox/returns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rentalId, sharefoxOrderId, damage }),
          });
          if (res.ok) {
            setLoading(false);
            return { success: true, queued: false };
          }
          throw new Error(`HTTP ${res.status}`);
        }
        throw new Error('Offline');
      } catch {
        addToQueue('confirm_return', { rentalId, sharefoxOrderId, damage });
        setLoading(false);
        return { success: true, queued: true };
      }
    },
    [isOnline, addToQueue]
  );

  const getActiveRentals = useCallback(async (): Promise<Rental[]> => {
    setLoading(true);
    try {
      if (isOnline) {
        const res = await fetch('/api/sharefox/rentals?status=active');
        if (res.ok) {
          const rentals = await res.json();
          setLoading(false);
          return rentals;
        }
      }
      setLoading(false);
      return [];
    } catch {
      setLoading(false);
      return [];
    }
  }, [isOnline]);

  const searchCustomers = useCallback(
    async (query: string): Promise<Customer[]> => {
      if (!query.trim()) return [];
      setLoading(true);
      try {
        if (isOnline) {
          const res = await fetch(`/api/sharefox/customers?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const customers = await res.json();
            setLoading(false);
            return customers;
          }
        }
        setLoading(false);
        return [];
      } catch {
        setLoading(false);
        return [];
      }
    },
    [isOnline]
  );

  return {
    lookupByBarcode,
    getFleet,
    createRental,
    confirmReturn,
    getActiveRentals,
    searchCustomers,
    loading,
    error,
  };
}
