/**
 * AsyncStorage / SecureStore keys.
 * Centralized to avoid key collisions and typos.
 */

export const storageKeys = {
  // Auth
  authUser: 'auth:user',
  authToken: 'auth:token',

  // Preferences
  onboardingComplete: 'app:onboarding_complete',
  theme: 'app:theme',
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
