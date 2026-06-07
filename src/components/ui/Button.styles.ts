import { StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  } as ViewStyle,
  fullWidth: {
    width: '100%',
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,

  // Variants — primary uses primaryLight (#a4c639) per Stitch "primary-container" button
  primary: {
    backgroundColor: colors.primaryLight,
    ...shadows.md,
  } as ViewStyle,
  secondary: {
    backgroundColor: colors.secondaryContainer,
  } as ViewStyle,
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  } as ViewStyle,
  ghost: {
    backgroundColor: colors.transparent,
  } as ViewStyle,
  danger: {
    backgroundColor: colors.error,
    ...shadows.md,
  } as ViewStyle,

  // Sizes
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  } as ViewStyle,
  size_md: {
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    minHeight: 52,
  } as ViewStyle,
  size_lg: {
    paddingVertical: spacing[4] + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 58,
  } as ViewStyle,
});
