import { Rental, WorkshopRequest, WorkshopRequestType } from '../types';
import { TRAILER_TYPE_LABELS } from '../constants';

// ========================
// Date formatting (Norwegian locale, no external lib)
// ========================

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = formatDate(iso);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${date} kl. ${h}:${m}`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - now.getTime()) / 86400000);
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeekDates(mondayIso: string): string[] {
  const d = new Date(mondayIso);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    return day.toISOString().split('T')[0];
  });
}

export function getMondayOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

// ========================
// Service / EU status helpers
// ========================

export function getEuControlStatus(nextDue: string | undefined): 'valid' | 'due_soon' | 'overdue' | 'exempt' {
  if (!nextDue) return 'exempt';
  const days = daysUntil(nextDue);
  if (days < 0) return 'overdue';
  if (days <= 30) return 'due_soon';
  return 'valid';
}

export function getServiceUrgency(nextDue: string | undefined): 'overdue' | 'due_soon' | 'ok' {
  if (!nextDue) return 'ok';
  const days = daysUntil(nextDue);
  if (days < 0) return 'overdue';
  if (days <= 30) return 'due_soon';
  return 'ok';
}

export function computeNextEuControl(lastControl: string, totalWeight_kg: number): string {
  const d = new Date(lastControl);
  d.setFullYear(d.getFullYear() + (totalWeight_kg <= 3500 ? 2 : 1));
  return d.toISOString().split('T')[0];
}

export function computeNextService(lastService: string, intervalMonths: number): string {
  const d = new Date(lastService);
  d.setMonth(d.getMonth() + intervalMonths);
  return d.toISOString().split('T')[0];
}

// ========================
// Workshop email
// ========================

const WORKSHOP_TYPE_LABELS: Record<WorkshopRequestType, string> = {
  scheduled_service: 'planlagt service',
  repair: 'reparasjon',
  eu_control: 'EU-kontroll',
  damage_fix: 'skadeutbedring',
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'lav',
  medium: 'middels',
  high: 'hoy',
  urgent: 'haster',
};

export function generateWorkshopMailto(request: WorkshopRequest, warehouseName: string): string {
  const typeLabel = WORKSHOP_TYPE_LABELS[request.type] || request.type;
  const priorityLabel = PRIORITY_LABELS[request.priority] || request.priority;
  const subject = `Verkstedforespørsel — ${request.trailerBarcode} — ${typeLabel} (${priorityLabel})`;
  const body = `Hei ${request.workshopName},\n\nVi har en forespørsel om ${typeLabel} for tilhenger ${request.trailerBarcode}.\n\nButikk: ${warehouseName}\nPrioritet: ${priorityLabel}\nBeskrivelse: ${request.description}\n\nKontakt oss for å avtale tid.\n\nVennlig hilsen\n${warehouseName}`;
  return `mailto:${request.workshopEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ========================
// Stats computation
// ========================

export interface RentalStats {
  totalRentals: number;
  totalRevenue: number;
  avgDurationHours: number;
  rentalsByDay: { label: string; value: number }[];
  rentalsByType: { label: string; value: number }[];
}

const DAY_LABELS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'];

export function computeRentalStats(rentals: Rental[]): RentalStats {
  const totalRentals = rentals.length;
  const totalRevenue = rentals.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const avgDurationHours = totalRentals > 0
    ? Math.round(rentals.reduce((sum, r) => sum + r.durationHours, 0) / totalRentals)
    : 0;

  // By day of week
  const dayCounts = Array(7).fill(0);
  for (const r of rentals) {
    const d = new Date(r.pickupTime).getDay();
    dayCounts[d === 0 ? 6 : d - 1]++;
  }
  const rentalsByDay = DAY_LABELS.map((label, i) => ({ label, value: dayCounts[i] }));

  // By trailer type
  const typeCounts: Record<string, number> = {};
  for (const r of rentals) {
    const type = r.trailer?.type || 'unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
  const rentalsByType = Object.entries(typeCounts).map(([type, value]) => ({
    label: TRAILER_TYPE_LABELS[type] || type,
    value,
  }));

  return { totalRentals, totalRevenue, avgDurationHours, rentalsByDay, rentalsByType };
}
