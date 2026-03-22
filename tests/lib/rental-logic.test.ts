import {
  calculateDurationHours,
  calculateDurationDays,
  hasOverlap,
  isTrailerAvailable,
  validateCustomer,
  validateRentalPeriod,
  isOverdue,
  formatDuration,
  generateLocalRentalId,
} from '@/lib/rental/rental-logic';
import { Customer, Rental, Trailer } from '@/lib/types';

// ========================
// TEST DATA
// ========================

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

const testCustomerProff: Customer = {
  id: 'cust-001',
  type: 'proff',
  name: 'Nordmann Bygg AS',
  phone: '91234567',
  optimeraNr: '100234',
  companyName: 'Nordmann Bygg AS',
  driversLicense: true,
  idVerified: true,
};

// ========================
// DURATION TESTS
// ========================

describe('calculateDurationHours', () => {
  it('calculates hours between two timestamps', () => {
    const start = '2026-03-21T08:00:00Z';
    const end = '2026-03-21T16:00:00Z';
    expect(calculateDurationHours(start, end)).toBe(8);
  });

  it('rounds up partial hours', () => {
    const start = '2026-03-21T08:00:00Z';
    const end = '2026-03-21T08:30:00Z';
    expect(calculateDurationHours(start, end)).toBe(1);
  });

  it('returns 0 for negative duration', () => {
    const start = '2026-03-21T16:00:00Z';
    const end = '2026-03-21T08:00:00Z';
    expect(calculateDurationHours(start, end)).toBe(0);
  });

  it('handles multi-day periods', () => {
    const start = '2026-03-21T08:00:00Z';
    const end = '2026-03-23T08:00:00Z';
    expect(calculateDurationHours(start, end)).toBe(48);
  });
});

describe('calculateDurationDays', () => {
  it('rounds up to full days', () => {
    const start = '2026-03-21T08:00:00Z';
    const end = '2026-03-21T16:00:00Z';
    expect(calculateDurationDays(start, end)).toBe(1);
  });

  it('2 full days', () => {
    const start = '2026-03-21T08:00:00Z';
    const end = '2026-03-23T08:00:00Z';
    expect(calculateDurationDays(start, end)).toBe(2);
  });

  it('rounds up 25 hours to 2 days', () => {
    const start = '2026-03-21T08:00:00Z';
    const end = '2026-03-22T09:00:00Z';
    expect(calculateDurationDays(start, end)).toBe(2);
  });
});

// ========================
// OVERLAP TESTS
// ========================

describe('hasOverlap', () => {
  it('detects overlapping periods', () => {
    expect(hasOverlap(
      '2026-03-21T08:00:00Z', '2026-03-21T16:00:00Z',
      '2026-03-21T12:00:00Z', '2026-03-21T20:00:00Z'
    )).toBe(true);
  });

  it('no overlap when periods are adjacent', () => {
    expect(hasOverlap(
      '2026-03-21T08:00:00Z', '2026-03-21T12:00:00Z',
      '2026-03-21T12:00:00Z', '2026-03-21T16:00:00Z'
    )).toBe(false);
  });

  it('detects containment', () => {
    expect(hasOverlap(
      '2026-03-21T10:00:00Z', '2026-03-21T14:00:00Z',
      '2026-03-21T08:00:00Z', '2026-03-21T16:00:00Z'
    )).toBe(true);
  });

  it('no overlap when completely separate', () => {
    expect(hasOverlap(
      '2026-03-21T08:00:00Z', '2026-03-21T10:00:00Z',
      '2026-03-22T08:00:00Z', '2026-03-22T10:00:00Z'
    )).toBe(false);
  });
});

describe('isTrailerAvailable', () => {
  const activeRental: Rental = {
    id: 'r-1',
    sharefoxOrderId: 'sf-1',
    sharefoxBookingRef: 'ref-1',
    trailer: testTrailer,
    customer: testCustomerProff,
    warehouseCode: 'MONTER-SKI',
    status: 'active',
    createdAt: '2026-03-21T08:00:00Z',
    pickupTime: '2026-03-21T08:00:00Z',
    returnTime: '2026-03-21T16:00:00Z',
    durationHours: 8,
  };

  it('returns true when no active rentals', () => {
    expect(isTrailerAvailable(
      'trailer-001', '2026-03-21T08:00:00Z', '2026-03-21T16:00:00Z', []
    )).toBe(true);
  });

  it('returns false when period overlaps active rental', () => {
    expect(isTrailerAvailable(
      'trailer-001', '2026-03-21T10:00:00Z', '2026-03-21T18:00:00Z', [activeRental]
    )).toBe(false);
  });

  it('returns true when period does not overlap', () => {
    expect(isTrailerAvailable(
      'trailer-001', '2026-03-22T08:00:00Z', '2026-03-22T16:00:00Z', [activeRental]
    )).toBe(true);
  });

  it('ignores cancelled rentals', () => {
    const cancelled = { ...activeRental, status: 'cancelled' as const };
    expect(isTrailerAvailable(
      'trailer-001', '2026-03-21T10:00:00Z', '2026-03-21T18:00:00Z', [cancelled]
    )).toBe(true);
  });
});

