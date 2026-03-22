import {
  Trailer,
  Customer,
  Rental,
  ServiceRecord,
  WorkshopRequest,
} from '../types';

// ==========================================================
// DEMO FLEET — Monter Skien, March 2026
// ==========================================================

export const DEMO_FLEET_EXTENDED: Trailer[] = [
  {
    id: 'trailer-001',
    barcode: 'TH-SKI-001',
    name: 'Brenderup 1205S',
    type: 'open_750',
    maxWeight_kg: 750,
    dimensions: { lengthInner_cm: 205, widthInner_cm: 116, heightSides_cm: 35 },
    warehouseCode: 'MONTER-SKI',
    status: 'available',
    sharefoxProductId: 'sf-prod-001',
    sharefoxInventoryId: 'sf-inv-001',
    imageUrl: '/images/trailers/brenderup-1205s.jpg',
    // Vognkort
    chassisNumber: 'YK9120500R1234567',
    brand: 'Brenderup',
    model: '1205S',
    yearOfManufacture: 2022,
    firstRegistered: '2022-04-15',
    // Vekt
    totalPermittedWeight_kg: 750,
    ownWeight_kg: 165,
    payloadCapacity_kg: 585,
    requiredLicenseClass: 'B',
    // Kopling
    couplingType: 'ball_50mm',
    hasBrakes: false,
    hasHandbrake: false,
    // EU-kontroll
    lastEuControl: '2024-09-10',
    nextEuControlDue: '2026-09-10',
    euControlStatus: 'valid',
    // Forsikring
    insuranceCompany: 'Gjensidige',
    insurancePolicyNumber: 'GJ-TH-2026-0041',
    insuranceExpiry: '2027-01-01',
    // Service
    lastServiceDate: '2025-12-01',
    nextServiceDue: '2026-06-01',
    serviceIntervalMonths: 6,
  },
  {
    id: 'trailer-002',
    barcode: 'TH-SKI-002',
    name: 'Neptun N7-20',
    type: 'open_750',
    maxWeight_kg: 750,
    dimensions: { lengthInner_cm: 201, widthInner_cm: 128, heightSides_cm: 40 },
    warehouseCode: 'MONTER-SKI',
    status: 'available',
    sharefoxProductId: 'sf-prod-002',
    sharefoxInventoryId: 'sf-inv-002',
    imageUrl: '/images/trailers/neptun-n7-20.jpg',
    chassisNumber: 'XLWN72000M0056789',
    brand: 'Neptun',
    model: 'N7-20',
    yearOfManufacture: 2021,
    firstRegistered: '2021-06-22',
    totalPermittedWeight_kg: 750,
    ownWeight_kg: 180,
    payloadCapacity_kg: 570,
    requiredLicenseClass: 'B',
    couplingType: 'ball_50mm',
    hasBrakes: false,
    hasHandbrake: false,
    lastEuControl: '2024-04-18',
    nextEuControlDue: '2026-04-18',
    euControlStatus: 'valid',
    insuranceCompany: 'Gjensidige',
    insurancePolicyNumber: 'GJ-TH-2026-0042',
    insuranceExpiry: '2027-01-01',
    // Service due soon — 28 days from March 22, 2026
    lastServiceDate: '2025-10-19',
    nextServiceDue: '2026-04-19',
    serviceIntervalMonths: 6,
  },
  {
    id: 'trailer-003',
    barcode: 'TH-SKI-003',
    name: 'Tema Pro 1300',
    type: 'open_1300',
    maxWeight_kg: 1300,
    dimensions: { lengthInner_cm: 304, widthInner_cm: 153, heightSides_cm: 40 },
    registrationNumber: 'AB 12345',
    warehouseCode: 'MONTER-SKI',
    status: 'rented',
    currentRentalId: 'rental-003',
    sharefoxProductId: 'sf-prod-003',
    sharefoxInventoryId: 'sf-inv-003',
    imageUrl: '/images/trailers/tema-pro-1300.jpg',
    chassisNumber: 'STE1300P3K0078901',
    brand: 'Tema',
    model: 'Pro 1300',
    yearOfManufacture: 2023,
    firstRegistered: '2023-03-10',
    totalPermittedWeight_kg: 1300,
    ownWeight_kg: 270,
    payloadCapacity_kg: 1030,
    requiredLicenseClass: 'B96',
    couplingType: 'ball_50mm',
    hasBrakes: true,
    hasHandbrake: true,
    // EU due soon — 21 days from March 22
    lastEuControl: '2024-04-12',
    nextEuControlDue: '2026-04-12',
    euControlStatus: 'due_soon',
    insuranceCompany: 'If',
    insurancePolicyNumber: 'IF-TH-2026-1103',
    insuranceExpiry: '2026-12-31',
    lastServiceDate: '2025-11-15',
    nextServiceDue: '2026-05-15',
    serviceIntervalMonths: 6,
  },
  {
    id: 'trailer-004',
    barcode: 'TH-SKI-004',
    name: 'Anssems GTB 750',
    type: 'enclosed_750',
    maxWeight_kg: 750,
    dimensions: { lengthInner_cm: 251, widthInner_cm: 126, heightSides_cm: 150 },
    warehouseCode: 'MONTER-SKI',
    status: 'available',
    sharefoxProductId: 'sf-prod-004',
    sharefoxInventoryId: 'sf-inv-004',
    imageUrl: '/images/trailers/anssems-gtb-750.jpg',
    chassisNumber: 'XLA750GTB2A012345',
    brand: 'Anssems',
    model: 'GTB 750',
    yearOfManufacture: 2024,
    firstRegistered: '2024-02-01',
    totalPermittedWeight_kg: 750,
    ownWeight_kg: 310,
    payloadCapacity_kg: 440,
    requiredLicenseClass: 'B',
    couplingType: 'ball_50mm',
    hasBrakes: false,
    hasHandbrake: false,
    lastEuControl: '2024-02-01',
    nextEuControlDue: '2026-02-01',
    euControlStatus: 'valid',
    insuranceCompany: 'Gjensidige',
    insurancePolicyNumber: 'GJ-TH-2026-0044',
    insuranceExpiry: '2027-01-01',
    lastServiceDate: '2026-01-10',
    nextServiceDue: '2026-07-10',
    serviceIntervalMonths: 6,
  },
  {
    id: 'trailer-005',
    barcode: 'TH-SKI-005',
    name: 'Brian James T4',
    type: 'car_trailer',
    maxWeight_kg: 2700,
    dimensions: { lengthInner_cm: 450, widthInner_cm: 200, heightSides_cm: 20 },
    registrationNumber: 'CD 67890',
    warehouseCode: 'MONTER-SKI',
    status: 'maintenance',
    sharefoxProductId: 'sf-prod-005',
    sharefoxInventoryId: 'sf-inv-005',
    imageUrl: '/images/trailers/brian-james-t4.jpg',
    chassisNumber: 'SBJT4270XK0034567',
    brand: 'Brian James',
    model: 'T4 Transporter',
    yearOfManufacture: 2020,
    firstRegistered: '2020-08-20',
    totalPermittedWeight_kg: 2700,
    ownWeight_kg: 720,
    payloadCapacity_kg: 1980,
    requiredLicenseClass: 'BE',
    couplingType: 'ball_50mm',
    hasBrakes: true,
    hasHandbrake: true,
    // EU overdue
    lastEuControl: '2024-02-15',
    nextEuControlDue: '2026-02-15',
    euControlStatus: 'overdue',
    insuranceCompany: 'If',
    insurancePolicyNumber: 'IF-TH-2026-2205',
    insuranceExpiry: '2026-12-31',
    lastServiceDate: '2025-08-20',
    nextServiceDue: '2026-02-20',
    serviceIntervalMonths: 6,
  },
];

