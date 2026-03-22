'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { TrailerCard } from '@/components/terminal/TrailerCard';
import { Button, Input } from '@/components/ui';
import { Trailer, Customer, CustomerType } from '@/lib/types';

export default function CustomerPage() {
  const router = useRouter();
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [customerType, setCustomerType] = useState<CustomerType>('proff');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [optimeraNr, setOptimeraNr] = useState('');
  const [kundeklubbNr, setKundeklubbNr] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('rental_trailer');
    if (stored) {
      setTrailer(JSON.parse(stored));
    } else {
      router.replace('/terminal/scan');
    }
  }, [router]);

  const handleContinue = () => {
    const newErrors: string[] = [];
    if (!name.trim()) newErrors.push('Navn er pakrevd');
    if (!phone.trim()) newErrors.push('Telefon er pakrevd');
    if (customerType === 'proff' && !optimeraNr.trim()) {
      newErrors.push('Optimera-nummer er pakrevd for proff-kunder');
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
      optimeraNr: optimeraNr.trim() || undefined,
      kundeklubbNr: kundeklubbNr.trim() || undefined,
      driversLicense: true,
      idVerified: false,
    };

    sessionStorage.setItem('rental_customer', JSON.stringify(customer));
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
      <TerminalHeader warehouseName="Monter Skien" syncStatus="online" />

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center">
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

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
            {errors.map((err, i) => (
              <p key={i} className="text-red-700 text-sm">{err}</p>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button size="terminal" variant="primary" onClick={handleContinue}>
            Fortsett — Bekreft utleie
          </Button>
        </div>
      </main>
    </>
  );
}
