'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Badge } from '@/components/ui';
import { findTrailerById, getRentalsForTrailer, getServiceRecordsForTrailer } from '@/lib/demo/admin-data';
import { TRAILER_TYPE_LABELS } from '@/lib/constants';
import { getEuControlStatus, getServiceUrgency, formatDate, daysUntil } from '@/lib/admin/helpers';

const TABS = ['Detaljer', 'Service', 'EU-kontroll', 'Utleiehistorikk'] as const;
const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800', rented: 'bg-red-100 text-red-800',
  reserved: 'bg-blue-100 text-blue-800', maintenance: 'bg-orange-100 text-orange-800',
};
const STATUS_LABELS: Record<string, string> = {
  available: 'Ledig', rented: 'Utleid', reserved: 'Reservert', maintenance: 'Vedlikehold',
};

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value ?? '—'}</span>
    </div>
  );
}

export default function TrailerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const trailer = findTrailerById(id);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Detaljer');

  if (!trailer) return <div className="p-6 text-center text-gray-400">Tilhenger ikke funnet</div>;

  const rentals = getRentalsForTrailer(id);
  const serviceRecords = getServiceRecordsForTrailer(id);
  const euStatus = getEuControlStatus(trailer.nextEuControlDue);
  const svcStatus = getServiceUrgency(trailer.nextServiceDue);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <a href="/admin/fleet" className="text-sm text-gray-500 hover:text-gray-700">Flate</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">{trailer.barcode} — {trailer.name}</h1>
        <Badge color={STATUS_COLORS[trailer.status] || 'bg-gray-100 text-gray-600'}>{STATUS_LABELS[trailer.status] || trailer.status}</Badge>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#E52629] text-[#E52629]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Detaljer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Vognkort">
            <KV label="Merke" value={trailer.brand} />
            <KV label="Modell" value={trailer.model} />
            <KV label="Arsmodell" value={trailer.yearOfManufacture} />
            <KV label="Forstegangsreg." value={trailer.firstRegistered ? formatDate(trailer.firstRegistered) : '—'} />
            <KV label="Reg.nr" value={trailer.registrationNumber} />
            <KV label="Chassis" value={trailer.chassisNumber} />
            <KV label="Type" value={TRAILER_TYPE_LABELS[trailer.type]} />
          </Card>
          <Card title="Vekt og kopling">
            <KV label="Totalvekt" value={trailer.totalPermittedWeight_kg ? `${trailer.totalPermittedWeight_kg} kg` : '—'} />
            <KV label="Egenvekt" value={trailer.ownWeight_kg ? `${trailer.ownWeight_kg} kg` : '—'} />
            <KV label="Nyttelast" value={trailer.payloadCapacity_kg ? `${trailer.payloadCapacity_kg} kg` : '—'} />
            <KV label="Forerkortklasse" value={trailer.requiredLicenseClass} />
            <KV label="Kopling" value={trailer.couplingType?.replace('_', ' ')} />
            <KV label="Bremser" value={trailer.hasBrakes ? 'Ja' : 'Nei'} />
            <KV label="Handbrems" value={trailer.hasHandbrake ? 'Ja' : 'Nei'} />
          </Card>
          <Card title="Forsikring">
            <KV label="Selskap" value={trailer.insuranceCompany} />
            <KV label="Polisenr" value={trailer.insurancePolicyNumber} />
            <KV label="Utloper" value={trailer.insuranceExpiry ? formatDate(trailer.insuranceExpiry) : '—'} />
          </Card>
          <Card title="Dimensjoner">
            <KV label="Lengde innvendig" value={`${trailer.dimensions.lengthInner_cm} cm`} />
            <KV label="Bredde innvendig" value={`${trailer.dimensions.widthInner_cm} cm`} />
            <KV label="Sidehøyde" value={`${trailer.dimensions.heightSides_cm} cm`} />
          </Card>
        </div>
      )}

      {tab === 'Service' && (
        <Card title="Servicehistorikk">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Neste service:</span>
            <span className="text-sm font-medium">{trailer.nextServiceDue ? formatDate(trailer.nextServiceDue) : '—'}</span>
            <Badge color={svcStatus === 'ok' ? 'bg-green-100 text-green-800' : svcStatus === 'due_soon' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
              {svcStatus === 'ok' ? 'OK' : svcStatus === 'due_soon' ? 'Snart' : 'Forfallt'}
            </Badge>
          </div>
          {serviceRecords.length === 0 ? <p className="text-sm text-gray-400">Ingen servicehistorikk</p> : (
            <div className="space-y-3">
              {serviceRecords.map(s => (
                <div key={s.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{formatDate(s.date)} — {s.type === 'scheduled' ? 'Planlagt' : s.type === 'repair' ? 'Reparasjon' : s.type === 'eu_control' ? 'EU-kontroll' : s.type}</span>
                    {s.cost && <span className="text-sm text-gray-500">kr {s.cost.toLocaleString('nb-NO')}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'EU-kontroll' && (
        <Card title="EU-kontroll">
          <KV label="Siste kontroll" value={trailer.lastEuControl ? formatDate(trailer.lastEuControl) : '—'} />
          <KV label="Neste forfallsdato" value={trailer.nextEuControlDue ? formatDate(trailer.nextEuControlDue) : '—'} />
          <KV label="Dager igjen" value={trailer.nextEuControlDue ? daysUntil(trailer.nextEuControlDue) : '—'} />
          <KV label="Status" value={
            <Badge color={euStatus === 'valid' ? 'bg-green-100 text-green-800' : euStatus === 'due_soon' ? 'bg-yellow-100 text-yellow-800' : euStatus === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}>
              {euStatus === 'valid' ? 'Gyldig' : euStatus === 'due_soon' ? 'Forfaller snart' : euStatus === 'overdue' ? 'Forfallt' : 'Fritatt'}
            </Badge>
          } />
        </Card>
      )}

      {tab === 'Utleiehistorikk' && (
        <Card title="Utleiehistorikk">
          {rentals.length === 0 ? <p className="text-sm text-gray-400">Ingen utleier registrert</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Ref</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Kunde</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Henting</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Retur</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(r => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono">{r.sharefoxBookingRef}</td>
                    <td className="py-2 px-3">{r.customer.name}</td>
                    <td className="py-2 px-3">{formatDate(r.pickupTime)}</td>
                    <td className="py-2 px-3">{formatDate(r.returnTime)}</td>
                    <td className="py-2 px-3">
                      <Badge color={r.status === 'active' ? 'bg-blue-100 text-blue-800' : r.status === 'overdue' ? 'bg-red-100 text-red-800' : r.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                        {r.status === 'active' ? 'Aktiv' : r.status === 'overdue' ? 'Forsinket' : r.status === 'completed' ? 'Fullfort' : r.status === 'returned' ? 'Returnert' : r.status === 'pending' ? 'Ventende' : 'Kansellert'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}
