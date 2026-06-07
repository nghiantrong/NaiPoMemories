import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
import { useProfile } from '../hooks/useProfile';
import { useUserPosts } from '@/features/posts/hooks/useUserPosts';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { ProfileHeader } from './ProfileHeader';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useVideoPlayer, VideoView } from 'expo-video';
import { styles } from './ProfileContent.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - spacing.screenPaddingHorizontal * 2 - spacing.sm) / 2;

function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <VideoView player={player} style={{ width: '100%', height: '80%' }} contentFit="contain" />
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 60, right: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Đóng</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const getThumbnailUrl = (url: string, thumbnailUrl?: string | null) => {
  if (thumbnailUrl) return thumbnailUrl;
  if (url.includes('res.cloudinary.com')) {
    return url.replace(/\.(mp4|mov|webm)$/i, '.jpg');
  }
  return url;
};

export function ProfileContent() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, error, refetch } = useProfile(user?.uid);
  const { data: posts, isLoading: isLoadingPosts } = useUserPosts(user?.uid);
  const { data: friends } = useFriends(user?.uid);
  const { logout, isLoading: isLoggingOut } = useLogout();
  
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  if (isLoading) return <Loader fullScreen />;
  if (error || !profile) {
    return (
      <ErrorState
        message="Không thể tải hồ sơ. Vui lòng thử lại."
        onRetry={refetch}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader 
        user={profile} 
        postCount={posts?.length ?? 0}
        friendCount={friends?.length ?? 0}
      />

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Posts grid ── */}
      <View style={styles.gridSection}>
        <Text style={styles.gridTitle}>Khoảnh khắc của bạn</Text>
        
        {isLoadingPosts ? (
          <Loader />
        ) : posts && posts.length > 0 ? (
          <View style={styles.postsGrid}>
            {posts.map(post => (
              <Pressable 
                key={post.id} 
                style={[styles.gridItem, { width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE }]}
                onPress={() => {
                  if (post.mediaType === 'video') {
                    setPlayingVideo(post.mediaUrl);
                  }
                }}
              >
                <Image
                  source={{ uri: getThumbnailUrl(post.mediaUrl, post.thumbnailUrl) }}
                  style={{ width: '100%', height: '100%', borderRadius: 12 }}
                  resizeMode="cover"
                />
                {post.mediaType === 'video' && (
                  <View style={styles.videoOverlay}>
                    <Text style={styles.videoIcon}>▶️</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyGrid}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyText}>Chưa có khoảnh khắc nào</Text>
            <Text style={styles.emptySubtext}>Chụp ảnh đầu tiên của bạn!</Text>
          </View>
        )}
      </View>

      {/* ── Sign out ── */}
      <View style={styles.actions}>
        <Button
          label="Đăng xuất"
          variant="outline"
          onPress={() => logout()}
          isLoading={isLoggingOut}
          fullWidth
        />
      </View>

      {playingVideo && (
        <VideoModal videoUrl={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
    </ScrollView>
  );
}
