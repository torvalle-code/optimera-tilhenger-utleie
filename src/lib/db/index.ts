import Dexie, { type Table } from 'dexie';
import { Trailer, Rental, QueueItem, Customer } from '../types';

export class TilhengerDB extends Dexie {
  fleet!: Table<Trailer, string>;
  activeRentals!: Table<Rental, string>;
  syncQueue!: Table<QueueItem, string>;
  customers!: Table<Customer, string>;

  constructor() {
    super('TilhengerDB');
    this.version(1).stores({
      fleet: 'id, barcode, warehouseCode, status',
      activeRentals: 'id, status, warehouseCode',
      syncQueue: 'id, action, status, createdAt',
      customers: 'id, phone, name',
    });
  }
}

export const db = new TilhengerDB();
