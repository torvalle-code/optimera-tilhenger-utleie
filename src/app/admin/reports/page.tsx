'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { ChartBar, ProgressBar } from '@/components/ui/charts';
import { DEMO_RENTALS, DEMO_FLEET_EXTENDED } from '@/lib/demo/admin-data';
import { computeRentalStats, getServiceUrgency } from '@/lib/admin/helpers';

export default function ReportsPage() {
  const stats = computeRentalStats(DEMO_RENTALS);
  const fleet = DEMO_FLEET_EXTENDED;

  const serviceOk = fleet.filter(t => getServiceUrgency(t.nextServiceDue) === 'ok').length;
  const servicePct = Math.round((serviceOk / fleet.length) * 100);

  const completedRentals = DEMO_RENTALS.filter(r => r.status === 'completed' || r.status === 'returned').length;
  const completionPct = stats.totalRentals > 0 ? Math.round((completedRentals / stats.totalRentals) * 100) : 0;

  const overdueCount = DEMO_RENTALS.filter(r => r.status === 'overdue').length;
  const overduePct = stats.totalRentals > 0 ? 100 - Math.round((overdueCount / stats.totalRentals) * 100) : 100;

  const statCards = [
    { label: 'Totalt utleier', value: stats.totalRentals, color: 'text-gray-900', bg: 'bg-gray-50' },
    { label: 'Total omsetning', value: `kr ${stats.totalRevenue.toLocaleString('nb-NO')}`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Snitt varighet', value: `${stats.avgDurationHours}t`, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Flatestorrelse', value: fleet.length, color: 'text-gray-900', bg: 'bg-gray-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rapporter</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Utleier per type">
          <ChartBar data={stats.rentalsByType} height={200} showValues />
        </Card>

        <Card title="Utleier per ukedag">
          <ChartBar data={stats.rentalsByDay.map(d => ({ ...d, color: '#3B82F6' }))} height={200} showValues />
        </Card>
      </div>

      <Card title="KPI-er">
        <div className="space-y-4">
          <ProgressBar label="Fullforte utleier" value={completionPct} color="green" />
          <ProgressBar label="Service i orden" value={servicePct} color="blue" />
          <ProgressBar label="Rettidig retur" value={overduePct} color="orange" />
        </div>
      </Card>
    </div>
  );
}