// ==========================================================
// DEMO CUSTOMERS
// ==========================================================

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    type: 'proff',
    name: 'Kjetil Aasen',
    phone: '91234567',
    email: 'kjetil@aasen-bygg.no',
    optimeraNr: 'OPT-100234',
    companyName: 'Aasen Bygg & Anlegg AS',
    driversLicense: true,
    idVerified: true,
    driversLicenseClass: 'BE',
    driversLicenseVerified: true,
    driversLicenseExpiry: '2035-06-15',
    address: { street: 'Industriveien 12', zipCode: '3730', city: 'Skien' },
  },
  {
    id: 'cust-002',
    type: 'proff',
    name: 'Marte Johansen',
    phone: '41567890',
    email: 'marte@johansen-maler.no',
    optimeraNr: 'OPT-100578',
    companyName: 'Johansen Malermester',
    driversLicense: true,
    idVerified: true,
    driversLicenseClass: 'B96',
    driversLicenseVerified: true,
    driversLicenseExpiry: '2031-11-01',
    address: { street: 'Bjorntvedtvegen 45', zipCode: '3729', city: 'Skien' },
  },
  {
    id: 'cust-003',
    type: 'privat',
    name: 'Lars Erik Pettersen',
    phone: '99876543',
    email: 'lars.erik@gmail.com',
    kundeklubbNr: 'MK-556677',
    driversLicense: true,
    idVerified: true,
    driversLicenseClass: 'B96',
    driversLicenseVerified: true,
    driversLicenseExpiry: '2029-03-20',
    address: { street: 'Granittveien 8B', zipCode: '3733', city: 'Skien' },
  },
  {
    id: 'cust-004',
    type: 'privat',
    name: 'Silje Kristiansen',
    phone: '47812345',
    email: 'silje.k@outlook.com',
    kundeklubbNr: 'MK-889900',
    driversLicense: true,
    idVerified: true,
    driversLicenseClass: 'B',
    driversLicenseVerified: true,
    driversLicenseExpiry: '2033-08-10',
    address: { street: 'Furumoveien 22', zipCode: '3722', city: 'Skien' },
  },
  {
    id: 'cust-005',
    type: 'guest',
    name: 'Ola Nordmann',
    phone: '92345678',
    driversLicense: true,
    idVerified: false,
    driversLicenseClass: 'B',
    driversLicenseVerified: false,
  },
  {
    id: 'cust-006',
    type: 'guest',
    name: 'Anna Svensson',
    phone: '45678901',
    driversLicense: false,
    idVerified: false,
  },
];

