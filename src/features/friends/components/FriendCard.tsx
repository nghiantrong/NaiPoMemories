import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: spacing.cardPadding,
    gap: spacing.md,
    ...shadows.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  email: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
