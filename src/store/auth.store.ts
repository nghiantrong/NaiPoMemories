import { create } from 'zustand';
import { User } from 'firebase/auth';

/**
 * Auth Store — manages authentication state only.
 *
 * This store is the single source of truth for:
 * - Whether the user is authenticated
 * - The current Firebase user object
 * - The loading state during auth initialization
 *
 * Server data (profile details, friends, posts) lives in React Query.
 */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setInitializing: (isInitializing: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  setInitializing: (isInitializing) => set({ isInitializing }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    }),
}));
