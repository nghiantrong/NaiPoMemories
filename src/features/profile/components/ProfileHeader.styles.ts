import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },

  // Avatar — Stitch: w-32 h-32 p-1.5 bg-white matcha-shadow
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatarHalo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    padding: 6,
    backgroundColor: colors.surfaceContainerLowest, // white bg
    ...shadows.lg,
  },
  // ring-[4px] ring-primary-container ring-offset-2
  avatarRing: {
    flex: 1,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primaryLight, // #a4c639
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  avatarInitial: {
    ...typography.headlineMd,
    color: colors.onPrimaryContainer,
  },

  // Edit badge (Stitch: absolute bottom-0 right-0 bg-primary-container p-2 border-2 border-white)
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadgeText: {
    fontSize: 14,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },

  // Text group
  textGroup: {
    alignItems: 'center',
    gap: 4,
  },
  // Stitch: font-headline-lg-mobile (28px bold Quicksand) text-on-surface
  name: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  // Stitch: font-body-md text-on-surface-variant
  email: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },

  // Stats pill — Stitch: pill-gradient (linear-gradient 135deg #dee6c7 → #ecefe4) rounded-full matcha-shadow
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer, // #dee6c7
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl + spacing.lg,
    gap: spacing.xl,
    // matcha-shadow
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.12,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    ...typography.labelLg,
    color: colors.primary,
    fontSize: 18,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.secondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.outlineVariant,
  },
});
