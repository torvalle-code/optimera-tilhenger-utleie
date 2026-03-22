'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { DEMO_FLEET, getFleetSummary } from '@/lib/fleet/trailers';
import { TRAILER_TYPE_LABELS } from '@/lib/constants';

export default function AdminDashboardPage() {
  const fleet = DEMO_FLEET;
  const summary = getFleetSummary(fleet);

  const statCards = [
    { label: 'Utleid', value: summary.rented, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Ledig', value: summary.available, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Vedlikehold', value: summary.maintenance, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Totalt', value: summary.total, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Oversikt</h1>
        <p className="text-sm text-gray-500">Monter Skien — Tilhengerutleie</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Fleet table */}
      <Card title="Flateoversikt">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Strekkode</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Maks vekt</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono">{t.barcode}</td>
                  <td className="py-2 px-3">{TRAILER_TYPE_LABELS[t.type] || t.type}</td>
                  <td className="py-2 px-3">{t.maxWeight_kg} kg</td>
                  <td className="py-2 px-3">
                    <Badge
                      color={
                        t.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : t.status === 'rented'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }
                    >
                      {t.status === 'available' ? 'Ledig' : t.status === 'rented' ? 'Utleid' : 'Vedlikehold'}
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
