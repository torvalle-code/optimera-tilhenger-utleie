'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { Button, Input, Select } from '@/components/ui';
import { Trailer, Customer, CustomerType } from '@/lib/types';
import { getRentalTrailer, setRentalCustomer } from '@/lib/storage';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { validateLicenseForTrailer } from '@/lib/rental/rental-logic';

export default function CustomerPage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { syncStatus, pendingCount } = useSyncQueue();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [customerType, setCustomerType] = useState<CustomerType>('proff');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [optimeraNr, setOptimeraNr] = useState('');
  const [kundeklubbNr, setKundeklubbNr] = useState('');
  const [driversLicenseClass, setDriversLicenseClass] = useState<'B' | 'B96' | 'BE' | ''>('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const stored = getRentalTrailer();
    if (stored) {
      setTrailer(stored);
    } else {
      router.replace('/terminal/scan');
    }
  }, [router]);

  const licenseValidation = useMemo(() => {
    if (!trailer || !driversLicenseClass) return null;
    return validateLicenseForTrailer(
      driversLicenseClass as 'B' | 'B96' | 'BE',
      trailer.maxWeight_kg
    );
  }, [trailer, driversLicenseClass]);

  const handleContinue = () => {
    const newErrors: string[] = [];
    if (!name.trim()) newErrors.push('Navn er påkrevd');
    if (!phone.trim()) newErrors.push('Telefon er påkrevd');
    if (customerType === 'proff' && !optimeraNr.trim()) {
      newErrors.push('Optimera-nummer er påkrevd for proff-kunder');
    }
    if (!driversLicenseClass) {
      newErrors.push('Førerkortklasse er påkrevd');
    }
    if (licenseValidation && !licenseValidation.valid) {
      newErrors.push(licenseValidation.message || 'Ugyldig førerkortklasse for denne tilhengeren');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const customer: Customer = {
      id: `cust-${Date.now()}`,
      type: customerType,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      optimeraNr: optimeraNr.trim() || undefined,
      kundeklubbNr: kundeklubbNr.trim() || undefined,
      driversLicense: true,
      driversLicenseClass: driversLicenseClass as 'B' | 'B96' | 'BE',
      idVerified: false,
    };

    setRentalCustomer(customer);
    router.push('/terminal/rental');
  };

  const typeButtons: { type: CustomerType; label: string }[] = [
    { type: 'proff', label: 'Proff' },
    { type: 'privat', label: 'Privat' },
    { type: 'guest', label: 'Gjest' },
  ];

  if (!trailer) return null;

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
          <h1 className="text-xl font-bold">Identifiser kunde</h1>
        </div>

        <TrailerCard trailer={trailer} compact />

        {/* Customer type toggle */}
        <div className="flex gap-2">
          {typeButtons.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => { setCustomerType(type); setErrors([]); }}
              aria-label={`Kundetype: ${label}`}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                customerType === type
                  ? 'bg-[#E52629] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          <Input
            label="Navn"
            inputSize="terminal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={customerType === 'proff' ? 'Firmanavn' : 'Fullt navn'}
          />
          <Input
            label="Telefon"
            inputSize="terminal"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="912 34 567"
          />
          <Select
            label="Førerkortklasse"
            selectSize="terminal"
            value={driversLicenseClass}
            onChange={(e) => setDriversLicenseClass(e.target.value as '' | 'B' | 'B96' | 'BE')}
            options={[
              { value: '', label: 'Velg klasse...' },
              { value: 'B', label: 'B — Personbil (tilhenger inntil 750 kg)' },
              { value: 'B96', label: 'B96 — Utvidet (samlet inntil 4250 kg)' },
              { value: 'BE', label: 'BE — Tilhenger inntil 3500 kg' },
            ]}
          />
          <Input
            label="E-post (valgfritt)"
            inputSize="terminal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kunde@eksempel.no"
          />
          {customerType === 'proff' && (
            <Input
              label="Optimera-nummer"
              inputSize="terminal"
              value={optimeraNr}
              onChange={(e) => setOptimeraNr(e.target.value)}
              placeholder="123456"
            />
          )}
          {customerType === 'privat' && (
            <Input
              label="Kundeklubb-nummer (valgfritt)"
              inputSize="terminal"
              value={kundeklubbNr}
              onChange={(e) => setKundeklubbNr(e.target.value)}
              placeholder="K-123456"
            />
          )}
        </div>

        {/* License validation warning */}
        {licenseValidation && licenseValidation.warning && licenseValidation.message && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4" role="alert">
            <div className="flex items-start gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-yellow-800 text-sm">{licenseValidation.message}</p>
            </div>
          </div>
        )}

        {/* License invalid error */}
        {licenseValidation && !licenseValidation.valid && !licenseValidation.warning && licenseValidation.message && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
            <p className="text-red-700 text-sm font-medium">{licenseValidation.message}</p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1" role="alert">
            {errors.map((err, i) => (
              <p key={i} className="text-red-700 text-sm">{err}</p>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button size="terminal" variant="primary" onClick={handleContinue} aria-label="Fortsett til bekreftelse">
            Fortsett — Bekreft utleie
          </Button>
        </div>
      </main>
    </>
  );
}
