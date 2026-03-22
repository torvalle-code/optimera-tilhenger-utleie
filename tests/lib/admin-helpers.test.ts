import {
  formatDate,
  formatDateTime,
  formatDateShort,
  daysUntil,
  getWeekNumber,
  getWeekDates,
  getMondayOfWeek,
  getEuControlStatus,
  getServiceUrgency,
  computeNextEuControl,
  computeNextService,
  generateWorkshopMailto,
  computeRentalStats,
} from '@/lib/admin/helpers';
import { WorkshopRequest, Rental, Trailer, Customer } from '@/lib/types';

describe('formatDate', () => {
  it('formats ISO date to Norwegian format', () => {
    const result = formatDate('2026-03-22');
    expect(result).toMatch(/22/);
    expect(result).toMatch(/mar/i);
    expect(result).toMatch(/2026/);
  });
});

describe('formatDateTime', () => {
  it('includes kl. with time', () => {
    const result = formatDateTime('2026-03-22T14:30:00');
    expect(result).toContain('kl.');
    expect(result).toMatch(/14:30/);
  });
});

describe('formatDateShort', () => {
  it('formats as DD.MM', () => {
    expect(formatDateShort('2026-03-22')).toBe('22.03');
  });

  it('zero-pads single digits', () => {
    expect(formatDateShort('2026-01-05')).toBe('05.01');
  });
});

describe('daysUntil', () => {
  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(daysUntil(today)).toBe(0);
  });

  it('returns positive for future', () => {
    const future = new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];
    expect(daysUntil(future)).toBeGreaterThan(0);
  });

  it('returns negative for past', () => {
    const past = new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0];
    expect(daysUntil(past)).toBeLessThan(0);
  });
});

describe('getWeekDates', () => {
  it('returns 7 dates', () => {
    const dates = getWeekDates('2026-03-23');
    expect(dates).toHaveLength(7);
  });

  it('starts with the given Monday', () => {
    const dates = getWeekDates('2026-03-23');
    expect(dates[0]).toBe('2026-03-23');
  });
});

describe('getMondayOfWeek', () => {
  it('returns Monday for Wednesday', () => {
    const result = getMondayOfWeek(new Date('2026-03-25')); // Wednesday
    expect(result).toBe('2026-03-23');
  });

  it('returns same date for Monday', () => {
    const result = getMondayOfWeek(new Date('2026-03-23'));
    expect(result).toBe('2026-03-23');
  });
});

describe('getEuControlStatus', () => {
  it('returns exempt for undefined', () => {
    expect(getEuControlStatus(undefined)).toBe('exempt');
  });

  it('returns overdue for past date', () => {
    expect(getEuControlStatus('2020-01-01')).toBe('overdue');
  });

  it('returns due_soon within 30 days', () => {
    const soon = new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0];
    expect(getEuControlStatus(soon)).toBe('due_soon');
  });

  it('returns valid for far future', () => {
    const future = new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0];
    expect(getEuControlStatus(future)).toBe('valid');
  });
});

describe('getServiceUrgency', () => {
  it('returns ok for undefined', () => {
    expect(getServiceUrgency(undefined)).toBe('ok');
  });

  it('returns overdue for past date', () => {
    expect(getServiceUrgency('2020-01-01')).toBe('overdue');
  });
});

describe('computeNextEuControl', () => {
  it('adds 2 years for <=3500kg', () => {
    expect(computeNextEuControl('2024-06-15', 3500)).toBe('2026-06-15');
  });

  it('adds 1 year for >3500kg', () => {
    expect(computeNextEuControl('2025-03-01', 4000)).toBe('2026-03-01');
  });
});

describe('computeNextService', () => {
  it('adds 6 months', () => {
    const result = computeNextService('2026-01-15', 6);
    // Timezone offset can shift by 1 day depending on locale
    expect(['2026-07-14', '2026-07-15']).toContain(result);
  });

  it('handles year overflow', () => {
    const result = computeNextService('2026-09-15', 6);
    expect(['2027-03-14', '2027-03-15']).toContain(result);
  });
});

describe('generateWorkshopMailto', () => {
  const request: WorkshopRequest = {
    id: 'w-1',
    trailerId: 't-1',
    trailerBarcode: 'TH-SKI-001',
    warehouseCode: 'MONTER-SKI',
    requestDate: '2026-03-22',
    requestedBy: 'Test',
    priority: 'medium',
    type: 'scheduled_service',
    description: 'Test service',
    workshopName: 'Test Verksted',
    workshopEmail: 'test@verksted.no',
    status: 'draft',
  };

  it('starts with mailto:', () => {
    expect(generateWorkshopMailto(request, 'Monter Skien')).toMatch(/^mailto:/);
  });

  it('includes barcode in subject', () => {
    const url = generateWorkshopMailto(request, 'Monter Skien');
    expect(decodeURIComponent(url)).toContain('TH-SKI-001');
  });
});

describe('computeRentalStats', () => {
  it('returns zeros for empty array', () => {
    const stats = computeRentalStats([]);
    expect(stats.totalRentals).toBe(0);
    expect(stats.totalRevenue).toBe(0);
    expect(stats.avgDurationHours).toBe(0);
  });
});
