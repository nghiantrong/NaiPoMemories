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
  },

  // Hero
  heroContainer: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
    ...shadows.shutterGlow,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    ...typography.headlineLg,
    color: colors.primary,
    letterSpacing: -0.5,
  },

  // Glass panel
  glassWrapper: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    marginTop: -spacing.xl,
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
  eyeIcon: {
    fontSize: 16,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },

  // Sign up link as button
  signupBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  signupText: {
    ...typography.button,
    color: colors.primary,
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
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.25,
  },
});
