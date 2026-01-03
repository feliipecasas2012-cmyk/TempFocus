import { useEffect, useRef, useCallback } from 'react';

export const useWakeLock = (enabled: boolean) => {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    // Check if API exists and is enabled
    if ('wakeLock' in navigator && enabled) {
      try {
        wakeLock.current = await navigator.wakeLock.request('screen');
        // console.log('Wake Lock is active');
      } catch (err) {
        const error = err as Error;
        // NotAllowedError occurs if the document is not active or permission is denied/policy blocked
        // We suppress this specific error to avoid console noise in restrictive environments (like iframes)
        if (error.name !== 'NotAllowedError') {
          console.error(`Wake Lock Error: ${error.name}, ${error.message}`);
        }
      }
    }
  }, [enabled]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock.current) {
      try {
        await wakeLock.current.release();
        wakeLock.current = null;
      } catch (err) {
        // Ignore errors on release to prevent crashes
        console.debug('Wake Lock release error', err);
      }
    }
  }, []);

  useEffect(() => {
    // Request lock when component mounts or enabled changes to true
    if (enabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Handle visibility change (re-request if tab becomes visible again)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [enabled, requestWakeLock, releaseWakeLock]);
};