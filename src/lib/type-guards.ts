import { Trailer, Customer, Rental, QueueItem } from './types';

export function isTrailer(obj: unknown): obj is Trailer {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.barcode === 'string' &&
    typeof o.name === 'string' &&
    typeof o.type === 'string' &&
    typeof o.maxWeight_kg === 'number' &&
    typeof o.warehouseCode === 'string' &&
    typeof o.status === 'string' &&
    typeof o.sharefoxProductId === 'string' &&
    typeof o.sharefoxInventoryId === 'string' &&
    o.dimensions !== null &&
    typeof o.dimensions === 'object'
  );
}

export function isCustomer(obj: unknown): obj is Customer {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.type === 'string' &&
    typeof o.name === 'string' &&
    typeof o.phone === 'string' &&
    ['proff', 'privat', 'guest'].includes(o.type as string)
  );
}

export function isRental(obj: unknown): obj is Rental {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.status === 'string' &&
    typeof o.warehouseCode === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.pickupTime === 'string' &&
    typeof o.returnTime === 'string' &&
    typeof o.durationHours === 'number'
  );
}

export function isQueueItem(obj: unknown): obj is QueueItem {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.action === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.status === 'string' &&
    typeof o.retryCount === 'number'
  );
}
