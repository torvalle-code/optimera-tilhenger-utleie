'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { Button } from '@/components/ui';
import { useWarehouse } from '@/components/terminal/WarehouseProvider';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { QueueItemStatus } from '@/lib/types';

const ACTION_LABELS: Record<string, string> = {
  create_rental: 'Ny utleie',
  confirm_pickup: 'Utlevering',
  confirm_return: 'Innlevering',
  update_status: 'Statusendring',
};

const STATUS_CONFIG: Record<QueueItemStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Venter', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  syncing: { label: 'Synkroniserer...', bg: 'bg-blue-100', text: 'text-blue-800' },
  synced: { label: 'Synkronisert', bg: 'bg-green-100', text: 'text-green-800' },
  failed: { label: 'Feilet', bg: 'bg-red-100', text: 'text-red-800' },
};

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function QueuePage() {
  const router = useRouter();
  const { warehouse } = useWarehouse();
  const { queue, syncStatus, pendingCount, failedCount, retryItem, clearCompleted, processQueue } = useSyncQueue();

  const hasSyncedItems = queue.some(q => q.status === 'synced');
  const isEmpty = queue.length === 0;

  return (
    <>
      <TerminalHeader warehouseName={warehouse.name} syncStatus={syncStatus} queueCount={pendingCount} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center" aria-label="Tilbake">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Synkroniseringsko</h1>
        </div>

        {/* Summary bar */}
        {!isEmpty && (
          <div className="flex gap-3 text-sm">
            {pendingCount > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                {pendingCount} venter
              </span>
            )}
            {failedCount > 0 && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                {failedCount} feilet
              </span>
            )}
            {hasSyncedItems && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                {queue.filter(q => q.status === 'synced').length} fullfort
              </span>
            )}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-green-800 font-medium">Alt er synkronisert</p>
            <p className="text-green-600 text-sm mt-1">Ingen ventende operasjoner</p>
          </div>
        )}

        {/* Queue items */}
        {!isEmpty && (
          <div className="space-y-2">
            {queue.map((item) => {
              const statusConf = STATUS_CONFIG[item.status];
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {ACTION_LABELS[item.action] || item.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTimestamp(item.createdAt)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConf.bg} ${statusConf.text}`}>
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Error message for failed items */}
                  {item.status === 'failed' && item.lastError && (
                    <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">
                      {item.lastError}
                    </p>
                  )}

                  {/* Retry button for failed items */}
                  {item.status === 'failed' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => retryItem(item.id)}
                      aria-label={`Prov igjen: ${ACTION_LABELS[item.action]}`}
                    >
                      Prov igjen
                    </Button>
                  )}

                  {/* Synced info */}
                  {item.status === 'synced' && item.syncedAt && (
                    <p className="text-xs text-green-600">
                      Synkronisert {formatTimestamp(item.syncedAt)}
                      {item.sharefoxId && ` — Sharefox #${item.sharefoxId}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto space-y-3 pt-4">
          {pendingCount > 0 && (
            <Button
              size="terminal"
              variant="primary"
              onClick={() => processQueue()}
              aria-label="Synkroniser na"
            >
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <polyline points="23 20 23 14 17 14" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
                Synkroniser na
              </span>
            </Button>
          )}

          {hasSyncedItems && (
            <Button
              size="lg"
              variant="ghost"
              className="w-full"
              onClick={clearCompleted}
              aria-label="Slett fullforte elementer"
            >
              Slett fullforte
            </Button>
          )}

          <Button
            size="terminal"
            variant="secondary"
            onClick={() => router.push('/terminal')}
            aria-label="Tilbake til start"
          >
            Tilbake til start
          </Button>
        </div>
      </main>
    </>
  );
}
