/**
 * Date utilities for NaiPoMemories.
 * Handles display formatting for posts, messages, and timestamps.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Convert Firestore Timestamp to JS Date
 */
export function toDate(timestamp: Timestamp | Date | null | undefined): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
}

/**
 * Format a date as a relative time string (e.g. "2 hours ago")
 */
export function timeAgo(date: Date | Timestamp | null | undefined): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  if (!d) return '';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: diffDay > 365 ? 'numeric' : undefined,
  });
}

/**
 * Format video duration in seconds to MM:SS string
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
