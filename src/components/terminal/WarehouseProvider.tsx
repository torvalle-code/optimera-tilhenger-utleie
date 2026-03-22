'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Warehouse } from '@/lib/types';
import { WAREHOUSES } from '@/lib/constants';

interface WarehouseContextValue {
  warehouse: Warehouse;
  setWarehouseByCode: (code: string) => void;
  allWarehouses: Warehouse[];
}

const WarehouseContext = createContext<WarehouseContextValue | null>(null);

function getDefaultWarehouse(): Warehouse {
  const defaultCode =
    typeof window !== 'undefined'
      ? localStorage.getItem('selected_warehouse') || undefined
      : undefined;

  if (defaultCode) {
    const found = WAREHOUSES.find((w) => w.code === defaultCode);
    if (found) return found;
  }

  return WAREHOUSES[0];
}

export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [warehouse, setWarehouse] = useState<Warehouse>(WAREHOUSES[0]);

  useEffect(() => {
    setWarehouse(getDefaultWarehouse());
  }, []);

  const setWarehouseByCode = (code: string) => {
    const found = WAREHOUSES.find((w) => w.code === code);
    if (found) {
      setWarehouse(found);
      localStorage.setItem('selected_warehouse', code);
    }
  };

  return (
    <WarehouseContext.Provider value={{ warehouse, setWarehouseByCode, allWarehouses: WAREHOUSES }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse(): WarehouseContextValue {
  const ctx = useContext(WarehouseContext);
  if (!ctx) {
    // Fallback for pages outside provider (e.g., admin)
    return {
      warehouse: WAREHOUSES[0],
      setWarehouseByCode: () => {},
      allWarehouses: WAREHOUSES,
    };
  }
  return ctx;
}
