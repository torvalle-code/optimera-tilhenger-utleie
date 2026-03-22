import { isTrailer, isCustomer, isRental, isQueueItem } from '@/lib/type-guards';

describe('isTrailer', () => {
  const valid = {
    id: 't-1', barcode: 'TH-001', name: 'Test', type: 'open_750',
    maxWeight_kg: 750, warehouseCode: 'W1', status: 'available',
    sharefoxProductId: 'sf-1', sharefoxInventoryId: 'sf-inv-1',
    dimensions: { lengthInner_cm: 200, widthInner_cm: 100, heightSides_cm: 30 },
  };

  it('returns true for valid Trailer', () => {
    expect(isTrailer(valid)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isTrailer(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isTrailer(undefined)).toBe(false);
  });

  it('returns false for string', () => {
    expect(isTrailer('not a trailer')).toBe(false);
  });

  it('returns false for missing id', () => {
    const { id, ...rest } = valid;
    expect(isTrailer(rest)).toBe(false);
  });

  it('returns false for missing dimensions', () => {
    const { dimensions, ...rest } = valid;
    expect(isTrailer(rest)).toBe(false);
  });

  it('returns false for wrong type on maxWeight_kg', () => {
    expect(isTrailer({ ...valid, maxWeight_kg: '750' })).toBe(false);
  });
});

describe('isCustomer', () => {
  const valid = {
    id: 'c-1', type: 'proff', name: 'Test AS', phone: '12345678',
    driversLicense: true, idVerified: true,
  };

  it('returns true for valid Customer', () => {
    expect(isCustomer(valid)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isCustomer(null)).toBe(false);
  });

  it('returns false for invalid type', () => {
    expect(isCustomer({ ...valid, type: 'invalid' })).toBe(false);
  });

  it('returns false for missing name', () => {
    const { name, ...rest } = valid;
    expect(isCustomer(rest)).toBe(false);
  });

  it('accepts privat type', () => {
    expect(isCustomer({ ...valid, type: 'privat' })).toBe(true);
  });

  it('accepts guest type', () => {
    expect(isCustomer({ ...valid, type: 'guest' })).toBe(true);
  });
});

describe('isRental', () => {
  const valid = {
    id: 'r-1', status: 'active', warehouseCode: 'W1',
    createdAt: '2026-01-01', pickupTime: '2026-01-01',
    returnTime: '2026-01-02', durationHours: 24,
  };

  it('returns true for valid Rental', () => {
    expect(isRental(valid)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isRental(null)).toBe(false);
  });

  it('returns false for missing durationHours', () => {
    const { durationHours, ...rest } = valid;
    expect(isRental(rest)).toBe(false);
  });
});

describe('isQueueItem', () => {
  const valid = {
    id: 'q-1', action: 'create_rental', createdAt: '2026-01-01',
    status: 'pending', retryCount: 0, payload: {},
  };

  it('returns true for valid QueueItem', () => {
    expect(isQueueItem(valid)).toBe(true);
  });

  it('returns false for missing retryCount', () => {
    const { retryCount, ...rest } = valid;
    expect(isQueueItem(rest)).toBe(false);
  });
});
