/**
 * @jest-environment jsdom
 */

import {
  safeGetJSON,
  safeSetJSON,
  safeRemove,
  getRentalTrailer,
  setRentalTrailer,
  getRentalCustomer,
  setRentalCustomer,
  getRentalConfirmed,
  setRentalConfirmed,
  clearRentalFlow,
} from '@/lib/storage';
import { Trailer, Customer } from '@/lib/types';

const testTrailer: Trailer = {
  id: 'trailer-001',
  barcode: 'TH-SKI-001',
  name: 'Apen tilhenger 750 kg',
  type: 'open_750',
  maxWeight_kg: 750,
  dimensions: { lengthInner_cm: 205, widthInner_cm: 115, heightSides_cm: 35 },
  warehouseCode: 'MONTER-SKI',
  status: 'available',
  sharefoxProductId: 'sf-1',
  sharefoxInventoryId: 'sf-inv-1',
};

const testCustomer: Customer = {
  id: 'cust-001',
  type: 'proff',
  name: 'Nordmann Bygg AS',
  phone: '91234567',
  optimeraNr: '100234',
  driversLicense: true,
  idVerified: true,
};

beforeEach(() => {
  sessionStorage.clear();
});

describe('safeGetJSON', () => {
  it('returns null for missing key', () => {
    expect(safeGetJSON('nonexistent', sessionStorage)).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    sessionStorage.setItem('bad', 'not-json{{{');
    expect(safeGetJSON('bad', sessionStorage)).toBeNull();
  });

  it('returns parsed value for valid JSON', () => {
    sessionStorage.setItem('test', JSON.stringify({ a: 1 }));
    expect(safeGetJSON('test', sessionStorage)).toEqual({ a: 1 });
  });

  it('returns null when storage is null', () => {
    expect(safeGetJSON('key', null)).toBeNull();
  });
});

describe('safeSetJSON', () => {
  it('stores and retrieves correctly', () => {
    expect(safeSetJSON('key', { x: 42 }, sessionStorage)).toBe(true);
    expect(safeGetJSON('key', sessionStorage)).toEqual({ x: 42 });
  });

  it('returns false when storage is null', () => {
    expect(safeSetJSON('key', 'value', null)).toBe(false);
  });
});

describe('safeRemove', () => {
  it('removes existing key', () => {
    sessionStorage.setItem('key', 'value');
    safeRemove('key', sessionStorage);
    expect(sessionStorage.getItem('key')).toBeNull();
  });

  it('does not throw for missing key', () => {
    expect(() => safeRemove('nonexistent', sessionStorage)).not.toThrow();
  });
});

describe('getRentalTrailer / setRentalTrailer', () => {
  it('roundtrips valid trailer', () => {
    setRentalTrailer(testTrailer);
    expect(getRentalTrailer()).toEqual(testTrailer);
  });

  it('returns null for non-Trailer object in storage', () => {
    sessionStorage.setItem('rental_trailer', JSON.stringify({ foo: 'bar' }));
    expect(getRentalTrailer()).toBeNull();
  });

  it('returns null when empty', () => {
    expect(getRentalTrailer()).toBeNull();
  });
});

describe('getRentalCustomer / setRentalCustomer', () => {
  it('roundtrips valid customer', () => {
    setRentalCustomer(testCustomer);
    expect(getRentalCustomer()).toEqual(testCustomer);
  });

  it('returns null for invalid data', () => {
    sessionStorage.setItem('rental_customer', JSON.stringify({ name: 123 }));
    expect(getRentalCustomer()).toBeNull();
  });
});

describe('clearRentalFlow', () => {
  it('removes all 3 rental keys', () => {
    setRentalTrailer(testTrailer);
    setRentalCustomer(testCustomer);
    setRentalConfirmed({ id: 'r-1' });
    clearRentalFlow();
    expect(getRentalTrailer()).toBeNull();
    expect(getRentalCustomer()).toBeNull();
    expect(getRentalConfirmed()).toBeNull();
  });
});
