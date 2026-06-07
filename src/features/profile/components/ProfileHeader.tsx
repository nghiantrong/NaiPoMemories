import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { UserDocument } from '../types/user.types';
import { shadows } from '@/theme/shadows';

interface ProfileHeaderProps {
  user: UserDocument;
  postCount?: number;
  friendCount?: number;
  onEditPress?: () => void;
}

export function ProfileHeader({
  user,
  postCount = 0,
  friendCount = 0,
  onEditPress,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      {/* ── Avatar with ring + edit badge (Stitch: w-32 h-32 ring-4 ring-primary-container) ── */}
      <View style={styles.avatarWrapper}>
        {/* White halo */}
        <View style={styles.avatarHalo}>
          {/* Primary container ring */}
          <View style={styles.avatarRing}>
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {(user.displayName ?? 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Edit badge (Stitch: bottom-0 right-0 bg-primary-container border-2 border-white) */}
        <Pressable
          onPress={onEditPress}
          style={styles.editBadge}
          hitSlop={8}
        >
          <Text style={styles.editBadgeText}>✎</Text>
        </Pressable>
      </View>

      {/* ── Name & email ── */}
      <View style={styles.textGroup}>
        {/* Stitch: font-headline-lg-mobile text-on-surface */}
        <Text style={styles.name}>{user.displayName}</Text>
        {/* Stitch: font-body-md text-on-surface-variant */}
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* ── Stats Pill (Stitch: pill-gradient px-8 py-3 rounded-full matcha-shadow) ── */}
      <LinearGradient
        colors={['#dee6c7', '#ecefe4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsPill}
      >
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{postCount}</Text>
          <Text style={styles.statLabel}>Khoảnh khắc</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{friendCount}</Text>
          <Text style={styles.statLabel}>Bạn bè</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
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
