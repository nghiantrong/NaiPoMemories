import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { UserDocument } from '../types/user.types';
import { shadows } from '@/theme/shadows';
import { styles } from './ProfileHeader.styles';

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