// ==========================================================
// DEMO RENTALS
// ==========================================================

export const DEMO_RENTALS: Rental[] = [
  // PENDING #1 — proff booking for tomorrow
  {
    id: 'rental-001',
    sharefoxOrderId: 'SF-ORD-2026-0401',
    sharefoxBookingRef: 'BK-2026-0401',
    trailer: DEMO_FLEET_EXTENDED[0], // Brenderup 1205S
    customer: DEMO_CUSTOMERS[0], // Kjetil Aasen (proff, BE)
    warehouseCode: 'MONTER-SKI',
    status: 'pending',
    createdAt: '2026-03-21T14:30:00+01:00',
    pickupTime: '2026-03-23T08:00:00+01:00',
    returnTime: '2026-03-23T16:00:00+01:00',
    durationHours: 8,
    notes: 'Henter materialer fra Optimera lager',
    depositAmount: 500,
    totalPrice: 450,
    licenseClassVerified: true,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: true,
  },
  // PENDING #2 — privat booking for next week
  {
    id: 'rental-002',
    sharefoxOrderId: 'SF-ORD-2026-0402',
    sharefoxBookingRef: 'BK-2026-0402',
    trailer: DEMO_FLEET_EXTENDED[3], // Anssems GTB 750 (enclosed)
    customer: DEMO_CUSTOMERS[3], // Silje Kristiansen (privat, B)
    warehouseCode: 'MONTER-SKI',
    status: 'pending',
    createdAt: '2026-03-20T10:15:00+01:00',
    pickupTime: '2026-03-28T09:00:00+01:00',
    returnTime: '2026-03-28T18:00:00+01:00',
    durationHours: 9,
    notes: 'Flytting av mobler',
    depositAmount: 500,
    totalPrice: 550,
    licenseClassVerified: true,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: false,
  },
  // ACTIVE — currently rented out (Tema Pro 1300)
  {
    id: 'rental-003',
    sharefoxOrderId: 'SF-ORD-2026-0403',
    sharefoxBookingRef: 'BK-2026-0403',
    trailer: DEMO_FLEET_EXTENDED[2], // Tema Pro 1300
    customer: DEMO_CUSTOMERS[2], // Lars Erik Pettersen (privat, B96)
    warehouseCode: 'MONTER-SKI',
    status: 'active',
    createdAt: '2026-03-19T09:00:00+01:00',
    pickupTime: '2026-03-21T07:30:00+01:00',
    actualPickup: '2026-03-21T07:45:00+01:00',
    returnTime: '2026-03-22T17:00:00+01:00',
    durationHours: 33,
    staffPickup: 'Thomas H.',
    notes: 'Terrasseprosjekt, henter bord og bjelker',
    depositAmount: 1000,
    totalPrice: 890,
    licenseClassVerified: true,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: true,
    pickupChecklist: {
      completedAt: '2026-03-21T07:40:00+01:00',
      completedBy: 'Thomas H.',
      items: [
        { id: 'tire_pressure', category: 'tires', label: 'Dekktrykk kontrollert', checked: true, status: 'ok' },
        { id: 'brake_function', category: 'brakes', label: 'Bremser fungerer', checked: true, status: 'ok' },
        { id: 'brake_lights', category: 'lights', label: 'Bremselys fungerer', checked: true, status: 'ok' },
        { id: 'body_damage', category: 'body', label: 'Ingen synlige skader', checked: true, status: 'ok' },
      ],
      overallStatus: 'passed',
    },
  },
  // OVERDUE — guest did not return on time
  {
    id: 'rental-004',
    sharefoxOrderId: 'SF-ORD-2026-0404',
    sharefoxBookingRef: 'BK-2026-0404',
    trailer: DEMO_FLEET_EXTENDED[1], // Neptun N7-20
    customer: DEMO_CUSTOMERS[4], // Ola Nordmann (guest, B)
    warehouseCode: 'MONTER-SKI',
    status: 'overdue',
    createdAt: '2026-03-18T12:00:00+01:00',
    pickupTime: '2026-03-19T10:00:00+01:00',
    actualPickup: '2026-03-19T10:20:00+01:00',
    returnTime: '2026-03-20T10:00:00+01:00',
    durationHours: 24,
    staffPickup: 'Kari S.',
    notes: 'Gjest - ikke returnert. Forsok ringt 2x uten svar.',
    depositAmount: 500,
    totalPrice: 490,
    licenseClassVerified: false,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: true,
    pickupChecklist: {
      completedAt: '2026-03-19T10:15:00+01:00',
      completedBy: 'Kari S.',
      items: [
        { id: 'tire_pressure', category: 'tires', label: 'Dekktrykk kontrollert', checked: true, status: 'ok' },
        { id: 'body_damage', category: 'body', label: 'Ingen synlige skader', checked: true, status: 'ok' },
      ],
      overallStatus: 'passed',
    },
  },
  // RETURNED — awaiting final check
  {
    id: 'rental-005',
    sharefoxOrderId: 'SF-ORD-2026-0405',
    sharefoxBookingRef: 'BK-2026-0405',
    trailer: DEMO_FLEET_EXTENDED[0], // Brenderup 1205S
    customer: DEMO_CUSTOMERS[1], // Marte Johansen (proff, B96)
    warehouseCode: 'MONTER-SKI',
    status: 'returned',
    createdAt: '2026-03-15T08:00:00+01:00',
    pickupTime: '2026-03-17T07:00:00+01:00',
    actualPickup: '2026-03-17T07:10:00+01:00',
    returnTime: '2026-03-18T16:00:00+01:00',
    actualReturn: '2026-03-18T15:30:00+01:00',
    durationHours: 33,
    staffPickup: 'Thomas H.',
    staffReturn: 'Kari S.',
    notes: 'Retur OK, liten ripe pa hoyre side notert',
    damageReport: {
      hasDamage: true,
      description: 'Liten overflateripe (5 cm) pa hoyre sidepanel. Kun kosmetisk.',
    },
    depositAmount: 500,
    totalPrice: 890,
    licenseClassVerified: true,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: true,
  },
  // COMPLETED #1 — all done
  {
    id: 'rental-006',
    sharefoxOrderId: 'SF-ORD-2026-0406',
    sharefoxBookingRef: 'BK-2026-0406',
    trailer: DEMO_FLEET_EXTENDED[3], // Anssems GTB 750
    customer: DEMO_CUSTOMERS[0], // Kjetil Aasen (proff, BE)
    warehouseCode: 'MONTER-SKI',
    status: 'completed',
    createdAt: '2026-03-10T11:00:00+01:00',
    pickupTime: '2026-03-12T08:00:00+01:00',
    actualPickup: '2026-03-12T08:05:00+01:00',
    returnTime: '2026-03-12T17:00:00+01:00',
    actualReturn: '2026-03-12T16:45:00+01:00',
    durationHours: 9,
    staffPickup: 'Kari S.',
    staffReturn: 'Thomas H.',
    damageReport: { hasDamage: false },
    depositAmount: 500,
    totalPrice: 550,
    licenseClassVerified: true,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: true,
  },
  // COMPLETED #2 — weekend rental
  {
    id: 'rental-007',
    sharefoxOrderId: 'SF-ORD-2026-0407',
    sharefoxBookingRef: 'BK-2026-0407',
    trailer: DEMO_FLEET_EXTENDED[2], // Tema Pro 1300
    customer: DEMO_CUSTOMERS[2], // Lars Erik Pettersen (privat, B96)
    warehouseCode: 'MONTER-SKI',
    status: 'completed',
    createdAt: '2026-03-05T14:00:00+01:00',
    pickupTime: '2026-03-07T09:00:00+01:00',
    actualPickup: '2026-03-07T09:15:00+01:00',
    returnTime: '2026-03-09T18:00:00+01:00',
    actualReturn: '2026-03-09T17:30:00+01:00',
    durationHours: 57,
    staffPickup: 'Thomas H.',
    staffReturn: 'Thomas H.',
    damageReport: { hasDamage: false },
    depositAmount: 1000,
    totalPrice: 1490,
    licenseClassVerified: true,
    licenseClassSufficient: true,
    agreementAccepted: true,
    depositPaid: true,
  },
  // CANCELLED — guest had no valid license
  {
    id: 'rental-008',
    sharefoxOrderId: 'SF-ORD-2026-0408',
    sharefoxBookingRef: 'BK-2026-0408',
    trailer: DEMO_FLEET_EXTENDED[4], // Brian James T4 (BE required)
    customer: DEMO_CUSTOMERS[5], // Anna Svensson (guest, no license)
    warehouseCode: 'MONTER-SKI',
    status: 'cancelled',
    createdAt: '2026-03-16T15:00:00+01:00',
    pickupTime: '2026-03-18T09:00:00+01:00',
    returnTime: '2026-03-18T18:00:00+01:00',
    durationHours: 9,
    notes: 'Kansellert: Kunde mangler forerkort. Biltilhenger krever BE-klasse.',
    depositAmount: 1500,
    totalPrice: 990,
    licenseClassVerified: false,
    licenseClassSufficient: false,
    agreementAccepted: false,
    depositPaid: false,
  },
];

