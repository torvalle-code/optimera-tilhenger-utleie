import { Warehouse } from './types';

export const WAREHOUSES: Warehouse[] = [
  {
    code: 'MONTER-SKI',
    name: 'Monter Skien',
    sharefoxDomain: 'monter-skien.mysharefox.com',
    fleetSize: 8,
  },
  {
    code: 'MONTER-TON',
    name: 'Monter Tonsberg',
    sharefoxDomain: 'monter-tonsberg.mysharefox.com',
    fleetSize: 6,
  },
  {
    code: 'MONTER-FRE',
    name: 'Monter Fredrikstad',
    sharefoxDomain: 'monter-fredrikstad.mysharefox.com',
    fleetSize: 10,
  },
];

export const TRAILER_TYPE_LABELS: Record<string, string> = {
  open_750: 'Apen tilhenger 750 kg',
  open_1300: 'Apen tilhenger 1300 kg',
  enclosed_750: 'Lukket tilhenger 750 kg',
  car_trailer: 'Biltilhenger',
  flatbed: 'Flaktilhenger',
};

export const RENTAL_MAX_DAYS = 30;
export const SYNC_RETRY_MAX = 3;
export const SYNC_RETRY_BASE_DELAY_MS = 2000;

export const BRAND_COLORS = {
  primary: '#E52629',
  primaryDark: '#C41E21',
  dark: '#101920',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
} as const;

// ========================
// INSPECTION CHECKLIST
// ========================

export const DEFAULT_INSPECTION_ITEMS = [
  { id: 'tire_pressure', category: 'tires' as const, label: 'Dekktrykk kontrollert' },
  { id: 'tire_tread', category: 'tires' as const, label: 'Mønsterdybde OK (min 1.6mm sommer / 3mm vinter)' },
  { id: 'tire_damage', category: 'tires' as const, label: 'Ingen kutt, bulker eller ujevn slitasje' },
  { id: 'wheel_bolts', category: 'tires' as const, label: 'Alle hjulbolter strammet' },
  { id: 'brake_function', category: 'brakes' as const, label: 'Bremser fungerer (parkeringsbrems + driftsbrems)' },
  { id: 'coupling_clean', category: 'brakes' as const, label: 'Kopling ren og uskadd' },
  { id: 'safety_chain', category: 'brakes' as const, label: 'Sikkerhetskjetting/wire intakt' },
  { id: 'electrical_plug', category: 'brakes' as const, label: 'Elektrisk tilkobling ren og funksjonell' },
  { id: 'support_foot', category: 'brakes' as const, label: 'Støttefot fungerer' },
  { id: 'brake_lights', category: 'lights' as const, label: 'Bremselys fungerer' },
  { id: 'indicators', category: 'lights' as const, label: 'Blinklys venstre/høyre fungerer' },
  { id: 'position_lights', category: 'lights' as const, label: 'Posisjonslys fungerer' },
  { id: 'reflectors', category: 'lights' as const, label: 'Reflekser intakte (røde bak, hvite foran)' },
  { id: 'body_damage', category: 'body' as const, label: 'Ingen synlige skader, bulker eller rust' },
  { id: 'doors_hatches', category: 'body' as const, label: 'Dører/luker lukker ordentlig' },
  { id: 'cargo_area', category: 'body' as const, label: 'Lasteplan rent og skadefritt' },
  { id: 'securing_points', category: 'body' as const, label: 'Lastsikringspunkter intakte' },
  { id: 'spare_wheel', category: 'equipment' as const, label: 'Reservehjul (hvis tilgjengelig)' },
  { id: 'wheel_chock', category: 'equipment' as const, label: 'Hjulklosser tilgjengelig' },
  { id: 'registration_doc', category: 'documents' as const, label: 'Vognkort tilgjengelig' },
  { id: 'eu_control_valid', category: 'documents' as const, label: 'EU-kontroll gyldig' },
  { id: 'insurance_valid', category: 'documents' as const, label: 'Forsikring gyldig' },
  { id: 'license_verified', category: 'documents' as const, label: 'Førerkortklasse verifisert (B/B96/BE)' },
];

export const INSPECTION_CATEGORIES = [
  { id: 'tires', label: 'Dekk og hjul' },
  { id: 'brakes', label: 'Bremser og kopling' },
  { id: 'lights', label: 'Lys og refleks' },
  { id: 'body', label: 'Karosseri og lasteplan' },
  { id: 'equipment', label: 'Utstyr' },
  { id: 'documents', label: 'Dokumenter' },
] as const;

// ========================
// WORKSHOP CONFIG
// ========================

export const WORKSHOP_CONFIGS = [
  {
    warehouseCode: 'MONTER-SKI',
    defaultWorkshopName: 'Skien Tilhengerservice AS',
    defaultWorkshopEmail: 'service@skien-tilhenger.no',
    defaultWorkshopPhone: '35 50 12 34',
    notifyOnDamageReturn: true,
    notifyOnServiceDue: true,
    serviceIntervalMonths: 6,
  },
  {
    warehouseCode: 'MONTER-TON',
    defaultWorkshopName: 'Tønsberg Hengerverksted',
    defaultWorkshopEmail: 'verksted@tonsberg-henger.no',
    notifyOnDamageReturn: true,
    notifyOnServiceDue: true,
    serviceIntervalMonths: 6,
  },
  {
    warehouseCode: 'MONTER-FRE',
    defaultWorkshopName: 'Fredrikstad Trailer Service',
    defaultWorkshopEmail: 'post@fre-trailer.no',
    notifyOnDamageReturn: true,
    notifyOnServiceDue: true,
    serviceIntervalMonths: 6,
  },
];
