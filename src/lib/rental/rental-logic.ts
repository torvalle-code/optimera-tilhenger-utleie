import { Rental, RentalStatus, Customer, CustomerType } from '../types';

/**
 * Calculate rental duration in hours between two ISO date strings
 */
export function calculateDurationHours(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60));
}

/**
 * Calculate rental duration in full days (rounds up)
 */
export function calculateDurationDays(start: string, end: string): number {
  const hours = calculateDurationHours(start, end);
  return Math.ceil(hours / 24);
}

/**
 * Check if a rental period overlaps with an existing rental
 */
export function hasOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
): boolean {
  const ns = new Date(newStart).getTime();
  const ne = new Date(newEnd).getTime();
  const es = new Date(existingStart).getTime();
  const ee = new Date(existingEnd).getTime();
  return ns < ee && ne > es;
}

/**
 * Check if a trailer is available for a given period
 */
export function isTrailerAvailable(
  trailerId: string,
  start: string,
  end: string,
  activeRentals: Rental[]
): boolean {
  const trailerRentals = activeRentals.filter(
    (r) =>
      r.trailer.id === trailerId &&
      (r.status === 'active' || r.status === 'pending' || r.status === 'overdue')
  );
  return !trailerRentals.some((r) => hasOverlap(start, end, r.pickupTime, r.returnTime));
}

/**
 * Validate customer has required fields for rental
 */
export function validateCustomer(customer: Customer): string[] {
  const errors: string[] = [];
  if (!customer.name.trim()) errors.push('Kundenavn er påkrevd');
  if (!customer.phone.trim()) errors.push('Telefonnummer er påkrevd');
  if (customer.type === 'proff' && !customer.optimeraNr) {
    errors.push('Optimera-nummer er påkrevd for proff-kunder');
  }
  if (customer.type === 'privat' && !customer.kundeklubbNr) {
    errors.push('Kundeklubb-nummer er påkrevd for privatkunder');
  }
  return errors;
}

/**
 * Validate rental period
 */
export function validateRentalPeriod(start: string, end: string): string[] {
  const errors: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();

  if (isNaN(startDate.getTime())) errors.push('Ugyldig starttidspunkt');
  if (isNaN(endDate.getTime())) errors.push('Ugyldig returtidspunkt');
  if (endDate <= startDate) errors.push('Returtidspunkt må være etter utlevering');
  if (startDate < new Date(now.getTime() - 60 * 60 * 1000)) {
    errors.push('Utlevering kan ikke være mer enn 1 time i fortiden');
  }

  const maxDays = 30;
  const durationDays = calculateDurationDays(start, end);
  if (durationDays > maxDays) {
    errors.push(`Maksimal utleieperiode er ${maxDays} dager`);
  }

  return errors;
}

/**
 * Check if a rental is overdue
 */
export function isOverdue(rental: Rental): boolean {
  if (rental.status !== 'active') return false;
  return new Date() > new Date(rental.returnTime);
}

/**
 * Format duration for display
 */
export function formatDuration(hours: number): string {
  if (hours < 24) return `${hours} time${hours !== 1 ? 'r' : ''}`;
  const days = Math.ceil(hours / 24);
  return `${days} dag${days !== 1 ? 'er' : ''}`;
}

/**
 * Generate a local rental ID (for offline use)
 */
export function generateLocalRentalId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `local-${timestamp}-${random}`;
}
