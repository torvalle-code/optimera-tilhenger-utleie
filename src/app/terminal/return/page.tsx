'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { ScanInput } from '@/components/terminal/ScanInput';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { InspectionChecklist } from '@/components/terminal/InspectionChecklist';
import { Button, Input } from '@/components/ui';
import { Trailer, InspectionItem, InspectionChecklist as ChecklistType, DamageReport } from '@/lib/types';
import { useSharefox } from '@/hooks/useSharefox';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { DEFAULT_INSPECTION_ITEMS, WORKSHOP_CONFIGS } from '@/lib/constants';

type Phase = 'scan' | 'inspect' | 'success';

function createInspectionItems(): InspectionItem[] {
  return DEFAULT_INSPECTION_ITEMS.map(item => ({
    ...item,
    checked: false,
    status: 'ok' as const,
    notes: undefined,
  }));
}

function determineOverallStatus(items: InspectionItem[]): ChecklistType['overallStatus'] {
  if (items.some(i => i.status === 'major_damage')) return 'failed';
  if (items.some(i => i.status === 'minor_damage' || (i.notes && i.notes.trim()))) return 'passed_with_notes';
  return 'passed';
}

export default function ReturnPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const { lookupByBarcode, confirmReturn, loading: sfLoading } = useSharefox();

  const [phase, setPhase] = useState<Phase>('scan');
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Inspect phase state
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(createInspectionItems);
  const [damageDescription, setDamageDescription] = useState('');
  const [staffName, setStaffName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success phase state
  const [wasQueued, setWasQueued] = useState(false);
  const [workshopNotified, setWorkshopNotified] = useState(false);

  const workshopConfig = WORKSHOP_CONFIGS.find(w => w.warehouseCode === warehouse.code);

  const handleScan = useCallback(async (barcode: string) => {
    setError(null);
    setScanning(true);
    try {
      const found = await lookupByBarcode(barcode);
      if (!found) {
        setError(`Fant ingen tilhenger med strekkode "${barcode}"`);
        return;
      }
      if (found.status !== 'rented') {
        setError('Denne tilhengeren er ikke registrert som utleid');
        setTrailer(found);
        return;
      }
      setTrailer(found);
      setPhase('inspect');
    } finally {
      setScanning(false);
    }
  }, [lookupByBarcode]);

  const handleItemUpdate = useCallback((itemId: string, update: Partial<InspectionItem>) => {
    setInspectionItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...update } : item
    ));
  }, []);

  const hasDamage = inspectionItems.some(
    i => i.status === 'minor_damage' || i.status === 'major_damage'
  );
  const hasMajorDamage = inspectionItems.some(i => i.status === 'major_damage');
  const allChecked = inspectionItems.every(i => i.checked);
  const hasStaffName = staffName.trim().length > 0;
  const canSubmit = allChecked && hasStaffName && !isSubmitting;

  const handleConfirmReturn = async () => {
    if (!trailer || !canSubmit) return;
    setIsSubmitting(true);

    const damageReport: DamageReport | undefined = hasDamage
      ? {
          hasDamage: true,
          description: damageDescription.trim() || undefined,
        }
      : undefined;

    try {
      const result = await confirmReturn(
        trailer.currentRentalId || trailer.id,
        trailer.sharefoxProductId || '',
        damageReport
      );

      setWasQueued(result.queued);

      // Check if workshop should be notified
      if (hasDamage && workshopConfig?.notifyOnDamageReturn) {
        setWorkshopNotified(true);
      }

      setPhase('success');
    } catch {
      setError('Noe gikk galt. Prov igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = scanning || sfLoading;

  return (
    <>
      <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        {/* Back button + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (phase === 'inspect') {
                setPhase('scan');
                setTrailer(null);
                setInspectionItems(createInspectionItems());
              } else {
                router.back();
              }
            }}
            className="touch-target flex items-center justify-center"
            aria-label="Tilbake"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">
            {phase === 'scan' && 'Innlevering'}
            {phase === 'inspect' && 'Kontroll ved innlevering'}
            {phase === 'success' && 'Innlevering registrert'}
          </h1>
        </div>

        {/* ======================== PHASE 1: SCAN ======================== */}
        {phase === 'scan' && (
          <>
            <ScanInput onScan={handleScan} placeholder="Skann tilhenger for innlevering..." />

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-[#E52629] rounded-full" />
                <span className="ml-2 text-sm text-gray-500">Soker...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            {trailer && trailer.status !== 'rented' && (
              <TrailerCard trailer={trailer} />
            )}

            {/* Demo buttons */}
            {!trailer && !isLoading && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Hurtigtest (demo)</p>
                {['TH-SKI-001', 'TH-SKI-002', 'TH-SKI-003', 'TH-SKI-004'].map((code) => (
                  <button
                    key={code}
                    onClick={() => handleScan(code)}
                    className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    aria-label={`Test med strekkode ${code}`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ======================== PHASE 2: INSPECT ======================== */}
        {phase === 'inspect' && trailer && (
          <>
            <TrailerCard trailer={trailer} compact />

            {/* Major damage warning */}
            {hasMajorDamage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
                <p className="text-red-800 font-medium">Alvorlig skade registrert</p>
                <p className="text-red-600 text-sm mt-1">
                  Tilhengeren vil bli satt til vedlikehold etter innlevering.
                </p>
              </div>
            )}

            {/* Inspection checklist */}
            <InspectionChecklist
              items={inspectionItems}
              onItemUpdate={handleItemUpdate}
              title="Sjekkliste for innlevering"
              mode="return"
            />

            {/* Damage description */}
            {hasDamage && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Skadebeskrivelse</label>
                <textarea
                  className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg text-base
                    focus:outline-none focus:ring-2 focus:ring-[#E52629]"
                  placeholder="Beskriv skaden i detalj..."
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                />
              </div>
            )}

            {/* Staff name */}
            <Input
              label="Kontrollert av"
              inputSize="terminal"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Ditt navn"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="mt-auto pt-4">
              <Button
                size="terminal"
                variant="primary"
                onClick={handleConfirmReturn}
                disabled={!canSubmit}
                aria-label="Bekreft innlevering"
              >
                {isSubmitting
                  ? 'Registrerer innlevering...'
                  : `Bekreft innlevering (${inspectionItems.filter(i => i.checked).length}/${inspectionItems.length})`}
              </Button>
            </div>
          </>
        )}

        {/* ======================== PHASE 3: SUCCESS ======================== */}
        {phase === 'success' && (
          <>
            {/* Success banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-800">Innlevering registrert!</h2>
              {trailer && (
                <p className="text-sm text-green-600 mt-1">{trailer.name} ({trailer.registrationNumber})</p>
              )}
            </div>

            {/* Queued notice */}
            {wasQueued && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 flex items-center gap-2" role="status">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-orange-800 text-sm font-medium">Lagret lokalt — synkroniseres nar nett er tilgjengelig</span>
              </div>
            )}

            {/* Workshop notified */}
            {workshopNotified && workshopConfig && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4" role="status">
                <div className="flex items-start gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium text-sm">Verksted varslet</p>
                    <p className="text-blue-600 text-xs mt-0.5">
                      {workshopConfig.defaultWorkshopName} er varslet om skaderegistrering.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Damage summary */}
            {hasDamage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium text-sm">Skade registrert</p>
                {damageDescription.trim() && (
                  <p className="text-red-600 text-sm mt-1">{damageDescription}</p>
                )}
              </div>
            )}

            <div className="mt-auto space-y-3 pt-4">
              <Button
                size="terminal"
                variant="primary"
                onClick={() => router.push('/terminal')}
                aria-label="Tilbake til startskjerm"
              >
                Tilbake til start
              </Button>

              <Button
                size="terminal"
                variant="secondary"
                onClick={() => {
                  setPhase('scan');
                  setTrailer(null);
                  setInspectionItems(createInspectionItems());
                  setDamageDescription('');
                  setStaffName('');
                  setError(null);
                }}
                aria-label="Registrer ny innlevering"
              >
                Ny innlevering
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
