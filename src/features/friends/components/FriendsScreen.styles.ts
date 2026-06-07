import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export const APP_BAR_HEIGHT = 68;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // App bar
  appBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  appBar: {
    height: APP_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appBarTitle: {
    ...typography.headlineLg,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  appBarAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarActionText: {
    fontSize: 22,
  },

  // List
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    gap: spacing.sm,
  },
  headerContainer: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  // Sections
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.labelLg,
    color: colors.secondary,
    marginLeft: 4,
  },
  sectionTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  searchInput: {
    flex: 1,
  },
  searchIcon: {
    fontSize: 18,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
    marginLeft: 4,
  },
  successText: {
    ...typography.labelMd,
    color: colors.primary,
    marginLeft: 4,
  },

  // Invite card
  inviteCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.secondaryContainer,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    opacity: 0.85,
  },
  inviteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteIconEmoji: {
    fontSize: 30,
  },
  inviteTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  inviteSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
