'use client';

import React, { useMemo } from 'react';

function niceMax(value: number): number {
  if (value <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(value)));
  const norm = value / mag;
  if (norm <= 1) return mag;
  if (norm <= 2) return 2 * mag;
  if (norm <= 5) return 5 * mag;
  return 10 * mag;
}

// ========================
// CHART BAR
// ========================

interface ChartBarProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function ChartBar({ data, height = 200, showValues = false, className = '' }: ChartBarProps) {
  const vbW = 1000;
  const padL = 50, padR = 20, padT = showValues ? 28 : 12, padB = 48;
  const totalH = height + padB;
  const chartW = vbW - padL - padR;
  const chartH = height - padT;
  const maxVal = useMemo(() => niceMax(Math.max(...data.map(d => d.value), 0)), [data]);

  if (data.length === 0) return <div className={`w-full text-center text-sm text-gray-400 py-8 ${className}`}>Ingen data</div>;

  const n = data.length;
  const barW = Math.min(60, chartW / (n * 1.5));
  const gap = barW * 0.5;
  const totalW = n * barW + (n - 1) * gap;
  const startX = padL + (chartW - totalW) / 2;

  return (
    <div className={`w-full ${className}`}>
      <svg viewBox={`0 0 ${vbW} ${totalH}`} className="w-full h-auto">
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const y = padT + chartH * (1 - f);
          return <line key={f} x1={padL} y1={y} x2={vbW - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />;
        })}
        {data.map((d, i) => {
          const barH = maxVal > 0 ? (d.value / maxVal) * chartH : 0;
          const x = startX + i * (barW + gap);
          const y = padT + chartH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={Math.max(barH, 0)} rx={3} fill={d.color || '#E52629'} opacity={0.85} />
              {showValues && d.value > 0 && <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">{d.value}</text>}
              <text x={x + barW / 2} y={padT + chartH + 16} textAnchor="middle" fill="#6B7280" fontSize="9">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ========================
// PROGRESS BAR
// ========================

interface ProgressBarProps {
  value: number;
  color?: 'red' | 'green' | 'orange' | 'blue';
  label?: string;
  size?: 'sm' | 'md';
}

const PROGRESS_COLORS = { red: 'bg-[#E52629]', green: 'bg-[#22C55E]', orange: 'bg-[#F59E0B]', blue: 'bg-[#3B82F6]' };

export function ProgressBar({ value, color = 'red', label, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const h = size === 'sm' ? 'h-1.5' : 'h-2';
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">{label}</span>
          <span className="text-xs font-medium text-gray-900">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full ${h} bg-gray-200 rounded-full overflow-hidden`}>
        <div className={`${h} ${PROGRESS_COLORS[color]} rounded-full transition-all duration-300`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
