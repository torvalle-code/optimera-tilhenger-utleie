import { PricingPeriod, PricingTier, PriceCalculation } from '../types';

/**
 * Default pricing tiers for trailers (NOK)
 * These will eventually come from Sharefox, but we start with defaults
 */
export const DEFAULT_PRICING: Record<string, PricingTier[]> = {
  open_750: [
    { period: 'hour', price: 0, currency: 'NOK' },    // Included in day
    { period: 'day', price: 350, currency: 'NOK' },
    { period: 'weekend', price: 500, currency: 'NOK' },
    { period: 'week', price: 1200, currency: 'NOK' },
  ],
  open_1300: [
    { period: 'hour', price: 0, currency: 'NOK' },
    { period: 'day', price: 500, currency: 'NOK' },
    { period: 'weekend', price: 700, currency: 'NOK' },
    { period: 'week', price: 1800, currency: 'NOK' },
  ],
  enclosed_750: [
    { period: 'hour', price: 0, currency: 'NOK' },
    { period: 'day', price: 450, currency: 'NOK' },
    { period: 'weekend', price: 650, currency: 'NOK' },
    { period: 'week', price: 1500, currency: 'NOK' },
  ],
  car_trailer: [
    { period: 'hour', price: 0, currency: 'NOK' },
    { period: 'day', price: 600, currency: 'NOK' },
    { period: 'weekend', price: 900, currency: 'NOK' },
    { period: 'week', price: 2500, currency: 'NOK' },
  ],
  flatbed: [
    { period: 'hour', price: 0, currency: 'NOK' },
    { period: 'day', price: 400, currency: 'NOK' },
    { period: 'weekend', price: 600, currency: 'NOK' },
    { period: 'week', price: 1400, currency: 'NOK' },
  ],
};

/**
 * Calculate the best price for a given duration
 */
export function calculatePrice(
  trailerType: string,
  durationHours: number,
  tiers?: PricingTier[]
): PriceCalculation {
  const pricingTiers = tiers || DEFAULT_PRICING[trailerType] || DEFAULT_PRICING['open_750'];
  const dayTier = pricingTiers.find((t) => t.period === 'day')!;
  const weekTier = pricingTiers.find((t) => t.period === 'week');
  const weekendTier = pricingTiers.find((t) => t.period === 'weekend');

  const days = Math.ceil(durationHours / 24);

  // Check if week pricing is better
  if (weekTier && days >= 5) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    const weekTotal = weeks * weekTier.price + remainingDays * dayTier.price;
    const straightDayTotal = days * dayTier.price;

    if (weekTotal < straightDayTotal) {
      return {
        basePeriod: 'week',
        quantity: weeks + (remainingDays > 0 ? remainingDays / 7 : 0),
        basePrice: weekTier.price,
        totalPrice: weekTotal,
        currency: weekTier.currency,
      };
    }
  }

  // Check weekend pricing (Fri 16:00 → Mon 09:00)
  if (weekendTier && days >= 2 && days <= 3) {
    if (weekendTier.price < days * dayTier.price) {
      return {
        basePeriod: 'weekend',
        quantity: 1,
        basePrice: weekendTier.price,
        totalPrice: weekendTier.price,
        currency: weekendTier.currency,
      };
    }
  }

  // Default to daily pricing
  return {
    basePeriod: 'day',
    quantity: days,
    basePrice: dayTier.price,
    totalPrice: days * dayTier.price,
    currency: dayTier.currency,
  };
}

/**
 * Format price for display in NOK
 */
export function formatPrice(amount: number, currency: string = 'NOK'): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
