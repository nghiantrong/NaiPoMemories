import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFeed } from '../hooks/useFeed';
import { PostCard } from './PostCard';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/error.utils';

interface FeedListProps {
  userId: string;
}

export function FeedList({ userId }: FeedListProps) {
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

  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <PostCard post={item} />}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <React.Fragment />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={
        <EmptyState
          emoji="📸"
          title="Nothing here yet"
          message="Add friends and start sharing moments!"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    padding: spacing.screenPaddingHorizontal,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
