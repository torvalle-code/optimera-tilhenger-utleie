'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { QueueItem, QueueAction, QueueItemStatus } from '@/lib/types';
import { useOnlineStatus } from './useOnlineStatus';
import { SYNC_RETRY_MAX, SYNC_RETRY_BASE_DELAY_MS } from '@/lib/constants';

function generateQueueId(): string {
  return `q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

interface SyncQueueHook {
  queue: QueueItem[];
  pendingCount: number;
  failedCount: number;
  addToQueue: (action: QueueAction, payload: Record<string, unknown>) => QueueItem;
  retryItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
  syncStatus: 'online' | 'syncing' | 'offline';
  processQueue: () => Promise<void>;
}

export function useSyncQueue(): SyncQueueHook {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline } = useOnlineStatus();
  const processingRef = useRef(false);

  const pendingCount = queue.filter((q) => q.status === 'pending').length;
  const failedCount = queue.filter((q) => q.status === 'failed').length;

  const syncStatus: 'online' | 'syncing' | 'offline' = !isOnline
    ? 'offline'
    : isSyncing
      ? 'syncing'
      : 'online';

  const addToQueue = useCallback(
    (action: QueueAction, payload: Record<string, unknown>): QueueItem => {
      const item: QueueItem = {
        id: generateQueueId(),
        action,
        payload,
        createdAt: new Date().toISOString(),
        status: 'pending',
        retryCount: 0,
      };
      setQueue((prev) => [...prev, item]);
      return item;
    },
    []
  );

  const retryItem = useCallback((id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'pending' as QueueItemStatus, retryCount: 0, lastError: undefined } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== 'synced'));
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsSyncing(true);

    const pendingItems = queue.filter((q) => q.status === 'pending');

    for (const item of pendingItems) {
      // Mark as syncing
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'syncing' as QueueItemStatus } : q))
      );

      try {
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: 'synced' as QueueItemStatus,
                  syncedAt: new Date().toISOString(),
                  sharefoxId: data.sharefoxId,
                }
              : q
          )
        );
      } catch (err) {
        const newRetry = item.retryCount + 1;
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: (newRetry >= SYNC_RETRY_MAX ? 'failed' : 'pending') as QueueItemStatus,
                  retryCount: newRetry,
                  lastError: String(err),
                }
              : q
          )
        );
      }

      // Small delay between items
      await new Promise((r) => setTimeout(r, 200));
    }

    setIsSyncing(false);
    processingRef.current = false;
  }, [queue]);

  // Auto-process when online and have pending items
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !processingRef.current) {
      processQueue();
    }
  }, [isOnline, pendingCount, processQueue]);

  return {
    queue,
    pendingCount,
    failedCount,
    addToQueue,
    retryItem,
    removeItem,
    clearCompleted,
    syncStatus,
    processQueue,
  };
}
