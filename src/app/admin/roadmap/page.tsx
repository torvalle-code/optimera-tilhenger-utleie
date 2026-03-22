'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { ProgressBar } from '@/components/ui/charts';

interface Feature { label: string; done: boolean }
interface Phase { name: string; status: string; features: Feature[] }

const ROADMAP: Phase[] = [
  {
    name: 'Fase 1 — MVP Terminal',
    status: 'Fullfort',
    features: [
      { label: 'Butikkterminal med strekkodeskanning', done: true },
      { label: 'Utlevering og retur med sjekkliste', done: true },
      { label: 'Offline-ko med IndexedDB', done: true },
      { label: 'Sharefox API-integrasjon (mock)', done: true },
      { label: 'Grunnleggende admin-dashboard', done: true },
    ],
  },
  {
    name: 'Fase 2 — Admin & Flatestyring',
    status: 'Pagaende',
    features: [
      { label: 'Komplett flateoversikt med filter', done: true },
      { label: 'Tilhengerdetalj med vognkortdata', done: true },
      { label: 'Service- og EU-kontroll varsler', done: true },
      { label: 'Verkstedforesporsler', done: true },
      { label: 'Utleieliste med ekspandering', done: true },
      { label: 'Kalender med ukesvisning', done: true },
      { label: 'Kundesok og historikk', done: true },
      { label: 'Rapporter og KPI-er', done: false },
      { label: 'PDF-eksport materialliste', done: false },
    ],
  },
  {
    name: 'Fase 3 — Integrasjoner',
    status: 'Planlagt',
    features: [
      { label: 'Sharefox produksjons-API', done: false },
      { label: 'SMS-varsling ved forsinket retur', done: false },
      { label: 'Automatisk verksted-e-post', done: false },
      { label: 'Statens vegvesen EU-kontroll API', done: false },
      { label: 'M3 OIS100MI kundeordre', done: false },
    ],
  },
  {
    name: 'Fase 4 — Utrulling',
    status: 'Planlagt',
    features: [
      { label: 'Pilotbutikk: Monter Skien', done: false },
      { label: 'Monter Tonsberg + Fredrikstad', done: false },
      { label: 'Opplaering og dokumentasjon', done: false },
      { label: 'Produksjonsdeploy', done: false },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  Fullfort: 'bg-green-100 text-green-800',
  Pagaende: 'bg-blue-100 text-blue-800',
  Planlagt: 'bg-gray-100 text-gray-600',
};

export default function RoadmapPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Prosjekt-roadmap</h1>
      <p className="text-sm text-gray-500">Optimera Tilhengerutleie — utviklingsplan</p>

      <div className="space-y-6">
        {ROADMAP.map(phase => {
          const done = phase.features.filter(f => f.done).length;
          const pct = Math.round((done / phase.features.length) * 100);
          return (
            <Card key={phase.name}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">{phase.name}</h2>
                <Badge color={STATUS_COLORS[phase.status] || 'bg-gray-100 text-gray-600'}>{phase.status}</Badge>
              </div>
              <ProgressBar value={pct} color={pct === 100 ? 'green' : pct > 0 ? 'blue' : 'red'} label={`${done} av ${phase.features.length} fullfort`} />
              <div className="mt-3 space-y-1.5">
                {phase.features.map(f => (
                  <label key={f.label} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={f.done} readOnly className="rounded border-gray-300 text-[#E52629] focus:ring-[#E52629]" />
                    <span className={f.done ? 'text-gray-500 line-through' : 'text-gray-900'}>{f.label}</span>
                  </label>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
