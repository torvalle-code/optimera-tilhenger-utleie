// ========================
// TRAILER / FLEET
// ========================

export type TrailerStatus = 'available' | 'rented' | 'reserved' | 'maintenance' | 'retired';

export type TrailerType =
  | 'open_750'
  | 'open_1300'
  | 'enclosed_750'
  | 'car_trailer'
  | 'flatbed';

export interface TrailerDimensions {
  lengthInner_cm: number;
  widthInner_cm: number;
  heightSides_cm: number;
}

export interface Trailer {
  id: string;
  barcode: string;
  name: string;
  type: TrailerType;
  maxWeight_kg: number;
  dimensions: TrailerDimensions;
  registrationNumber?: string;
  warehouseCode: string;
  status: TrailerStatus;
  currentRentalId?: string;
  lastInspection?: string;
  sharefoxProductId: string;
  sharefoxInventoryId: string;
  imageUrl?: string;
}

// ========================
// CUSTOMER
// ========================

export type CustomerType = 'proff' | 'privat' | 'guest';

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  phone: string;
  email?: string;
  optimeraNr?: string;
  kundeklubbNr?: string;
  companyName?: string;
  driversLicense: boolean;
  idVerified: boolean;
}

// ========================
// RENTAL
// ========================

export type RentalStatus =
  | 'pending'
  | 'active'
  | 'overdue'
  | 'returned'
  | 'completed'
  | 'cancelled';

export interface DamageReport {
  hasDamage: boolean;
  description?: string;
  photoUrls?: string[];
}

export interface Rental {
  id: string;
  sharefoxOrderId: string;
  sharefoxBookingRef: string;
  trailer: Trailer;
  customer: Customer;
  warehouseCode: string;
  status: RentalStatus;
  createdAt: string;
  pickupTime: string;
  actualPickup?: string;
  returnTime: string;
  actualReturn?: string;
  durationHours: number;
  staffPickup?: string;
  staffReturn?: string;
  notes?: string;
  damageReport?: DamageReport;
  depositAmount?: number;
  totalPrice?: number;
}

// ========================
// OFFLINE QUEUE
// ========================

export type QueueAction =
  | 'create_rental'
  | 'confirm_pickup'
  | 'confirm_return'
  | 'update_status';

export type QueueItemStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface QueueItem {
  id: string;
  action: QueueAction;
  payload: Record<string, unknown>;
  createdAt: string;
  status: QueueItemStatus;
  retryCount: number;
  lastError?: string;
  syncedAt?: string;
  sharefoxId?: string;
}

// ========================
// SHAREFOX API TYPES
// ========================

export interface SharefoxAuthResponse {
  token: string;
  expiresAt: string;
}

export interface SharefoxProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images?: { url: string }[];
}

export interface SharefoxBooking {
  id: number;
  bookingReference: string;
  status: string;
  startDate: string;
  endDate: string;
  productId: number;
  inventoryItemId?: number;
}

export interface SharefoxInventoryItem {
  id: number;
  productId: number;
  barcode: string;
  status: string;
  name?: string;
}

export interface SharefoxOrder {
  id: number;
  status: string;
  bookings: SharefoxBooking[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  totalPrice: number;
  currency: string;
}

export interface CreateBookingPayload {
  productId: number;
  startDate: string;
  endDate: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  inventoryItemId?: number;
}

export interface OrderFilters {
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// ========================
// WAREHOUSE
// ========================

export interface Warehouse {
  code: string;
  name: string;
  sharefoxDomain: string;
  fleetSize: number;
}

// ========================
// PRICING
// ========================

export type PricingPeriod = 'hour' | 'day' | 'weekend' | 'week';

export interface PricingTier {
  period: PricingPeriod;
  price: number;
  currency: string;
}

export interface PriceCalculation {
  basePeriod: PricingPeriod;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  currency: string;
}
