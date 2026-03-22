import { RentalStatus } from '../types';

const VALID_TRANSITIONS: Record<RentalStatus, RentalStatus[]> = {
  pending: ['active', 'cancelled'],
  active: ['overdue', 'returned', 'cancelled'],
  overdue: ['returned', 'cancelled'],
  returned: ['completed'],
  completed: [],
  cancelled: [],
};

/**
 * Check if a status transition is valid
 */
export function isValidTransition(from: RentalStatus, to: RentalStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Get allowed next statuses from current status
 */
export function getNextStatuses(current: RentalStatus): RentalStatus[] {
  return VALID_TRANSITIONS[current];
}

/**
 * Get display label for rental status (Norwegian)
 */
export function getStatusLabel(status: RentalStatus): string {
  const labels: Record<RentalStatus, string> = {
    pending: 'Venter på henting',
    active: 'Utleid',
    overdue: 'Forfalt',
    returned: 'Innlevert',
    completed: 'Fullført',
    cancelled: 'Kansellert',
  };
  return labels[status];
}

/**
 * Get status color class for UI rendering
 */
export function getStatusColor(status: RentalStatus): string {
  const colors: Record<RentalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    returned: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return colors[status];
}
