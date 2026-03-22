import { db } from './index';
import { Trailer } from '../types';

export async function cacheFleet(trailers: Trailer[]): Promise<void> {
  await db.fleet.clear();
  if (trailers.length > 0) {
    await db.fleet.bulkPut(trailers);
  }
}

export async function getCachedFleet(warehouseCode?: string): Promise<Trailer[]> {
  if (warehouseCode) {
    return db.fleet.where('warehouseCode').equals(warehouseCode).toArray();
  }
  return db.fleet.toArray();
}

export async function getCachedTrailerByBarcode(barcode: string): Promise<Trailer | undefined> {
  return db.fleet.where('barcode').equals(barcode).first();
}

export async function updateCachedTrailerStatus(id: string, status: Trailer['status']): Promise<void> {
  await db.fleet.update(id, { status });
}
