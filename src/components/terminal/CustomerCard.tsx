'use client';

import React from 'react';
import { Customer } from '@/lib/types';
import { Badge } from '../ui';

const customerTypeLabels: Record<string, string> = {
  proff: 'Proff',
  privat: 'Privat',
  guest: 'Gjest',
};

const customerTypeColors: Record<string, string> = {
  proff: 'bg-blue-100 text-blue-800',
  privat: 'bg-purple-100 text-purple-800',
  guest: 'bg-gray-100 text-gray-800',
};

interface CustomerCardProps {
  customer: Customer;
  compact?: boolean;
}

export function CustomerCard({ customer, compact = false }: CustomerCardProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{customer.phone}</p>
        </div>
        <Badge color={customerTypeColors[customer.type]}>
          {customerTypeLabels[customer.type]}
        </Badge>
      </div>

      {!compact && (
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          {customer.companyName && <p>{customer.companyName}</p>}
          {customer.optimeraNr && <p>Optimera-nr: {customer.optimeraNr}</p>}
          {customer.kundeklubbNr && <p>Kundeklubb: {customer.kundeklubbNr}</p>}
          {customer.email && <p>{customer.email}</p>}
        </div>
      )}
    </div>
  );
}
