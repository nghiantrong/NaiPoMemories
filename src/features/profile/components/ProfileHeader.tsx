import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { UserDocument } from '../types/user.types';
import { timeAgo } from '@/utils/date.utils';

interface ProfileHeaderProps {
  user: UserDocument;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={user.avatarUrl} displayName={user.displayName} size="xl" />
      <Text style={styles.name}>{user.displayName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.joined}>
        Joined {timeAgo(user.createdAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  name: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  email: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  joined: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
