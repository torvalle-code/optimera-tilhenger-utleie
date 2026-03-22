import { db } from './index';
import { Rental } from '../types';

export async function cacheRentals(rentals: Rental[]): Promise<void> {
  await db.activeRentals.clear();
  if (rentals.length > 0) {
    await db.activeRentals.bulkPut(rentals);
  }
}

export async function getCachedActiveRentals(warehouseCode?: string): Promise<Rental[]> {
  if (warehouseCode) {
    return db.activeRentals.where('warehouseCode').equals(warehouseCode).toArray();
  }
  return db.activeRentals.toArray();
}

export async function getCachedRental(id: string): Promise<Rental | undefined> {
  return db.activeRentals.get(id);
}

export async function upsertCachedRental(rental: Rental): Promise<void> {
  await db.activeRentals.put(rental);
}

export async function removeCachedRental(id: string): Promise<void> {
  await db.activeRentals.delete(id);
}
