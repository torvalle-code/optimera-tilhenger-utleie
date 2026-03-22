'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface ScanInputProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
  label?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

/**
 * DataWedge-compatible barcode scan input.
 *
 * DataWedge on Zebra TC27 injects scanned barcode as keystrokes
 * followed by an ENTER key. This component:
 * 1. Auto-focuses on mount
 * 2. Listens for Enter key (DataWedge scan complete)
 * 3. Calls onScan with the scanned value
 * 4. Clears and re-focuses for next scan
 */
export function ScanInput({
  onScan,
  placeholder = 'Skann strekkode...',
  label = 'Strekkode',
  autoFocus = true,
  disabled = false,
}: ScanInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = inputRef.current?.value.trim();
        if (value) {
          onScan(value);
          if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
          }
        }
      }
    },
    [onScan]
  );

  // Re-focus when user taps outside (important for kiosk mode)
  const handleBlur = useCallback(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="12" y1="7" x2="12" y2="17" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full h-16 pl-14 pr-4 text-xl border-2 border-gray-300 rounded-xl bg-white
            focus:outline-none focus:ring-2 focus:ring-[#E52629] focus:border-[#E52629]
            disabled:bg-gray-100 disabled:text-gray-400"
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={disabled}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Pek skanneren mot strekkoden, eller skriv inn manuelt og trykk Enter
      </p>
    </div>
  );
}
