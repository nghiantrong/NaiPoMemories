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

  // Floating tab bar "island"
  tabBar: {
    shadowColor: matchaShadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

export type ShadowKey = keyof typeof shadows;
