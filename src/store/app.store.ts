import { create } from 'zustand';

/**
 * App Store — manages non-auth application-level UI state.
 *
 * Only use this for truly global client state.
 * Do NOT store server data here — use React Query instead.
 */

type AppTheme = 'light' | 'dark' | 'system';

interface AppState {
  theme: AppTheme;
  isNetworkAvailable: boolean;
  globalLoading: boolean;
  globalLoadingMessage?: string;

  // Actions
  setTheme: (theme: AppTheme) => void;
  setNetworkAvailable: (available: boolean) => void;
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'system',
  isNetworkAvailable: true,
  globalLoading: false,
  globalLoadingMessage: undefined,

  setTheme: (theme) => set({ theme }),

  setNetworkAvailable: (isNetworkAvailable) => set({ isNetworkAvailable }),

  showGlobalLoading: (message) =>
    set({ globalLoading: true, globalLoadingMessage: message }),

  hideGlobalLoading: () =>
    set({ globalLoading: false, globalLoadingMessage: undefined }),
}));
