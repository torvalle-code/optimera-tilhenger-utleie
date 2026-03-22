'use client';

import React, { useState } from 'react';
import { Card, Input, Toggle, Button } from '@/components/ui';
import { WORKSHOP_CONFIGS, WAREHOUSES } from '@/lib/constants';

interface EditableConfig {
  warehouseCode: string;
  workshopName: string;
  workshopEmail: string;
  workshopPhone: string;
  serviceIntervalMonths: number;
  notifyOnDamageReturn: boolean;
  notifyOnServiceDue: boolean;
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState<EditableConfig[]>(() =>
    WAREHOUSES.map(wh => {
      const ws = WORKSHOP_CONFIGS.find(c => c.warehouseCode === wh.code);
      return {
        warehouseCode: wh.code,
        workshopName: ws?.defaultWorkshopName || '',
        workshopEmail: ws?.defaultWorkshopEmail || '',
        workshopPhone: ws?.defaultWorkshopPhone || '',
        serviceIntervalMonths: ws?.serviceIntervalMonths || 6,
        notifyOnDamageReturn: ws?.notifyOnDamageReturn ?? true,
        notifyOnServiceDue: ws?.notifyOnServiceDue ?? true,
      };
    })
  );

  const update = (idx: number, field: keyof EditableConfig, value: string | number | boolean) => {
    setConfigs(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const warehouseName = (code: string) => WAREHOUSES.find(w => w.code === code)?.name || code;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Innstillinger</h1>
      <p className="text-sm text-gray-500">Verkstedkonfigurasjon per butikk</p>

      <div className="space-y-6">
        {configs.map((cfg, idx) => (
          <Card key={cfg.warehouseCode} title={warehouseName(cfg.warehouseCode)}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Verksted navn" value={cfg.workshopName} onChange={e => update(idx, 'workshopName', e.target.value)} />
                <Input label="Verksted e-post" value={cfg.workshopEmail} onChange={e => update(idx, 'workshopEmail', e.target.value)} />
                <Input label="Verksted telefon" value={cfg.workshopPhone} onChange={e => update(idx, 'workshopPhone', e.target.value)} />
                <Input label="Serviceintervall (maneder)" type="number" value={cfg.serviceIntervalMonths} onChange={e => update(idx, 'serviceIntervalMonths', parseInt(e.target.value) || 6)} />
              </div>
              <div className="flex gap-6">
                <Toggle label="Varsle ved skaderetur" checked={cfg.notifyOnDamageReturn} onChange={v => update(idx, 'notifyOnDamageReturn', v)} />
                <Toggle label="Varsle ved service-forfall" checked={cfg.notifyOnServiceDue} onChange={v => update(idx, 'notifyOnServiceDue', v)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => alert('Innstillinger lagret (demo)')}>Lagre innstillinger</Button>
      </div>
    </div>
  );
}
