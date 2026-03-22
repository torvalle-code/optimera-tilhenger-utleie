'use client';

import React, { useState, useMemo } from 'react';
import { Button, Badge } from '@/components/ui';
import { DEMO_FLEET_EXTENDED, DEMO_RENTALS } from '@/lib/demo/admin-data';
import { getMondayOfWeek, getWeekDates, getWeekNumber, formatDateShort } from '@/lib/admin/helpers';

const DAY_NAMES = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'];

function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start.slice(0, 10) && date <= end.slice(0, 10);
}

export default function CalendarPage() {
  const [monday, setMonday] = useState(() => getMondayOfWeek(new Date()));
  const weekDates = useMemo(() => getWeekDates(monday), [monday]);
  const weekNum = getWeekNumber(new Date(monday));

  const prevWeek = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() - 7);
    setMonday(d.toISOString().split('T')[0]);
  };
  const nextWeek = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 7);
    setMonday(d.toISOString().split('T')[0]);
  };
  const today = () => setMonday(getMondayOfWeek(new Date()));

  const fleet = DEMO_FLEET_EXTENDED;
  const rentals = DEMO_RENTALS.filter(r => r.status !== 'cancelled');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kalender</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevWeek}>Forrige</Button>
          <Button variant="secondary" size="sm" onClick={today}>I dag</Button>
          <Button variant="ghost" size="sm" onClick={nextWeek}>Neste</Button>
          <span className="text-sm text-gray-500 ml-2">Uke {weekNum}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header row */}
          <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
            <div className="bg-gray-50 p-2 text-xs font-medium text-gray-500">Tilhenger</div>
            {weekDates.map((date, i) => {
              const isToday = date === new Date().toISOString().split('T')[0];
              return (
                <div key={date} className={`p-2 text-xs font-medium text-center ${isToday ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                  <div>{DAY_NAMES[i]}</div>
                  <div className="font-bold">{formatDateShort(date)}</div>
                </div>
              );
            })}
          </div>

          {/* Trailer rows */}
          {fleet.map(trailer => (
            <div key={trailer.id} className="grid grid-cols-8 gap-px bg-gray-200">
              <div className="bg-white p-2 flex items-center">
                <div>
                  <div className="text-xs font-medium text-gray-900 truncate">{trailer.barcode}</div>
                  <div className="text-[10px] text-gray-400 truncate">{trailer.name}</div>
                </div>
              </div>
              {weekDates.map(date => {
                const rental = rentals.find(r =>
                  r.trailer.id === trailer.id && isDateInRange(date, r.pickupTime, r.returnTime)
                );
                const isMaintenance = trailer.status === 'maintenance';
                return (
                  <div key={date} className={`bg-white p-1 min-h-[48px] flex items-center justify-center ${isMaintenance && !rental ? 'bg-orange-50' : ''}`}>
                    {rental ? (
                      <Badge color={rental.status === 'overdue' ? 'bg-red-100 text-red-700' : rental.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}>
                        <span className="text-[10px] truncate max-w-[80px] block">{rental.customer.name.split(' ')[0]}</span>
                      </Badge>
                    ) : isMaintenance ? (
                      <span className="text-[10px] text-orange-500">Vedl.</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 inline-block" /> Aktiv</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Forsinket</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Reservert</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-50 inline-block border border-orange-200" /> Vedlikehold</span>
      </div>
    </div>
  );
}
