import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

export const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  // Top branding
  topSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  tagline: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Glass panel
  glassWrapper: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    ...shadows.lg,
  },
  glassContent: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headingGroup: {
    gap: spacing.xs,
  },
  heading: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  subheading: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  fields: {
    gap: spacing.md,
  },
  serverError: {
    ...typography.bodyMd,
    color: colors.error,
    textAlign: 'center',
  },
  eyeIcon: { fontSize: 16 },

  loginRow: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Decorative blobs
  blobBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: colors.primaryContainer,
    opacity: 0.15,
  },
  blobTopRight: {
    position: 'absolute',
    top: -40,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.2,
  },
});
