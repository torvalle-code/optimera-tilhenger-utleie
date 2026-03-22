'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { DEMO_FLEET_EXTENDED } from '@/lib/demo/admin-data';
import { getServiceUrgency, daysUntil, formatDate } from '@/lib/admin/helpers';
import { TRAILER_TYPE_LABELS } from '@/lib/constants';

const URGENCY_COLORS: Record<string, string> = {
  overdue: 'bg-red-100 text-red-800', due_soon: 'bg-yellow-100 text-yellow-800', ok: 'bg-green-100 text-green-800',
};
const URGENCY_LABELS: Record<string, string> = { overdue: 'Forfallt', due_soon: 'Snart', ok: 'OK' };

export default function ServiceOverviewPage() {
  const fleet = DEMO_FLEET_EXTENDED;
  const sorted = [...fleet].sort((a, b) => {
    const da = a.nextServiceDue ? daysUntil(a.nextServiceDue) : 999;
    const db = b.nextServiceDue ? daysUntil(b.nextServiceDue) : 999;
    return da - db;
  });

  const overdue = fleet.filter(t => getServiceUrgency(t.nextServiceDue) === 'overdue').length;
  const dueSoon = fleet.filter(t => getServiceUrgency(t.nextServiceDue) === 'due_soon').length;
  const ok = fleet.filter(t => getServiceUrgency(t.nextServiceDue) === 'ok').length;

  const stats = [
    { label: 'Forfallt', value: overdue, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Innen 30 dager', value: dueSoon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'OK', value: ok, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Service</h1>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Strekkode</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Navn</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Siste service</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Neste service</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Dager</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(t => {
                const urgency = getServiceUrgency(t.nextServiceDue);
                const days = t.nextServiceDue ? daysUntil(t.nextServiceDue) : null;
                return (
                  <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 ${urgency === 'overdue' ? 'bg-red-50/50' : ''}`}>
                    <td className="py-2 px-3 font-mono">{t.barcode}</td>
                    <td className="py-2 px-3 font-medium">{t.name}</td>
                    <td className="py-2 px-3 text-gray-600">{TRAILER_TYPE_LABELS[t.type]}</td>
                    <td className="py-2 px-3">{t.lastServiceDate ? formatDate(t.lastServiceDate) : '—'}</td>
                    <td className="py-2 px-3">{t.nextServiceDue ? formatDate(t.nextServiceDue) : '—'}</td>
                    <td className="py-2 px-3 font-medium">
                      {days !== null ? (days < 0 ? <span className="text-red-600">{days}</span> : days) : '—'}
                    </td>
                    <td className="py-2 px-3"><Badge color={URGENCY_COLORS[urgency]}>{URGENCY_LABELS[urgency]}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
