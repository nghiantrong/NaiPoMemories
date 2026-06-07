import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export const APP_BAR_HEIGHT = 68;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Transparent app bar
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
  bannerContainer: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff3cd', // Light yellow warning color
    padding: spacing.md,
    borderRadius: 12,
  },
  bannerText: {
    flex: 1,
    color: '#856404',
    fontSize: 14,
  },
  appBarTitle: {
    // Stitch: font-headline-lg-mobile (Quicksand 28px 700) text-primary
    ...typography.headlineLg,
    color: colors.primary,
  },
  appBarAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarActionText: {
    fontSize: 18,
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // List
  listContent: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    gap: spacing.lg,
  },
  separator: {
    height: spacing.lg,
  },
});
