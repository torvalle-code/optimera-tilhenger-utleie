'use client';

import { useState, useEffect, useCallback } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  checking: boolean;
}

export function useOnlineStatus(
  pingUrl: string = '/api/ping',
  intervalMs: number = 30000
): OnlineStatus {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChecked: null,
    checking: false,
  });

  const validateNetwork = useCallback(async () => {
    setStatus((prev) => ({ ...prev, checking: true }));
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${pingUrl}?t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setStatus({
        isOnline: res.ok,
        lastChecked: new Date(),
        checking: false,
      });
    } catch {
      setStatus({
        isOnline: false,
        lastChecked: new Date(),
        checking: false,
      });
    }
  }, [pingUrl]);

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
      validateNetwork();
    };

    const handleOffline = () => {
      setStatus({ isOnline: false, lastChecked: new Date(), checking: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    validateNetwork();

    // Periodic check
    const interval = setInterval(() => {
      if (navigator.onLine) validateNetwork();
    }, intervalMs);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [validateNetwork, intervalMs]);

  return status;
}
