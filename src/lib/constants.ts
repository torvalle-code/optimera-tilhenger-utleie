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