// ==========================================================
// DEMO SERVICE RECORDS
// ==========================================================

export const DEMO_SERVICE_RECORDS: ServiceRecord[] = [
  // trailer-001 (Brenderup 1205S) — 3 records
  {
    id: 'svc-001',
    date: '2025-12-01',
    type: 'scheduled',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Halvaarlig service. Alt i orden.',
    items: [
      { category: 'tires', item: 'Dekktrykk', status: 'ok' },
      { category: 'lights', item: 'Lys og refleks', status: 'ok' },
      { category: 'coupling', item: 'Kulkopling', status: 'ok' },
      { category: 'bearings', item: 'Hjullager', status: 'ok' },
    ],
    cost: 1200,
    nextServiceDue: '2026-06-01',
  },
  {
    id: 'svc-002',
    date: '2025-06-01',
    type: 'scheduled',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Halvaarlig service. Byttet hoyre baklysmodul.',
    items: [
      { category: 'tires', item: 'Dekktrykk', status: 'ok' },
      { category: 'lights', item: 'Hoyre baklys', status: 'replaced', notes: 'Byttet LED-modul' },
      { category: 'coupling', item: 'Kulkopling', status: 'ok' },
      { category: 'bearings', item: 'Hjullager', status: 'ok' },
    ],
    cost: 1850,
    invoiceRef: 'STS-2025-0612',
  },
  {
    id: 'svc-003',
    date: '2024-09-10',
    type: 'eu_control',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'EU-kontroll godkjent uten anmerkninger.',
    items: [
      { category: 'brakes', item: 'Ikke bremsepliktig', status: 'ok' },
      { category: 'lights', item: 'Alle lys', status: 'ok' },
      { category: 'chassis', item: 'Understell', status: 'ok' },
    ],
    cost: 950,
    invoiceRef: 'STS-2024-0910',
  },

  // trailer-002 (Neptun N7-20) — 2 records
  {
    id: 'svc-004',
    date: '2025-10-19',
    type: 'scheduled',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Halvaarlig service. Notert slitasje pa venstre dekk.',
    items: [
      { category: 'tires', item: 'Venstre dekk', status: 'warning', notes: 'Monsterdybde 2.5mm — bytt for sommersesong' },
      { category: 'tires', item: 'Hoyre dekk', status: 'ok' },
      { category: 'lights', item: 'Lys og refleks', status: 'ok' },
      { category: 'coupling', item: 'Kulkopling', status: 'ok' },
    ],
    cost: 1200,
    nextServiceDue: '2026-04-19',
  },
  {
    id: 'svc-005',
    date: '2024-04-18',
    type: 'eu_control',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'EU-kontroll godkjent.',
    items: [
      { category: 'lights', item: 'Alle lys', status: 'ok' },
      { category: 'chassis', item: 'Understell', status: 'ok' },
    ],
    cost: 950,
  },

  // trailer-003 (Tema Pro 1300) — 3 records
  {
    id: 'svc-006',
    date: '2025-11-15',
    type: 'scheduled',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Halvaarlig service. Justert bremser.',
    items: [
      { category: 'brakes', item: 'Driftsbremser', status: 'ok', notes: 'Justert bremsevaiere' },
      { category: 'brakes', item: 'Parkeringsbrems', status: 'ok' },
      { category: 'tires', item: 'Dekk begge sider', status: 'ok' },
      { category: 'bearings', item: 'Hjullager', status: 'ok' },
    ],
    cost: 1800,
    nextServiceDue: '2026-05-15',
  },
  {
    id: 'svc-007',
    date: '2025-05-20',
    type: 'repair',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Reparasjon av sikkerhetswire etter skade ved retur.',
    items: [
      { category: 'coupling', item: 'Sikkerhetswire', status: 'replaced', notes: 'Ny wire montert' },
    ],
    cost: 650,
    invoiceRef: 'STS-2025-0520',
  },
  {
    id: 'svc-008',
    date: '2024-04-12',
    type: 'eu_control',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'EU-kontroll godkjent. Neste kontroll 2026-04-12.',
    items: [
      { category: 'brakes', item: 'Bremsetest', status: 'ok' },
      { category: 'lights', item: 'Alle lys', status: 'ok' },
      { category: 'chassis', item: 'Understell og ramme', status: 'ok' },
    ],
    cost: 1250,
  },

  // trailer-004 (Anssems GTB 750) — 1 record
  {
    id: 'svc-009',
    date: '2026-01-10',
    type: 'scheduled',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Forste halvaarlige service. Nytt vogn, alt OK.',
    items: [
      { category: 'tires', item: 'Dekktrykk', status: 'ok' },
      { category: 'lights', item: 'Lys og refleks', status: 'ok' },
      { category: 'body', item: 'Dorer og lasing', status: 'ok' },
      { category: 'coupling', item: 'Kulkopling', status: 'ok' },
    ],
    cost: 1100,
    nextServiceDue: '2026-07-10',
  },

  // trailer-005 (Brian James T4) — 3 records
  {
    id: 'svc-010',
    date: '2025-08-20',
    type: 'scheduled',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Halvaarlig service. Slipt ramper, sjekket hydraulikk.',
    items: [
      { category: 'brakes', item: 'Driftsbremser', status: 'ok' },
      { category: 'tires', item: 'Alle 4 dekk', status: 'ok' },
      { category: 'chassis', item: 'Ramper og hydraulikk', status: 'ok' },
      { category: 'electrics', item: 'Vinsj-elektrikk', status: 'ok' },
    ],
    cost: 2400,
    nextServiceDue: '2026-02-20',
  },
  {
    id: 'svc-011',
    date: '2024-02-15',
    type: 'eu_control',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'EU-kontroll godkjent. Anmerkning pa slitasje hjullager hoyre.',
    items: [
      { category: 'brakes', item: 'Bremsetest', status: 'ok' },
      { category: 'bearings', item: 'Hjullager hoyre', status: 'warning', notes: 'Noe slitasje, byttes ved neste service' },
      { category: 'lights', item: 'Alle lys', status: 'ok' },
      { category: 'chassis', item: 'Ramme og ramper', status: 'ok' },
    ],
    cost: 1400,
  },
  {
    id: 'svc-012',
    date: '2024-06-10',
    type: 'repair',
    performedBy: 'Skien Tilhengerservice AS',
    description: 'Byttet hjullager hoyre side (oppfolging fra EU-kontroll).',
    items: [
      { category: 'bearings', item: 'Hjullager hoyre', status: 'replaced', notes: 'Nytt lager montert' },
    ],
    cost: 2200,
    invoiceRef: 'STS-2024-0610',
  },
];

