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
import { styles, CARD_IMAGE_SIZE } from './PostCard.styles';

interface PostCardProps {
  post: Post;
  authorStreak?: number;
}

export function PostCard({ post, authorStreak = 0 }: PostCardProps) {
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
          <Text style={styles.authorName}>
            {author?.displayName ?? '...'}
            {authorStreak > 0 && <Text style={styles.streakText}> 🔥 {authorStreak}</Text>}
          </Text>
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
