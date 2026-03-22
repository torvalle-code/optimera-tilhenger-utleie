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

  // VOGNKORT-DATA (Statens vegvesen)
  chassisNumber?: string;
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  firstRegistered?: string;

  // UTVIDET VEKTDATA
  totalPermittedWeight_kg?: number;
  ownWeight_kg?: number;
  payloadCapacity_kg?: number;
  requiredLicenseClass?: 'B' | 'B96' | 'BE';

  // KOPLING
  couplingType?: 'ball_50mm' | 'ball_80mm' | 'euro' | 'other';
  hasBrakes?: boolean;
  hasHandbrake?: boolean;

  // EU-KONTROLL
  lastEuControl?: string;
  nextEuControlDue?: string;
  euControlStatus?: 'valid' | 'due_soon' | 'overdue' | 'exempt';

  // FORSIKRING
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;

  // SERVICE
  lastServiceDate?: string;
  nextServiceDue?: string;
  serviceIntervalMonths?: number;
  serviceHistory?: ServiceRecord[];
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
  driversLicenseClass?: 'B' | 'B96' | 'BE';
  driversLicenseVerified?: boolean;
  driversLicenseExpiry?: string;
  address?: {
    street: string;
    zipCode: string;
    city: string;
  };
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
  pickupChecklist?: InspectionChecklist;
  returnChecklist?: InspectionChecklist;
  licenseClassVerified?: boolean;
  licenseClassSufficient?: boolean;
  agreementAccepted?: boolean;
  depositPaid?: boolean;
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

// ========================
// SERVICE & MAINTENANCE
// ========================

export interface ServiceRecord {
  id: string;
  date: string;
  type: 'scheduled' | 'extra' | 'repair' | 'eu_control';
  performedBy: string;
  description: string;
  items: ServiceCheckItem[];
  cost?: number;
  invoiceRef?: string;
  nextServiceDue?: string;
  notes?: string;
}

export interface ServiceCheckItem {
  category: 'brakes' | 'tires' | 'lights' | 'coupling' | 'chassis' | 'bearings' | 'electrics' | 'body';
  item: string;
  status: 'ok' | 'warning' | 'replaced' | 'needs_repair';
  notes?: string;
}

// ========================
// INSPECTION CHECKLIST
// ========================

export type InspectionCategory =
  | 'tires'
  | 'brakes'
  | 'lights'
  | 'body'
  | 'equipment'
  | 'documents';

export interface InspectionItem {
  id: string;
  category: InspectionCategory;
  label: string;
  checked: boolean;
  status: 'ok' | 'minor_damage' | 'major_damage' | 'not_applicable';
  notes?: string;
}

export interface InspectionChecklist {
  completedAt: string;
  completedBy: string;
  items: InspectionItem[];
  overallStatus: 'passed' | 'passed_with_notes' | 'failed';
  photos?: string[];
  signature?: string;
  notes?: string;
}

// ========================
// WORKSHOP REQUESTS
// ========================

export type WorkshopRequestStatus =
  | 'draft'
  | 'sent'
  | 'acknowledged'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type WorkshopRequestType =
  | 'scheduled_service'
  | 'repair'
  | 'eu_control'
  | 'damage_fix';

export interface WorkshopRequest {
  id: string;
  trailerId: string;
  trailerBarcode: string;
  warehouseCode: string;
  requestDate: string;
  requestedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: WorkshopRequestType;
  description: string;
  damageReportId?: string;
  workshopName: string;
  workshopEmail: string;
  workshopPhone?: string;
  status: WorkshopRequestStatus;
  sentAt?: string;
  completedAt?: string;
  estimatedCost?: number;
  actualCost?: number;
  invoiceRef?: string;
  notes?: string;
}

export interface WorkshopConfig {
  warehouseCode: string;
  defaultWorkshopName: string;
  defaultWorkshopEmail: string;
  defaultWorkshopPhone?: string;
  notifyOnDamageReturn: boolean;
  notifyOnServiceDue: boolean;
  serviceIntervalMonths: number;
}
