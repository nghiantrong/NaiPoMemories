import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { FriendWithProfile } from '../types/friend.types';
import { styles } from './FriendCard.styles';

interface FriendCardProps {
  friend: FriendWithProfile;
  onPress?: () => void;
}

export function FriendCard({ friend, onPress }: FriendCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Avatar uri={friend.avatarUrl} displayName={friend.displayName} size="md" />
      <View style={styles.info}>
        <Text style={styles.name}>
          {friend.displayName}
          {friend.streakCount > 0 && <Text style={styles.streakText}> 🔥 {friend.streakCount}</Text>}
        </Text>
        <Text style={styles.email} numberOfLines={1}>{friend.email}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Bạn bè</Text>
      </View>
    </Pressable>
  );
}
