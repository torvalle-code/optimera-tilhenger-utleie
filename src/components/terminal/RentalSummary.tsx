'use client';

import React from 'react';
import { Rental } from '@/lib/types';
import { Badge } from '../ui';
import { getStatusLabel, getStatusColor } from '@/lib/rental/status';
import { formatDuration } from '@/lib/rental/rental-logic';
import { formatPrice } from '@/lib/rental/pricing';

interface RentalSummaryProps {
  rental: Partial<Rental>;
  showPrice?: boolean;
}

export function RentalSummary({ rental, showPrice = false }: RentalSummaryProps) {
  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {/* Trailer info */}
      {rental.trailer && (
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{rental.trailer.name}</h3>
              <p className="text-sm text-gray-500">{rental.trailer.barcode}</p>
            </div>
            {rental.status && (
              <Badge color={getStatusColor(rental.status)}>
                {getStatusLabel(rental.status)}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Customer info */}
      {rental.customer && (
        <div className="p-4">
          <p className="font-medium text-gray-900">{rental.customer.name}</p>
          <p className="text-sm text-gray-500">{rental.customer.phone}</p>
          {rental.customer.optimeraNr && (
            <p className="text-sm text-gray-500">Optimera: {rental.customer.optimeraNr}</p>
          )}
        </div>
      )}

      {/* Period */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Utlevering</span>
          <span className="text-gray-900 font-medium">{formatDate(rental.pickupTime)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Planlagt retur</span>
          <span className="text-gray-900 font-medium">{formatDate(rental.returnTime)}</span>
        </div>
        {rental.durationHours && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Varighet</span>
            <span className="text-gray-900 font-medium">{formatDuration(rental.durationHours)}</span>
          </div>
        )}
      </div>

      {/* Price */}
      {showPrice && rental.totalPrice !== undefined && (
        <div className="p-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Totalt</span>
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(rental.totalPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      {rental.notes && (
        <div className="p-4">
          <p className="text-sm text-gray-500">Merknad</p>
          <p className="text-sm text-gray-700 mt-1">{rental.notes}</p>
        </div>
      )}
    </div>
  );
}
