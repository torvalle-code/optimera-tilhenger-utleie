'use client';

import React from 'react';
import { StatusDot } from '../ui';

interface TerminalHeaderProps {
  warehouseName: string;
  syncStatus: 'online' | 'syncing' | 'offline';
  queueCount?: number;
}

export function TerminalHeader({ warehouseName, syncStatus, queueCount = 0 }: TerminalHeaderProps) {
  return (
    <header className="bg-[#101920] text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#E52629] rounded flex items-center justify-center text-white font-bold text-sm">
          O
        </div>
        <div>
          <div className="text-sm font-semibold">{warehouseName}</div>
          <div className="text-xs text-gray-400">Tilhengerutleie</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {queueCount > 0 && (
          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
            {queueCount} i ko
          </span>
        )}
        <StatusDot status={syncStatus} />
      </div>
    </header>
  );
}
