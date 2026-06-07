import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Post } from '../types/post.types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/utils/date.utils';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { BlurView } from 'expo-blur';
import { useVideoPlayer, VideoView } from 'expo-video';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_IMAGE_SIZE = SCREEN_WIDTH - spacing.screenPaddingHorizontal * 2;

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { data: author } = useProfile(post.userId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isVideo = post.mediaType === 'video';
  const player = useVideoPlayer(
    isVideo ? post.mediaUrl : null,
    (p) => {
      p.loop = true;
      p.muted = false; // default unmuted
    }
  );

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    player.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.card}>
      {/* ── Author row ── */}
      <View style={styles.header}>
        <Avatar uri={author?.avatarUrl} displayName={author?.displayName} size="sm" />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author?.displayName ?? '...'}</Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Pressable style={styles.moreBtn}>
          <Text style={styles.moreBtnText}>⋯</Text>
        </Pressable>
      </View>

      {/* ── Media (1:1 square) ── */}
      <View style={styles.mediaWrapper}>
        {isVideo ? (
          <Pressable style={styles.media} onPress={togglePlay}>
            <VideoView
              player={player}
              style={styles.media}
              contentFit="cover"
            />
            {!isPlaying && (
              <View style={styles.playOverlay}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            )}
            <Pressable style={styles.muteBtn} onPress={toggleMute}>
              <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
            </Pressable>
          </Pressable>
        ) : (
          <Image
            source={{ uri: post.thumbnailUrl ?? post.mediaUrl }}
            style={styles.media}
            resizeMode="cover"
          />
        )}

        {/* Glass overlay bar (Stitch: bottom-4, blur, emoji reactions + viewer count) */}
        <View style={styles.glassOverlay}>
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.glassContent}>
            <View style={styles.reactionPills}>
              <Text style={styles.reactionEmoji}>❤️</Text>
              <Text style={styles.reactionEmoji}>🙌</Text>
            </View>
            <Text style={styles.viewersText}>4 người khác đã xem</Text>
          </View>
        </View>
      </View>

      {/* ── Caption ── */}
      {post.caption ? (
        <View style={styles.captionRow}>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      ) : null}

      {/* ── Interaction bar ── */}
      <View style={styles.interactionBar}>
        <Pressable style={styles.replyBtn}>
          <Text style={styles.replyBtnText}>💬  Trả lời</Text>
        </Pressable>
        <View style={styles.reactBtns}>
          <Pressable style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>❤️</Text>
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🤩</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    ...shadows.card,
  },

  // Header
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
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtnText: {
    fontSize: 20,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },

  // Media — 1:1 square per Stitch
  mediaWrapper: {
    width: CARD_IMAGE_SIZE,
    height: CARD_IMAGE_SIZE,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceContainerHighest,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 48,
    opacity: 0.8,
  },
  muteBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteIcon: {
    fontSize: 16,
  },
  glassOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glassContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  reactionPills: {
    flexDirection: 'row',
    gap: -4,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  viewersText: {
    ...typography.labelSm,
    color: colors.white,
    fontWeight: '700',
  },

  // Caption
  captionRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  caption: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },

  // Interaction bar
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  replyBtn: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyBtnText: {
    ...typography.labelLg,
    color: colors.onSurfaceVariant,
  },
  reactBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 20,
  },
});
