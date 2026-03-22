'use client';

import { WarehouseProvider } from '@/components/terminal/WarehouseProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function TerminalShell({ children }: { children: React.ReactNode }) {
  return (
    <WarehouseProvider>
      <ErrorBoundary>
        <div className="terminal-mode min-h-screen bg-gray-50 flex flex-col max-w-[540px] mx-auto">
          {children}
        </div>
      </ErrorBoundary>
    </WarehouseProvider>
  );
}
