/**
 * App route constants — used with Expo Router's typed routes.
 * Always use these constants instead of hardcoding route strings.
 */

export const routes = {
  // Auth group
  auth: {
    login: '/(auth)/login' as const,
    register: '/(auth)/register' as const,
  },

  // App group (authenticated)
  app: {
    feed: '/(app)/feed' as const,
    camera: '/(app)/camera' as const,
    friends: '/(app)/friends' as const,
    profile: '/(app)/profile' as const,
  },

  // Root
  root: '/' as const,
} as const;
