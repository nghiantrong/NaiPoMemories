import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '../services/auth.service';

/**
 * useAuthState — subscribes to Firebase Auth state changes and syncs
 * them into the Zustand auth store.
 *
 * Call this ONCE in the root _layout.tsx.
 * All other components read from useAuthStore directly.
 */
export function useAuthState() {
  const { setUser, setInitializing } = useAuthStore();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  }, [setUser, setInitializing]);
}
