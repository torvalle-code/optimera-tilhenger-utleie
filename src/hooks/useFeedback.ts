'use client';

import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { FeedbackItem, FeedbackCategory, FeedbackPriority, FeedbackStatus } from '@/lib/types';

interface UseFeedbackReturn {
  feedback: FeedbackItem[];
  loading: boolean;
  addFeedback: (item: Omit<FeedbackItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<FeedbackItem>;
  updateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  getFiltered: (filters?: {
    category?: FeedbackCategory;
    priority?: FeedbackPriority;
    status?: FeedbackStatus;
  }) => FeedbackItem[];
  totalCount: number;
  newCount: number;
}

function generateId(): string {
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useFeedback(): UseFeedbackReturn {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all feedback on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const items = await db.feedback.orderBy('createdAt').reverse().toArray();
        if (mounted) setFeedback(items);
      } catch {
        // DB not ready yet — ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const addFeedback = useCallback(
    async (item: Omit<FeedbackItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<FeedbackItem> => {
      const now = new Date().toISOString();
      const newItem: FeedbackItem = {
        ...item,
        id: generateId(),
        status: 'new',
        createdAt: now,
        updatedAt: now,
      };
      await db.feedback.put(newItem);
      setFeedback((prev) => [newItem, ...prev]);
      return newItem;
    },
    []
  );

  const updateStatus = useCallback(
    async (id: string, status: FeedbackStatus): Promise<void> => {
      const now = new Date().toISOString();
      await db.feedback.update(id, { status, updatedAt: now });
      setFeedback((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status, updatedAt: now } : item))
      );
    },
    []
  );

  const getFiltered = useCallback(
    (filters?: { category?: FeedbackCategory; priority?: FeedbackPriority; status?: FeedbackStatus }) => {
      if (!filters) return feedback;
      return feedback.filter((item) => {
        if (filters.category && item.category !== filters.category) return false;
        if (filters.priority && item.priority !== filters.priority) return false;
        if (filters.status && item.status !== filters.status) return false;
        return true;
      });
    },
    [feedback]
  );

  const newCount = feedback.filter((item) => item.status === 'new').length;

  return {
    feedback,
    loading,
    addFeedback,
    updateStatus,
    getFiltered,
    totalCount: feedback.length,
    newCount,
  };
}
