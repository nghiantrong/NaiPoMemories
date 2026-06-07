import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { getErrorMessage } from '@/utils/error.utils';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeed } from '../hooks/useFeed';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useRecoverStreak } from '@/features/friends/hooks/useRecoverStreak';
import { FriendWithProfile } from '@/features/friends/types/friend.types';
import { PostCard } from './PostCard';
import { Button } from '@/components/ui/Button';
import { styles, APP_BAR_HEIGHT } from './FeedList.styles';

interface FeedListProps {
  userId: string;
}

function FeedAppBar({ userId }: { userId: string }) {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile(userId);
  const router = useRouter();

  return (
    <View style={[styles.appBarWrapper, { paddingTop: insets.top }]}>
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.appBar}>
        {/* Avatar (left) — Stitch: w-10 h-10 rounded-full border-2 border-primary-container */}
        <Pressable onPress={() => router.navigate('/profile')}>
          <View style={styles.avatarRing}>
            <Avatar uri={profile?.avatarUrl} displayName={profile?.displayName} size="sm" />
          </View>
        </Pressable>
        {/* Title center — Stitch: font-headline-lg-mobile text-primary */}
        <Text style={styles.appBarTitle}>Moments</Text>
        {/* Group add button right — Stitch: text-primary */}
        <Pressable onPress={() => router.navigate('/friends')} style={styles.appBarAction}>
          <Text style={styles.appBarActionText}>👥✚</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StreakRecoveryBanner({ userId, friends }: { userId: string, friends: FriendWithProfile[] }) {
  const { recoverStreak, isRecovering } = useRecoverStreak(userId);
  const atRiskFriends = friends?.filter(f => f.streakStatus === 'at_risk' && f.myRecoveryChances > 0) || [];

  if (atRiskFriends.length === 0) return null;

  return (
    <View style={styles.bannerContainer}>
      {atRiskFriends.map(f => (
        <View key={f.friendshipId} style={styles.bannerRow}>
          <Text style={styles.bannerText}>
            🔥 Chuỗi với <Text style={{ fontWeight: 'bold' }}>{f.displayName}</Text> đang nguy hiểm!
          </Text>
          <Button 
            label={`Phục hồi (${f.myRecoveryChances})`} 
            onPress={() => recoverStreak(f.friendshipId)}
            isLoading={isRecovering}
            size="sm"
          />
        </View>
      ))}
    </View>
  );
}

export function FeedList({ userId }: FeedListProps) {
  const insets = useSafeAreaInsets();
  const { data: posts, isLoading, error, refetch, isRefetching } = useFeed(userId);
  const { data: friends } = useFriends(userId);

  if (isLoading) return <Loader fullScreen />;

  if (error) {
    return (
      <ErrorState
        message={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  const appBarHeight = APP_BAR_HEIGHT + insets.top;

  return (
    <View style={styles.container}>
      <FeedAppBar userId={userId} />
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={<StreakRecoveryBanner userId={userId} friends={friends || []} />}
        renderItem={({ item }) => {
          const friendProfile = friends?.find(f => f.userId === item.userId);
          const authorStreak = friendProfile?.streakCount || 0;
          return <PostCard post={item} authorStreak={authorStreak} />;
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: appBarHeight + spacing.sm, paddingBottom: 120 + insets.bottom },
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressViewOffset={appBarHeight}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="📸"
            title="Chưa có khoảnh khắc nào"
            message="Thêm bạn bè và bắt đầu chia sẻ những khoảnh khắc!"
          />
        }
      />
    </View>
  );
}
