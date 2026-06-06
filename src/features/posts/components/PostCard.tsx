import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Post } from '../types/post.types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/utils/date.utils';
import { useProfile } from '@/features/profile/hooks/useProfile';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_IMAGE_HEIGHT = SCREEN_WIDTH - spacing.screenPaddingHorizontal * 2;

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { data: author } = useProfile(post.userId);

  return (
    <View style={styles.card}>
      {/* Author row */}
      <View style={styles.header}>
        <Avatar
          uri={author?.avatarUrl}
          displayName={author?.displayName}
          size="sm"
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            {author?.displayName ?? '...'}
          </Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
        {post.mediaType === 'video' && (
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeText}>🎥 Video</Text>
          </View>
        )}
      </View>

      {/* Media */}
      <Image
        source={{ uri: post.thumbnailUrl ?? post.mediaUrl }}
        style={styles.media}
        resizeMode="cover"
      />

      {/* Caption */}
      {post.caption ? (
        <View style={styles.captionRow}>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  timestamp: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  videoBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  videoBadgeText: {
    ...typography.labelSm,
    color: colors.onSurface,
  },
  media: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: colors.surfaceContainerHighest,
  },
  captionRow: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  caption: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
});
