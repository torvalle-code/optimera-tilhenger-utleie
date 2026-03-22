import { Trailer, Customer, Rental } from './types';
import { isTrailer, isCustomer } from './type-guards';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function safeGetJSON<T>(key: string, storage?: Storage | null): T | null {
  try {
    const s = storage !== undefined ? storage : getStorage();
    if (!s) return null;
    const raw = s.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function safeSetJSON<T>(key: string, value: T, storage?: Storage | null): boolean {
  try {
    const s = storage !== undefined ? storage : getStorage();
    if (!s) return false;
    s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string, storage?: Storage | null): void {
  try {
    const s = storage !== undefined ? storage : getStorage();
    s?.removeItem(key);
  } catch {
    // Ignore
  }
}

// Typed rental flow storage
const KEYS = {
  trailer: 'rental_trailer',
  customer: 'rental_customer',
  confirmed: 'rental_confirmed',
} as const;

export function getRentalTrailer(): Trailer | null {
  const data = safeGetJSON<Trailer>(KEYS.trailer);
  if (data && isTrailer(data)) return data;
  return null;
}

export function setRentalTrailer(trailer: Trailer): void {
  safeSetJSON(KEYS.trailer, trailer);
}

export function getRentalCustomer(): Customer | null {
  const data = safeGetJSON<Customer>(KEYS.customer);
  if (data && isCustomer(data)) return data;
  return null;
}

export function setRentalCustomer(customer: Customer): void {
  safeSetJSON(KEYS.customer, customer);
}

export function getRentalConfirmed(): Partial<Rental> | null {
  return safeGetJSON<Partial<Rental>>(KEYS.confirmed);
}

export function setRentalConfirmed(rental: Partial<Rental>): void {
  safeSetJSON(KEYS.confirmed, rental);
}

export function clearRentalFlow(): void {
  safeRemove(KEYS.trailer);
  safeRemove(KEYS.customer);
  safeRemove(KEYS.confirmed);
}
