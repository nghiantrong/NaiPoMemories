/**
 * Global shared types for NaiPoMemories.
 * Feature-specific types live in their respective feature/types/ directories.
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Pagination
export interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
  lastCursor?: string;
}

// Media type union
export type MediaType = 'image' | 'video';

// Upload progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
