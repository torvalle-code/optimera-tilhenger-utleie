'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Select } from '@/components/ui';
import { DEMO_RENTALS } from '@/lib/demo/admin-data';
import { formatDate, formatDateTime } from '@/lib/admin/helpers';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ventende', active: 'Aktiv', overdue: 'Forsinket', returned: 'Returnert', completed: 'Fullfort', cancelled: 'Kansellert',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800', active: 'bg-blue-100 text-blue-800', overdue: 'bg-red-100 text-red-800',
  returned: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-gray-100 text-gray-500',
};

export default function RentalsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filterOptions = [{ value: '', label: 'Alle statuser' }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))];

  const filtered = useMemo(() => {
    if (!statusFilter) return DEMO_RENTALS;
    return DEMO_RENTALS.filter(r => r.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Utleier</h1>

      <div className="max-w-xs">
        <Select options={filterOptions} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Ref</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Tilhenger</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Kunde</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Henting</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Retur</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Timer</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Pris</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <React.Fragment key={r.id}>
                  <tr
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${r.status === 'overdue' ? 'bg-red-50/50' : ''}`}
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    <td className="py-2 px-3 font-mono text-xs">{r.sharefoxBookingRef}</td>
                    <td className="py-2 px-3">{r.trailer.barcode}</td>
                    <td className="py-2 px-3">{r.customer.name}</td>
                    <td className="py-2 px-3">{formatDate(r.pickupTime)}</td>
                    <td className="py-2 px-3">{formatDate(r.returnTime)}</td>
                    <td className="py-2 px-3">{r.durationHours}t</td>
                    <td className="py-2 px-3">{r.totalPrice ? `kr ${r.totalPrice}` : '—'}</td>
                    <td className="py-2 px-3"><Badge color={STATUS_COLORS[r.status]}>{STATUS_LABELS[r.status]}</Badge></td>
                  </tr>
                  {expanded === r.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><span className="text-gray-500 block">Sharefox ordre</span>{r.sharefoxOrderId}</div>
                          <div><span className="text-gray-500 block">Opprettet</span>{formatDateTime(r.createdAt)}</div>
                          <div><span className="text-gray-500 block">Faktisk henting</span>{r.actualPickup ? formatDateTime(r.actualPickup) : '—'}</div>
                          <div><span className="text-gray-500 block">Faktisk retur</span>{r.actualReturn ? formatDateTime(r.actualReturn) : '—'}</div>
                          <div><span className="text-gray-500 block">Ansatt henting</span>{r.staffPickup || '—'}</div>
                          <div><span className="text-gray-500 block">Ansatt retur</span>{r.staffReturn || '—'}</div>
                          <div><span className="text-gray-500 block">Depositum</span>{r.depositAmount ? `kr ${r.depositAmount}` : '—'}</div>
                          <div><span className="text-gray-500 block">Merknader</span>{r.notes || '—'}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">Ingen utleier funnet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
