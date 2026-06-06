/**
 * NaiPoMemories Spacing Tokens
 * Based on an 8px grid system.
 */

export const spacing = {
  // Base increments
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,

  // Semantic aliases
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Layout
  screenPaddingHorizontal: 24,
  screenPaddingVertical: 16,
  tabBarHeight: 80,

  // Component-specific
  cardPadding: 16,
  inputPaddingVertical: 14,
  inputPaddingHorizontal: 16,
  buttonPaddingVertical: 14,
  buttonPaddingHorizontal: 24,
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 72,
  avatarXl: 100,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export type SpacingKey = keyof typeof spacing;
