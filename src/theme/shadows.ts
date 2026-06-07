import { colors } from './colors';

/**
 * NaiPoMemories Shadow Tokens
 * Uses "Matcha Shadow" principle — shadows have a warm green tint, not pure grey.
 * All shadow values follow React Native's shadow props.
 */

const matchaShadowColor = colors.primaryLight; // #a4c639

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Level 1 — Cards
  sm: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },

  // Level 2 — Buttons, Modals
  md: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  // Level 3 — Floating elements, Bottom sheets
  lg: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },

  // Floating tab bar "island" — matcha shadow downward
  tabBar: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },

  // Camera shutter glow
  shutterGlow: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  // Moment card shadow
  card: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.15,
    shadowRadius: 48,
    elevation: 6,
  },
} as const;

export type ShadowKey = keyof typeof shadows;