// ========================
// VALIDATION TESTS
// ========================

describe('validateCustomer', () => {
  it('passes for valid proff customer', () => {
    expect(validateCustomer(testCustomerProff)).toEqual([]);
  });

  it('fails when proff customer missing optimeraNr', () => {
    const invalid = { ...testCustomerProff, optimeraNr: undefined };
    const errors = validateCustomer(invalid);
    expect(errors).toContain('Optimera-nummer er påkrevd for proff-kunder');
  });

  it('fails when name is empty', () => {
    const invalid = { ...testCustomerProff, name: '' };
    expect(validateCustomer(invalid).length).toBeGreaterThan(0);
  });

  it('fails when phone is empty', () => {
    const invalid = { ...testCustomerProff, phone: '' };
    expect(validateCustomer(invalid).length).toBeGreaterThan(0);
  });

  it('requires kundeklubbNr for privat', () => {
    const privat: Customer = {
      ...testCustomerProff,
      type: 'privat',
      optimeraNr: undefined,
      kundeklubbNr: undefined,
    };
    const errors = validateCustomer(privat);
    expect(errors).toContain('Kundeklubb-nummer er påkrevd for privatkunder');
  });
});

describe('validateRentalPeriod', () => {
  it('passes for valid future period', () => {
    const start = new Date(Date.now() + 60000).toISOString();
    const end = new Date(Date.now() + 3600000 * 8).toISOString();
    expect(validateRentalPeriod(start, end)).toEqual([]);
  });

  it('fails when end is before start', () => {
    const start = '2026-03-21T16:00:00Z';
    const end = '2026-03-21T08:00:00Z';
    const errors = validateRentalPeriod(start, end);
    expect(errors).toContain('Returtidspunkt må være etter utlevering');
  });

  it('fails for > 30 days', () => {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 3600000 * 24 * 35).toISOString();
    const errors = validateRentalPeriod(start, end);
    expect(errors.some(e => e.includes('30 dager'))).toBe(true);
  });
});

// ========================
// UTILITY TESTS
// ========================

describe('formatDuration', () => {
  it('formats hours', () => {
    expect(formatDuration(5)).toBe('5 timer');
  });

  it('formats single hour', () => {
    expect(formatDuration(1)).toBe('1 time');
  });

  it('formats days', () => {
    expect(formatDuration(48)).toBe('2 dager');
  });

  it('formats single day', () => {
    expect(formatDuration(24)).toBe('1 dag');
  });

  it('rounds up to days for > 24 hours', () => {
    expect(formatDuration(25)).toBe('2 dager');
  });
});

describe('generateLocalRentalId', () => {
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateLocalRentalId()));
    expect(ids.size).toBe(100);
  });

  it('starts with "local-"', () => {
    expect(generateLocalRentalId()).toMatch(/^local-/);
  });
});

describe('isOverdue', () => {
  it('returns true for active rental past return time', () => {
    const rental: Rental = {
      id: 'r-1',
      sharefoxOrderId: 'sf-1',
      sharefoxBookingRef: 'ref-1',
      trailer: testTrailer,
      customer: testCustomerProff,
      warehouseCode: 'MONTER-SKI',
      status: 'active',
      createdAt: '2020-01-01T00:00:00Z',
      pickupTime: '2020-01-01T00:00:00Z',
      returnTime: '2020-01-01T16:00:00Z',
      durationHours: 16,
    };
    expect(isOverdue(rental)).toBe(true);
  });

  it('returns false for non-active rental', () => {
    const rental: Rental = {
      id: 'r-2',
      sharefoxOrderId: 'sf-1',
      sharefoxBookingRef: 'ref-1',
      trailer: testTrailer,
      customer: testCustomerProff,
      warehouseCode: 'MONTER-SKI',
      status: 'completed',
      createdAt: '2020-01-01T00:00:00Z',
      pickupTime: '2020-01-01T00:00:00Z',
      returnTime: '2020-01-01T16:00:00Z',
      durationHours: 16,
    };
    expect(isOverdue(rental)).toBe(false);
  });
});
