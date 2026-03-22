'use client';

import { FeedbackWidget } from '@/components/feedback/FeedbackWidget';
import { useAuth } from '@/components/auth/AuthProvider';

export function AdminFeedbackWrapper() {
  const { user } = useAuth();
  return (
    <FeedbackWidget
      context="admin"
      userName={user?.username || 'Admin'}
    />
  );
}
