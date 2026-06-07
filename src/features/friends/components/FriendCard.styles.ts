import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.cardPadding,
    gap: spacing.md,
    ...shadows.sm,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  streakText: {
    color: '#ff6b6b', // fiery red
    fontSize: 14,
  },
  email: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  badge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
