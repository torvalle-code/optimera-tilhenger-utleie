'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge, Input } from '@/components/ui';
import { DEMO_CUSTOMERS, getRentalsForCustomer } from '@/lib/demo/admin-data';
import { formatDate } from '@/lib/admin/helpers';

const TYPE_LABELS: Record<string, string> = { proff: 'Proff', privat: 'Privat', guest: 'Gjest' };
const TYPE_COLORS: Record<string, string> = {
  proff: 'bg-purple-100 text-purple-800', privat: 'bg-blue-100 text-blue-800', guest: 'bg-gray-100 text-gray-600',
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return DEMO_CUSTOMERS;
    const q = search.toLowerCase();
    return DEMO_CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q) || (c.optimeraNr || '').toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Kunder</h1>

      <div className="max-w-md">
        <Input placeholder="Sok navn, telefon, e-post, Optimera-nr..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Navn</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Telefon</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">E-post</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Optimera-nr</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Utleier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const rentals = getRentalsForCustomer(c.id);
                return (
                  <React.Fragment key={c.id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                      <td className="py-2 px-3 font-medium">{c.name}</td>
                      <td className="py-2 px-3"><Badge color={TYPE_COLORS[c.type]}>{TYPE_LABELS[c.type]}</Badge></td>
                      <td className="py-2 px-3">{c.phone}</td>
                      <td className="py-2 px-3 text-gray-600">{c.email || '—'}</td>
                      <td className="py-2 px-3 font-mono text-xs">{c.optimeraNr || '—'}</td>
                      <td className="py-2 px-3 text-gray-600">{rentals.length}</td>
                    </tr>
                    {expanded === c.id && rentals.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-3">
                          <p className="text-xs font-medium text-gray-500 mb-2">Utleiehistorikk</p>
                          <div className="space-y-1">
                            {rentals.map(r => (
                              <div key={r.id} className="flex items-center gap-3 text-xs">
                                <span className="font-mono">{r.sharefoxBookingRef}</span>
                                <span>{r.trailer.barcode}</span>
                                <span className="text-gray-500">{formatDate(r.pickupTime)}</span>
                                <Badge color={r.status === 'completed' ? 'bg-green-100 text-green-800' : r.status === 'active' ? 'bg-blue-100 text-blue-800' : r.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}>
                                  {r.status}
                                </Badge>
                                {r.totalPrice && <span className="text-gray-500">kr {r.totalPrice}</span>}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Ingen kunder funnet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
