import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { FriendRequest } from '../types/friend.types';
import { UserDocument } from '@/features/profile/types/user.types';

interface FriendRequestItemProps {
  request: FriendRequest;
  senderProfile?: UserDocument | null;
  onAccept: () => void;
  onReject: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export function FriendRequestItem({
  request,
  senderProfile,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: FriendRequestItemProps) {
  return (
    <View style={styles.container}>
      <Avatar
        uri={senderProfile?.avatarUrl}
        displayName={senderProfile?.displayName}
        size="md"
      />
      <View style={styles.info}>
        <Text style={styles.name}>
          {senderProfile?.displayName ?? 'Unknown'}
        </Text>
        <Text style={styles.email}>{senderProfile?.email ?? ''}</Text>
        <View style={styles.actions}>
          <Button
            label="Accept"
            size="sm"
            variant="primary"
            onPress={onAccept}
            isLoading={isAccepting}
            style={styles.actionBtn}
          />
          <Button
            label="Reject"
            size="sm"
            variant="outline"
            onPress={onReject}
            isLoading={isRejecting}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
