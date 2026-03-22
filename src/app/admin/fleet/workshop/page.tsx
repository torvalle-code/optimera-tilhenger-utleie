'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Select, Button } from '@/components/ui';
import { DEMO_WORKSHOP_REQUESTS } from '@/lib/demo/admin-data';
import { formatDate } from '@/lib/admin/helpers';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Utkast', sent: 'Sendt', acknowledged: 'Bekreftet', in_progress: 'Under arbeid', completed: 'Fullfort', cancelled: 'Kansellert',
};
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600', sent: 'bg-blue-100 text-blue-800', acknowledged: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
};
const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600', medium: 'bg-blue-100 text-blue-800', high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800',
};
const PRIORITY_LABELS: Record<string, string> = { low: 'Lav', medium: 'Middels', high: 'Hoy', urgent: 'Haster' };
const TYPE_LABELS: Record<string, string> = { scheduled_service: 'Planlagt service', repair: 'Reparasjon', eu_control: 'EU-kontroll', damage_fix: 'Skadeutbedring' };

export default function WorkshopPage() {
  const [filter, setFilter] = useState('');
  const filterOptions = [{ value: '', label: 'Alle statuser' }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))];

  const filtered = useMemo(() => {
    if (!filter) return DEMO_WORKSHOP_REQUESTS;
    return DEMO_WORKSHOP_REQUESTS.filter(r => r.status === filter);
  }, [filter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Verkstedforesporsler</h1>
        <Button size="sm" disabled>Ny forespørsel</Button>
      </div>

      <div className="max-w-xs">
        <Select options={filterOptions} value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Tilhenger</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Prioritet</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Verksted</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Dato</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Kost</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono">{r.trailerBarcode}</td>
                  <td className="py-2 px-3">{TYPE_LABELS[r.type] || r.type}</td>
                  <td className="py-2 px-3"><Badge color={PRIORITY_COLORS[r.priority]}>{PRIORITY_LABELS[r.priority]}</Badge></td>
                  <td className="py-2 px-3">{r.workshopName}</td>
                  <td className="py-2 px-3">{formatDate(r.requestDate)}</td>
                  <td className="py-2 px-3 text-gray-600">
                    {r.actualCost ? `kr ${r.actualCost.toLocaleString('nb-NO')}` : r.estimatedCost ? `~kr ${r.estimatedCost.toLocaleString('nb-NO')}` : '—'}
                  </td>
                  <td className="py-2 px-3"><Badge color={STATUS_COLORS[r.status]}>{STATUS_LABELS[r.status]}</Badge></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">Ingen foresporsler</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
