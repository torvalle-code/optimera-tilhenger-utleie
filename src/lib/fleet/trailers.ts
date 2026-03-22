import { Trailer } from '../types';

/**
 * Demo fleet for development.
 * In production, this comes from Sharefox inventory API.
 */
export const DEMO_FLEET: Trailer[] = [
  {
    id: 'trailer-001',
    barcode: 'TH-SKI-001',
    name: 'Apen tilhenger 750 kg',
    type: 'open_750',
    maxWeight_kg: 750,
    dimensions: { lengthInner_cm: 205, widthInner_cm: 115, heightSides_cm: 35 },
    warehouseCode: 'MONTER-SKI',
    status: 'available',
    sharefoxProductId: 'sf-prod-1',
    sharefoxInventoryId: 'sf-inv-1',
  },
  {
    id: 'trailer-002',
    barcode: 'TH-SKI-002',
    name: 'Apen tilhenger 750 kg',
    type: 'open_750',
    maxWeight_kg: 750,
    dimensions: { lengthInner_cm: 205, widthInner_cm: 115, heightSides_cm: 35 },
    warehouseCode: 'MONTER-SKI',
    status: 'available',
    sharefoxProductId: 'sf-prod-1',
    sharefoxInventoryId: 'sf-inv-2',
  },
  {
    id: 'trailer-003',
    barcode: 'TH-SKI-003',
    name: 'Apen tilhenger 1300 kg',
    type: 'open_1300',
    maxWeight_kg: 1300,
    dimensions: { lengthInner_cm: 300, widthInner_cm: 155, heightSides_cm: 40 },
    registrationNumber: 'AB 12345',
    warehouseCode: 'MONTER-SKI',
    status: 'rented',
    currentRentalId: 'rental-demo-1',
    sharefoxProductId: 'sf-prod-2',
    sharefoxInventoryId: 'sf-inv-3',
  },
  {
    id: 'trailer-004',
    barcode: 'TH-SKI-004',
    name: 'Lukket tilhenger 750 kg',
    type: 'enclosed_750',
    maxWeight_kg: 750,
    dimensions: { lengthInner_cm: 250, widthInner_cm: 130, heightSides_cm: 130 },
    warehouseCode: 'MONTER-SKI',
    status: 'available',
    sharefoxProductId: 'sf-prod-3',
    sharefoxInventoryId: 'sf-inv-4',
  },
  {
    id: 'trailer-005',
    barcode: 'TH-SKI-005',
    name: 'Biltilhenger',
    type: 'car_trailer',
    maxWeight_kg: 2000,
    dimensions: { lengthInner_cm: 400, widthInner_cm: 200, heightSides_cm: 10 },
    registrationNumber: 'CD 67890',
    warehouseCode: 'MONTER-SKI',
    status: 'maintenance',
    lastInspection: '2026-03-01',
    sharefoxProductId: 'sf-prod-4',
    sharefoxInventoryId: 'sf-inv-5',
  },
];

/**
 * Find a trailer by barcode (used by terminal scan)
 */
export function findTrailerByBarcode(barcode: string, fleet: Trailer[] = DEMO_FLEET): Trailer | undefined {
  return fleet.find((t) => t.barcode === barcode);
}

/**
 * Get all trailers for a warehouse
 */
export function getWarehouseFleet(warehouseCode: string, fleet: Trailer[] = DEMO_FLEET): Trailer[] {
  return fleet.filter((t) => t.warehouseCode === warehouseCode);
}

/**
 * Get fleet summary counts
 */
export function getFleetSummary(fleet: Trailer[]) {
  return {
    total: fleet.length,
    available: fleet.filter((t) => t.status === 'available').length,
    rented: fleet.filter((t) => t.status === 'rented').length,
    reserved: fleet.filter((t) => t.status === 'reserved').length,
    maintenance: fleet.filter((t) => t.status === 'maintenance').length,
  };
}
