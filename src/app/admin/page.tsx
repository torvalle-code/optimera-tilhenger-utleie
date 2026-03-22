'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { DEMO_FLEET_EXTENDED, DEMO_RENTALS } from '@/lib/demo/admin-data';
import { getFleetSummary } from '@/lib/fleet/trailers';
import { daysUntil, getEuControlStatus, getServiceUrgency, formatDate } from '@/lib/admin/helpers';
import { TRAILER_TYPE_LABELS } from '@/lib/constants';

const STATUS_COLORS: Record<string, string> = {
  valid: 'bg-green-100 text-green-800',
  due_soon: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  exempt: 'bg-gray-100 text-gray-600',
  ok: 'bg-green-100 text-green-800',
};

export default function AdminDashboardPage() {
  const fleet = DEMO_FLEET_EXTENDED;
  const summary = getFleetSummary(fleet);

  const euWarnings = fleet.filter(t => {
    const s = getEuControlStatus(t.nextEuControlDue);
    return s === 'overdue' || s === 'due_soon';
  });

  const svcWarnings = fleet.filter(t => {
    const s = getServiceUrgency(t.nextServiceDue);
    return s === 'overdue' || s === 'due_soon';
  });

  const activeRentals = DEMO_RENTALS.filter(r => r.status === 'active' || r.status === 'overdue');

  const stats = [
    { label: 'Utleid', value: summary.rented, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Ledig', value: summary.available, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Vedlikehold', value: summary.maintenance, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Totalt', value: summary.total, color: 'text-gray-900', bg: 'bg-gray-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Oversikt</h1>
        <p className="text-sm text-gray-500">Monter Skien — Tilhengerutleie</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {euWarnings.length > 0 && (
        <Card title="EU-kontroll varsler">
          <div className="space-y-2">
            {euWarnings.map(t => {
              const status = getEuControlStatus(t.nextEuControlDue);
              const days = t.nextEuControlDue ? daysUntil(t.nextEuControlDue) : 0;
              return (
                <div key={t.id} className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium">{t.barcode} — {t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{days < 0 ? `${Math.abs(days)} dager forfallt` : `${days} dager igjen`}</span>
                    <Badge color={STATUS_COLORS[status]}>{status === 'overdue' ? 'Forfallt' : 'Snart'}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {svcWarnings.length > 0 && (
        <Card title="Service varsler">
          <div className="space-y-2">
            {svcWarnings.map(t => {
              const status = getServiceUrgency(t.nextServiceDue);
              const days = t.nextServiceDue ? daysUntil(t.nextServiceDue) : 0;
              return (
                <div key={t.id} className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium">{t.barcode} — {t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{days < 0 ? `${Math.abs(days)} dager forfallt` : `${days} dager igjen`}</span>
                    <Badge color={STATUS_COLORS[status]}>{status === 'overdue' ? 'Forfallt' : 'Snart'}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {activeRentals.length > 0 && (
        <Card title="Aktive utleier">
          <div className="space-y-2">
            {activeRentals.map(r => (
              <div key={r.id} className="flex items-center justify-between py-1">
                <div>
                  <span className="text-sm font-medium">{r.trailer.barcode}</span>
                  <span className="text-sm text-gray-500 ml-2">{r.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Retur {formatDate(r.returnTime)}</span>
                  <Badge color={r.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                    {r.status === 'overdue' ? 'Forsinket' : 'Aktiv'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Flateoversikt">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Strekkode</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Navn</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Maks vekt</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono text-sm">{t.barcode}</td>
                  <td className="py-2 px-3">{t.name}</td>
                  <td className="py-2 px-3 text-gray-600">{TRAILER_TYPE_LABELS[t.type]}</td>
                  <td className="py-2 px-3">{t.maxWeight_kg} kg</td>
                  <td className="py-2 px-3">
                    <Badge color={
                      t.status === 'available' ? 'bg-green-100 text-green-800'
                        : t.status === 'rented' ? 'bg-red-100 text-red-800'
                        : t.status === 'reserved' ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }>
                      {t.status === 'available' ? 'Ledig' : t.status === 'rented' ? 'Utleid' : t.status === 'reserved' ? 'Reservert' : 'Vedlikehold'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
