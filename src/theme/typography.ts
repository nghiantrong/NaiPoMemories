import { Platform } from 'react-native';

/**
 * NaiPoMemories Typography Tokens
 * Headlines: Quicksand | Body & Labels: Nunito Sans
 * (Load fonts via expo-font in root _layout.tsx)
 */

export const fontFamilies = {
  headlineBold: Platform.select({
    ios: 'Quicksand-Bold',
    android: 'Quicksand-Bold',
    default: 'Quicksand-Bold',
  }),
  headlineSemiBold: Platform.select({
    ios: 'Quicksand-SemiBold',
    android: 'Quicksand-SemiBold',
    default: 'Quicksand-SemiBold',
  }),
  bodyRegular: Platform.select({
    ios: 'NunitoSans-Regular',
    android: 'NunitoSans-Regular',
    default: 'NunitoSans-Regular',
  }),
  bodySemiBold: Platform.select({
    ios: 'NunitoSans-SemiBold',
    android: 'NunitoSans-SemiBold',
    default: 'NunitoSans-SemiBold',
  }),
  bodyBold: Platform.select({
    ios: 'NunitoSans-Bold',
    android: 'NunitoSans-Bold',
    default: 'NunitoSans-Bold',
  }),
} as const;

export const typography = {
  // Display
  displayLg: {
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.8,
    fontFamily: fontFamilies.headlineBold,
  },

  // Headlines
  headlineLg: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    fontFamily: fontFamilies.headlineBold,
  },
  headlineMd: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamilies.headlineSemiBold,
  },
  headlineSm: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.headlineSemiBold,
  },

  // Body
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: fontFamilies.bodyRegular,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.bodyRegular,
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.bodyRegular,
  },

  // Labels
  labelLg: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontFamily: fontFamilies.bodyBold,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.bodySemiBold,
  },
  labelSm: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fontFamilies.bodySemiBold,
  },

  // Button
  button: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
    fontFamily: fontFamilies.bodyBold,
  },
} as const;

export type TypographyKey = keyof typeof typography;
