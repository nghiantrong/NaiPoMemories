/**
 * NaiPoMemories Color Palette
 * Design tokens inspired by the Matcha Moments design system.
 * These will be replaced/extended when Stitch UI is integrated.
 */

export const colors = {
  // Primary - Matcha Green
  primary: '#506600',
  primaryLight: '#a4c639',
  primaryContainer: '#ccf05f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#3e5000',

  // Secondary
  secondary: '#5a6149',
  secondaryContainer: '#dee6c7',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#60674f',

  // Tertiary
  tertiary: '#5c5f59',
  tertiaryContainer: '#b8bab2',
  onTertiary: '#ffffff',

  // Surface & Background
  background: '#f8fbf0',
  surface: '#f8fbf0',
  surfaceDim: '#d8dbd1',
  surfaceBright: '#f8fbf0',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f5ea',
  surfaceContainer: '#ecefe4',
  surfaceContainerHigh: '#e6e9df',
  surfaceContainerHighest: '#e1e4d9',

  // On Surface
  onBackground: '#191d16',
  onSurface: '#191d16',
  onSurfaceVariant: '#454937',

  // Inverse
  inverseSurface: '#2e322b',
  inverseOnSurface: '#eff2e7',
  inversePrimary: '#b1d446',

  // Outline
  outline: '#757965',
  outlineVariant: '#c5c9b1',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Utility
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',

  // Camera overlay
  cameraOverlay: 'rgba(0,0,0,0.5)',
  recordingRed: '#FF3B30',
} as const;

export type ColorKey = keyof typeof colors;
