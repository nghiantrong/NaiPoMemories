import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useFriends } from '../hooks/useFriends';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { useSearchUser } from '../hooks/useSearchUser';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { FriendCard } from './FriendCard';
import { FriendRequestItem } from './FriendRequestItem';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { FriendRequest } from '../types/friend.types';

export function FriendsScreen() {
  const { user } = useAuthStore();
  const [searchEmail, setSearchEmail] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: friends, isLoading: loadingFriends, refetch: refetchFriends } = useFriends(user?.uid);
  const {
    requests,
    isLoading: loadingRequests,
    accept,
    reject,
    refetch: refetchRequests,
  } = useFriendRequests(user?.uid);
  const { sendRequest, isLoading: isSending, error, successMessage, reset } = useSearchUser(user?.uid);

  const handleSend = () => {
    if (!searchEmail.trim()) return;
    sendRequest(searchEmail.trim());
    setSearchEmail('');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchFriends(),
      refetchRequests(),
    ]);
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search / Add Friend */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Friend</Text>
        <View style={styles.searchRow}>
          <Input
            placeholder="Search by email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={searchEmail}
            onChangeText={(t) => { setSearchEmail(t); reset(); }}
            containerStyle={styles.searchInput}
          />
          <Button
            label="Add"
            size="sm"
            onPress={handleSend}
            isLoading={isSending}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      </View>

      {/* Incoming Requests */}
      {requests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Requests ({requests.length})
          </Text>
          {requests.map((req) => (
            <RequestRow
              key={req.id}
              request={req}
              onAccept={() => accept({ requestId: req.id, senderId: req.senderId, receiverId: req.receiverId })}
              onReject={() => reject({ requestId: req.id })}
            />
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Friends ({friends?.length ?? 0})
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (loadingFriends && !refreshing) {
      return <Loader />;
    }
    return (
      <EmptyState
        emoji="👋"
        title="No friends yet"
        message="Search by email to add your first friend!"
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={friends}
            keyExtractor={(f) => f.friendshipId}
            renderItem={({ item }) => <FriendCard friend={item} />}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Tiny helper component to load sender profile for each request
function RequestRow({
  request,
  onAccept,
  onReject,
}: {
  request: FriendRequest;
  onAccept: () => void;
  onReject: () => void;
}) {
  const { data: senderProfile } = useProfile(request.senderId);
  return (
    <FriendRequestItem
      request={request}
      senderProfile={senderProfile}
      onAccept={onAccept}
      onReject={onReject}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  headerContainer: {
    gap: spacing.sm,
  },
  section: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  friendsSection: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  searchInput: {
    flex: 1,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
  },
  successText: {
    ...typography.labelMd,
    color: colors.primary,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
