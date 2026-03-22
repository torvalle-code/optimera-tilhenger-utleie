'use client';

import React from 'react';
import { Trailer } from '@/lib/types';
import { Badge } from '../ui';
import { getStatusColor, getStatusLabel } from '@/lib/rental/status';

// Map trailer status to rental status labels (simplified)
const trailerStatusLabels: Record<string, string> = {
  available: 'Ledig',
  rented: 'Utleid',
  reserved: 'Reservert',
  maintenance: 'Vedlikehold',
  retired: 'Utgatt',
};

const trailerStatusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  rented: 'bg-red-100 text-red-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-orange-100 text-orange-800',
  retired: 'bg-gray-100 text-gray-500',
};

interface TrailerCardProps {
  trailer: Trailer;
  onClick?: () => void;
  compact?: boolean;
}

export function TrailerCard({ trailer, onClick, compact = false }: TrailerCardProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={`w-full bg-white rounded-xl border border-gray-200 p-4 text-left ${
        onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-md transition-all active:scale-[0.98]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{trailer.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{trailer.barcode}</p>
        </div>
        <Badge color={trailerStatusColors[trailer.status]}>
          {trailerStatusLabels[trailer.status]}
        </Badge>
      </div>

      {!compact && (
        <div className="mt-3 flex gap-4 text-sm text-gray-600">
          <span>{trailer.dimensions.lengthInner_cm} x {trailer.dimensions.widthInner_cm} cm</span>
          <span>{trailer.maxWeight_kg} kg maks</span>
          {trailer.registrationNumber && <span>{trailer.registrationNumber}</span>}
        </div>
      )}
    </Wrapper>
  );
}