// ==========================================================
// DEMO WORKSHOP REQUESTS
// ==========================================================

export const DEMO_WORKSHOP_REQUESTS: WorkshopRequest[] = [
  // DRAFT — preparing EU-control for trailer-005
  {
    id: 'ws-001',
    trailerId: 'trailer-005',
    trailerBarcode: 'TH-SKI-005',
    warehouseCode: 'MONTER-SKI',
    requestDate: '2026-03-22',
    requestedBy: 'Thomas H.',
    priority: 'urgent',
    type: 'eu_control',
    description: 'EU-kontroll forfallt 2026-02-15. Ma bestilles snarest. Tilhenger er ute av drift.',
    workshopName: 'Skien Tilhengerservice AS',
    workshopEmail: 'service@skien-tilhenger.no',
    workshopPhone: '35 50 12 34',
    status: 'draft',
    estimatedCost: 1500,
    notes: 'Brian James T4 — biltilhenger, krever utvidet kontroll.',
  },
  // SENT — service request for trailer-002
  {
    id: 'ws-002',
    trailerId: 'trailer-002',
    trailerBarcode: 'TH-SKI-002',
    warehouseCode: 'MONTER-SKI',
    requestDate: '2026-03-20',
    requestedBy: 'Kari S.',
    priority: 'medium',
    type: 'scheduled_service',
    description: 'Halvaarlig service. Venstre dekk var markert med slitasje ved forrige service — sjekk og bytt om nodvendig.',
    workshopName: 'Skien Tilhengerservice AS',
    workshopEmail: 'service@skien-tilhenger.no',
    workshopPhone: '35 50 12 34',
    status: 'sent',
    sentAt: '2026-03-20T09:30:00+01:00',
    estimatedCost: 2500,
    notes: 'Servicedato neste uke, helst for 19. april.',
  },
  // ACKNOWLEDGED — workshop acknowledged damage fix
  {
    id: 'ws-003',
    trailerId: 'trailer-001',
    trailerBarcode: 'TH-SKI-001',
    warehouseCode: 'MONTER-SKI',
    requestDate: '2026-03-18',
    requestedBy: 'Kari S.',
    priority: 'low',
    type: 'damage_fix',
    description: 'Kosmetisk ripe pa hoyre sidepanel (5 cm). Onsker lakkreparasjon ved neste leilighet.',
    damageReportId: 'rental-005',
    workshopName: 'Skien Tilhengerservice AS',
    workshopEmail: 'service@skien-tilhenger.no',
    status: 'acknowledged',
    sentAt: '2026-03-18T16:00:00+01:00',
    estimatedCost: 800,
    notes: 'Verkstedet bekreftet mottatt, tar den ved neste ordinaere service.',
  },
  // IN_PROGRESS — trailer-005 getting brake service
  {
    id: 'ws-004',
    trailerId: 'trailer-005',
    trailerBarcode: 'TH-SKI-005',
    warehouseCode: 'MONTER-SKI',
    requestDate: '2026-03-10',
    requestedBy: 'Thomas H.',
    priority: 'high',
    type: 'repair',
    description: 'Bremsevaiere slakke, driftsbremser bremser ujevnt. Ma fikses for EU-kontroll.',
    workshopName: 'Skien Tilhengerservice AS',
    workshopEmail: 'service@skien-tilhenger.no',
    workshopPhone: '35 50 12 34',
    status: 'in_progress',
    sentAt: '2026-03-10T10:00:00+01:00',
    estimatedCost: 3500,
    notes: 'Tilhenger levert verksted 12. mars. Forventet ferdig uke 13.',
  },
  // COMPLETED — previous scheduled service
  {
    id: 'ws-005',
    trailerId: 'trailer-004',
    trailerBarcode: 'TH-SKI-004',
    warehouseCode: 'MONTER-SKI',
    requestDate: '2026-01-05',
    requestedBy: 'Thomas H.',
    priority: 'medium',
    type: 'scheduled_service',
    description: 'Forste halvaarlige service for Anssems GTB 750.',
    workshopName: 'Skien Tilhengerservice AS',
    workshopEmail: 'service@skien-tilhenger.no',
    status: 'completed',
    sentAt: '2026-01-05T11:00:00+01:00',
    completedAt: '2026-01-10T14:00:00+01:00',
    estimatedCost: 1200,
    actualCost: 1100,
    invoiceRef: 'STS-2026-0110',
    notes: 'Alt OK. Nytt vogn i god stand.',
  },
];

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

export function findTrailerById(id: string): Trailer | undefined {
  return DEMO_FLEET_EXTENDED.find((t) => t.id === id);
}

export function getRentalsForTrailer(trailerId: string): Rental[] {
  return DEMO_RENTALS.filter((r) => r.trailer.id === trailerId);
}

export function getServiceRecordsForTrailer(trailerId: string): ServiceRecord[] {
  // Map trailer IDs to their service records by index ranges
  const trailerServiceMap: Record<string, string[]> = {
    'trailer-001': ['svc-001', 'svc-002', 'svc-003'],
    'trailer-002': ['svc-004', 'svc-005'],
    'trailer-003': ['svc-006', 'svc-007', 'svc-008'],
    'trailer-004': ['svc-009'],
    'trailer-005': ['svc-010', 'svc-011', 'svc-012'],
  };
  const ids = trailerServiceMap[trailerId] || [];
  return DEMO_SERVICE_RECORDS.filter((s) => ids.includes(s.id));
}

export function getActiveRentals(): Rental[] {
  return DEMO_RENTALS.filter((r) => r.status === 'active' || r.status === 'overdue');
}

export function getRentalsForCustomer(customerId: string): Rental[] {
  return DEMO_RENTALS.filter((r) => r.customer.id === customerId);
}
