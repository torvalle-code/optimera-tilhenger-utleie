import { db } from './index';
import { QueueItem, QueueAction, QueueItemStatus } from '../types';

function generateQueueId(): string {
  return `q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

export async function enqueue(
  action: QueueAction,
  payload: Record<string, unknown>
): Promise<QueueItem> {
  const item: QueueItem = {
    id: generateQueueId(),
    action,
    payload,
    createdAt: new Date().toISOString(),
    status: 'pending',
    retryCount: 0,
  };
  await db.syncQueue.add(item);
  return item;
}

export async function getQueueItems(status?: QueueItemStatus): Promise<QueueItem[]> {
  if (status) {
    return db.syncQueue.where('status').equals(status).toArray();
  }
  return db.syncQueue.orderBy('createdAt').toArray();
}

export async function updateQueueItem(
  id: string,
  updates: Partial<QueueItem>
): Promise<void> {
  await db.syncQueue.update(id, updates);
}

export async function removeQueueItem(id: string): Promise<void> {
  await db.syncQueue.delete(id);
}

export async function getPendingCount(): Promise<number> {
  return db.syncQueue.where('status').equals('pending').count();
}

export async function getFailedCount(): Promise<number> {
  return db.syncQueue.where('status').equals('failed').count();
}

export async function clearSyncedItems(): Promise<number> {
  const synced = await db.syncQueue.where('status').equals('synced').toArray();
  const ids = synced.map((s) => s.id);
  await db.syncQueue.bulkDelete(ids);
  return ids.length;
}
