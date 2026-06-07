import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },

  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: spacing.screenPaddingHorizontal,
    opacity: 0.5,
  },

  gridSection: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  gridTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },

  emptyGrid: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  emptySubtext: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.md,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  videoIcon: {
    fontSize: 24,
    opacity: 0.9,
  },

  actions: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
});
