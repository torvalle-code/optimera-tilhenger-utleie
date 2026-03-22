'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { InspectionChecklist } from '@/components/terminal/InspectionChecklist';
import { Button, Input } from '@/components/ui';
import { Trailer, Customer, Rental, InspectionItem, InspectionChecklist as ChecklistType } from '@/lib/types';
import { getRentalConfirmed, setRentalConfirmed } from '@/lib/storage';
import { DEFAULT_INSPECTION_ITEMS } from '@/lib/constants';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';

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

export default function CheckoutPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const [rental, setRental] = useState<Partial<Rental> | null>(null);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(createInspectionItems);
  const [staffName, setStaffName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = getRentalConfirmed();
    if (!stored) {
      router.replace('/terminal/scan');
      return;
    }
    setRental(stored);
  }, [router]);

  const handleItemUpdate = useCallback((itemId: string, update: Partial<InspectionItem>) => {
    setInspectionItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...update } : item
    ));
  }, []);

  const allRequiredChecked = inspectionItems
    .every(item => item.checked);
  const hasStaffName = staffName.trim().length > 0;
  const canSubmit = allRequiredChecked && hasStaffName && !isSubmitting;

  const hasMajorDamage = inspectionItems.some(i => i.status === 'major_damage');

  const handleConfirm = async () => {
    if (!rental || !canSubmit) return;
    setIsSubmitting(true);

    const checklist: ChecklistType = {
      completedAt: new Date().toISOString(),
      completedBy: staffName.trim(),
      items: inspectionItems,
      overallStatus: determineOverallStatus(inspectionItems),
    };

    const updatedRental = { ...rental, pickupChecklist: checklist };
    setRentalConfirmed(updatedRental);

    setIsSubmitting(false);
    router.push(`/terminal/rental/${rental.id}`);
  };

  if (!rental) return null;

  return (
    <>
      <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center" aria-label="Tilbake">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Utleveringskontroll</h1>
        </div>

        {/* Trailer summary */}
        {rental.trailer && <TrailerCard trailer={rental.trailer} compact />}

        {/* Customer summary */}
        {rental.customer && (
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="font-medium text-gray-900">{rental.customer.name}</p>
            <p className="text-sm text-gray-500">{rental.customer.phone}</p>
          </div>
        )}

        {/* Major damage warning */}
        {hasMajorDamage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
            <p className="text-red-800 font-medium">Alvorlig skade registrert</p>
            <p className="text-red-600 text-sm mt-1">Vurder om tilhengeren bor settes til vedlikehold.</p>
          </div>
        )}

        {/* Inspection checklist */}
        <InspectionChecklist
          items={inspectionItems}
          onItemUpdate={handleItemUpdate}
          title="Sjekkliste for utlevering"
          mode="pickup"
        />

        {/* Staff name */}
        <Input
          label="Kontrollert av"
          inputSize="terminal"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
          placeholder="Ditt navn"
        />

        {/* Submit */}
        <div className="mt-auto pt-4">
          <Button
            size="terminal"
            variant="primary"
            onClick={handleConfirm}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Godkjenner...' : `Godkjenn og lever ut (${inspectionItems.filter(i => i.checked).length}/${inspectionItems.length})`}
          </Button>
        </div>
      </main>
    </>
  );
}
