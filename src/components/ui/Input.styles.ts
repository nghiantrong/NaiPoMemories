import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.labelLg,
    color: colors.secondary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    overflow: 'hidden',
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingHorizontal: spacing.inputPaddingHorizontal,
    paddingVertical: spacing.inputPaddingVertical,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  iconLeft: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  iconRight: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
    marginLeft: 4,
  },
  hintText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
});
