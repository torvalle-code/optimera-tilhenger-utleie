'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Badge, Input, Select, Button } from '@/components/ui';
import { DEMO_FLEET_EXTENDED } from '@/lib/demo/admin-data';
import { TRAILER_TYPE_LABELS } from '@/lib/constants';
import { getEuControlStatus, getServiceUrgency, daysUntil } from '@/lib/admin/helpers';

const STATUS_LABELS: Record<string, string> = {
  available: 'Ledig', rented: 'Utleid', reserved: 'Reservert', maintenance: 'Vedlikehold', retired: 'Utgatt',
};
const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800', rented: 'bg-red-100 text-red-800',
  reserved: 'bg-blue-100 text-blue-800', maintenance: 'bg-orange-100 text-orange-800', retired: 'bg-gray-100 text-gray-600',
};
const EU_COLORS: Record<string, string> = {
  valid: 'bg-green-100 text-green-800', due_soon: 'bg-yellow-100 text-yellow-800', overdue: 'bg-red-100 text-red-800', exempt: 'bg-gray-100 text-gray-600',
};
const EU_LABELS: Record<string, string> = { valid: 'OK', due_soon: 'Snart', overdue: 'Forfallt', exempt: 'Fritatt' };

export default function FleetListPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const typeOptions = [{ value: '', label: 'Alle typer' }, ...Object.entries(TRAILER_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))];
  const statusOptions = [{ value: '', label: 'Alle statuser' }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))];

  const filtered = useMemo(() => {
    return DEMO_FLEET_EXTENDED.filter(t => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.barcode.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || (t.registrationNumber || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [typeFilter, statusFilter, search]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Flate</h1>
        <Button size="sm" disabled>Registrer ny</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input placeholder="Sok strekkode, navn, regnr..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select options={typeOptions} value={typeFilter} onChange={e => setTypeFilter(e.target.value)} />
        <Select options={statusOptions} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Strekkode</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Navn</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Maks vekt</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">EU-kontroll</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Service</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const euStatus = getEuControlStatus(t.nextEuControlDue);
                const svcStatus = getServiceUrgency(t.nextServiceDue);
                return (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/admin/fleet/${t.id}`)}>
                    <td className="py-2 px-3 font-mono">{t.barcode}</td>
                    <td className="py-2 px-3 font-medium">{t.name}</td>
                    <td className="py-2 px-3 text-gray-600">{TRAILER_TYPE_LABELS[t.type]}</td>
                    <td className="py-2 px-3">{t.maxWeight_kg} kg</td>
                    <td className="py-2 px-3"><Badge color={STATUS_COLORS[t.status]}>{STATUS_LABELS[t.status]}</Badge></td>
                    <td className="py-2 px-3"><Badge color={EU_COLORS[euStatus]}>{EU_LABELS[euStatus]}</Badge></td>
                    <td className="py-2 px-3">
                      <Badge color={svcStatus === 'ok' ? 'bg-green-100 text-green-800' : svcStatus === 'due_soon' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                        {svcStatus === 'ok' ? 'OK' : svcStatus === 'due_soon' ? 'Snart' : 'Forfallt'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">Ingen tilhengere funnet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
