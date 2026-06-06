/**
 * Validation utilities — shared helpers for form validation.
 * Zod schemas for forms live in the respective feature's hooks or components.
 */

/** Check if a string is a valid email */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Clamp a number within [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Check if a video duration (in seconds) is within the allowed limit */
export const MAX_VIDEO_DURATION_SECONDS = 120;

export function isValidVideoDuration(durationSeconds: number): boolean {
  return durationSeconds <= MAX_VIDEO_DURATION_SECONDS;
}

/** Allowed media MIME types */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mpeg'] as const;

/** Max file sizes */
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_VIDEO_SIZE_MB = 200;

export function bytesToMb(bytes: number): number {
  return bytes / (1024 * 1024);
}
