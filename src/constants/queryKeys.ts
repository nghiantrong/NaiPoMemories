/**
 * React Query keys factory.
 * Centralized to avoid typos and enable cache invalidation by feature.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests(userId) })
 */

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    currentUser: () => ['auth', 'currentUser'] as const,
  },

  users: {
    all: ['users'] as const,
    byId: (id: string) => ['users', id] as const,
    search: (query: string) => ['users', 'search', query] as const,
  },

  posts: {
    all: ['posts'] as const,
    feed: (userId: string) => ['posts', 'feed', userId] as const,
    byUser: (userId: string) => ['posts', 'user', userId] as const,
    byId: (id: string) => ['posts', id] as const,
  },

  friends: {
    all: ['friends'] as const,
    list: (userId: string) => ['friends', 'list', userId] as const,
    requests: (userId: string) => ['friends', 'requests', userId] as const,
    sentRequests: (userId: string) => ['friends', 'sentRequests', userId] as const,
    status: (userId: string, targetId: string) =>
      ['friends', 'status', userId, targetId] as const,
  },

  profile: {
    all: ['profile'] as const,
    byId: (id: string) => ['profile', id] as const,
  },
} as const;
