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
import { PostCard } from './PostCard';

const APP_BAR_HEIGHT = 68;

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

export function FeedList({ userId }: FeedListProps) {
  const insets = useSafeAreaInsets();
  const { data: posts, isLoading, error, refetch, isRefetching } = useFeed(userId);

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
        renderItem={({ item }) => <PostCard post={item} />}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Transparent app bar
  appBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  appBar: {
    height: APP_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  appBarTitle: {
    // Stitch: font-headline-lg-mobile (Quicksand 28px 700) text-primary
    ...typography.headlineLg,
    color: colors.primary,
  },
  appBarAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarActionText: {
    fontSize: 18,
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // List
  listContent: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    gap: spacing.lg,
  },
  separator: {
    height: spacing.lg,
  },
});
