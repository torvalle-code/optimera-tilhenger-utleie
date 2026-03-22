import { getQueueItems, updateQueueItem } from '../db/queue-ops';
import { SYNC_RETRY_MAX, SYNC_RETRY_BASE_DELAY_MS } from '../constants';
import { QueueItem } from '../types';

interface SyncResult {
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

async function processItem(item: QueueItem): Promise<{ success: boolean; sharefoxId?: string; error?: string }> {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return { success: false, error: `HTTP ${res.status}: ${errorBody}` };
    }

    const data = await res.json();
    return { success: true, sharefoxId: data.sharefoxId };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function processQueue(): Promise<SyncResult> {
  const result: SyncResult = { processed: 0, succeeded: 0, failed: 0, errors: [] };
  const pendingItems = await getQueueItems('pending');

  for (const item of pendingItems) {
    result.processed++;

    // Mark as syncing
    await updateQueueItem(item.id, { status: 'syncing' });

    // Exponential backoff delay (skip on first attempt)
    if (item.retryCount > 0) {
      const delayMs = Math.min(
        SYNC_RETRY_BASE_DELAY_MS * Math.pow(2, item.retryCount - 1),
        30000
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }

    const { success, sharefoxId, error } = await processItem(item);

    if (success) {
      await updateQueueItem(item.id, {
        status: 'synced',
        syncedAt: new Date().toISOString(),
        sharefoxId,
      });
      result.succeeded++;
    } else {
      const newRetry = item.retryCount + 1;
      const newStatus = newRetry >= SYNC_RETRY_MAX ? 'failed' : 'pending';
      await updateQueueItem(item.id, {
        status: newStatus as any,
        retryCount: newRetry,
        lastError: error,
      });

      if (newStatus === 'failed') {
        result.failed++;
        result.errors.push({ id: item.id, error: error || 'Unknown error' });
      }
    }
  }

  return result;
}
