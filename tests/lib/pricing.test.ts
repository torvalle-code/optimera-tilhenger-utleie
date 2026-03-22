import { calculatePrice, formatPrice, DEFAULT_PRICING } from '@/lib/rental/pricing';

describe('calculatePrice', () => {
  it('calculates 1-day rental for open_750', () => {
    const result = calculatePrice('open_750', 8); // 8 hours = 1 day
    expect(result.basePeriod).toBe('day');
    expect(result.quantity).toBe(1);
    expect(result.totalPrice).toBe(350);
    expect(result.currency).toBe('NOK');
  });

  it('uses weekend pricing for 3-day rental when cheaper', () => {
    const result = calculatePrice('open_750', 72); // 3 days → weekend is 500 < 3*350=1050
    expect(result.basePeriod).toBe('weekend');
    expect(result.totalPrice).toBe(500);
  });

  it('uses weekend pricing for 2-day (25h) rental when cheaper', () => {
    const result = calculatePrice('open_750', 25); // 25h = 2 days → weekend is 500 < 2*350=700
    expect(result.basePeriod).toBe('weekend');
    expect(result.totalPrice).toBe(500);
  });

  it('uses week pricing when cheaper for 7 days', () => {
    const result = calculatePrice('open_750', 168); // 7 days
    expect(result.basePeriod).toBe('week');
    expect(result.totalPrice).toBe(1200); // week price, not 7*350=2450
  });

  it('uses weekend pricing for 2-day rental when cheaper', () => {
    const result = calculatePrice('open_750', 48); // 2 days
    expect(result.basePeriod).toBe('weekend');
    expect(result.totalPrice).toBe(500); // weekend price, not 2*350=700
  });

  it('calculates open_1300 pricing', () => {
    const result = calculatePrice('open_1300', 24); // 1 day
    expect(result.totalPrice).toBe(500);
  });

  it('falls back to open_750 for unknown type', () => {
    const result = calculatePrice('unknown_type', 24);
    expect(result.totalPrice).toBe(350);
  });
});

describe('formatPrice', () => {
  it('formats NOK correctly', () => {
    const formatted = formatPrice(1200);
    // Norwegian number format varies by locale, but should contain 1200 and kr
    expect(formatted).toMatch(/1[\s\u00a0.]?200/);
  });

  it('formats zero', () => {
    const formatted = formatPrice(0);
    expect(formatted).toMatch(/0/);
  });
});
