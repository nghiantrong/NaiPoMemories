import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { FriendWithProfile } from '../types/friend.types';

interface FriendCardProps {
  friend: FriendWithProfile;
  onPress?: () => void;
}

export function FriendCard({ friend, onPress }: FriendCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Avatar uri={friend.avatarUrl} displayName={friend.displayName} size="md" />
      <View style={styles.info}>
        <Text style={styles.name}>{friend.displayName}</Text>
        <Text style={styles.email} numberOfLines={1}>{friend.email}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Bạn bè</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
