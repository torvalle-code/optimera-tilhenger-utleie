import Dexie, { type Table } from 'dexie';
import { Trailer, Rental, QueueItem, Customer, FeedbackItem } from '../types';

export class TilhengerDB extends Dexie {
  fleet!: Table<Trailer, string>;
  activeRentals!: Table<Rental, string>;
  syncQueue!: Table<QueueItem, string>;
  customers!: Table<Customer, string>;
  feedback!: Table<FeedbackItem, string>;

  constructor() {
    super('TilhengerDB');
    this.version(1).stores({
      fleet: 'id, barcode, warehouseCode, status',
      activeRentals: 'id, status, warehouseCode',
      syncQueue: 'id, action, status, createdAt',
      customers: 'id, phone, name',
    });
    this.version(2).stores({
      fleet: 'id, barcode, warehouseCode, status',
      activeRentals: 'id, status, warehouseCode',
      syncQueue: 'id, action, status, createdAt',
      customers: 'id, phone, name',
      feedback: 'id, category, priority, status, createdAt',
    });
  }
}

export const db = new TilhengerDB();
