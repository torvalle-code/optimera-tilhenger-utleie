'use client';

import React, { useState } from 'react';
import { Card, Badge } from '@/components/ui';
import { ProgressBar } from '@/components/ui/charts';
import {
  ROADMAP_PHASES,
  getPhaseProgress,
  getPhaseColor,
  getStatusBadgeColor,
  getStatusLabel,
  getItemStatusIcon,
} from '@/lib/roadmap/roadmap-data';
import type { PhaseStatus } from '@/lib/roadmap/roadmap-data';

const STATUS_ICON_COLORS: Record<PhaseStatus, string> = {
  completed: 'text-green-600',
  'in-progress': 'text-blue-600',
  planned: 'text-amber-600',
  future: 'text-gray-400',
};

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(
    ROADMAP_PHASES.find((p) => p.status === 'in-progress')?.id || null
  );

  const totalItems = ROADMAP_PHASES.reduce((sum, p) => sum + p.items.length, 0);
  const completedItems = ROADMAP_PHASES.reduce(
    (sum, p) => sum + p.items.filter((i) => i.status === 'completed').length,
    0
  );
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prosjekt-roadmap</h1>
        <p className="text-sm text-gray-500 mt-1">Optimera Tilhengerutleie — utviklingsplan</p>
      </div>

      {/* Overall progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Total fremdrift</span>
          <span className="text-sm text-gray-500">{completedItems} av {totalItems} oppgaver</span>
        </div>
        <ProgressBar value={overallProgress} color={overallProgress === 100 ? 'green' : 'blue'} />
      </Card>

      {/* Phases */}
      <div className="space-y-4">
        {ROADMAP_PHASES.map((phase) => {
          const progress = getPhaseProgress(phase);
          const isExpanded = expandedPhase === phase.id;
          const doneCount = phase.items.filter((i) => i.status === 'completed').length;

          return (
            <Card key={phase.id}>
              <div
                className="cursor-pointer"
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">{phase.name}</h2>
                    <Badge color={getStatusBadgeColor(phase.status)}>{getStatusLabel(phase.status)}</Badge>
                    <span className="text-xs text-gray-400">{phase.version}</span>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <ProgressBar
                  value={progress}
                  color={getPhaseColor(phase.status)}
                  label={`${doneCount} av ${phase.items.length} fullfort`}
                />

                {!isExpanded && (
                  <p className="text-sm text-gray-500 mt-2">{phase.summary}</p>
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-sm text-gray-600 mb-3">{phase.summary}</p>
                  {phase.items.map((item) => (
                    <div key={item.id} className="pl-2">
                      <div className="flex items-start gap-2">
                        <span className={`text-base font-mono mt-0.5 ${STATUS_ICON_COLORS[item.status]}`}>
                          {getItemStatusIcon(item.status)}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          {item.details && item.details.length > 0 && (
                            <ul className="mt-1.5 space-y-0.5">
                              {item.details.map((detail, di) => (
                                <li key={di} className="text-xs text-gray-400 flex items-start gap-1.5">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
