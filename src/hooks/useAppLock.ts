import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useAuthStore } from '@store/useAuthStore';

export const APP_LOCK_TIMEOUT_MS = 2 * 60 * 1000;

export const useAppLock = () => {
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    const handleStateChange = (state: AppStateStatus) => {
      if (state !== 'active') {
        backgroundedAt.current ??= Date.now();
        return;
      }

      const elapsed = backgroundedAt.current === null ? 0 : Date.now() - backgroundedAt.current;
      backgroundedAt.current = null;

      if (elapsed >= APP_LOCK_TIMEOUT_MS && useAuthStore.getState().token) {
        useAuthStore.setState({ isUnlocked: false });
      }
    };

    const subscription = AppState.addEventListener('change', handleStateChange);
    return () => subscription.remove();
  }, []);
};