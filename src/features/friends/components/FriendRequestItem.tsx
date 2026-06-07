import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { FriendRequest } from '../types/friend.types';
import { UserDocument } from '@/features/profile/types/user.types';
import { styles } from './FriendRequestItem.styles';

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
          {senderProfile?.displayName ?? 'Người dùng'}
        </Text>
        <Text style={styles.email}>{senderProfile?.email ?? ''}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.acceptBtn} onPress={onAccept}>
          <Text style={styles.acceptText}>✓</Text>
        </Pressable>
        <Pressable style={styles.rejectBtn} onPress={onReject}>
          <Text style={styles.rejectText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}
