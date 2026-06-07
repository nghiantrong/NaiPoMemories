import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { useFriends } from '../hooks/useFriends';
import { useSearchUser } from '../hooks/useSearchUser';
import { FriendRequest } from '../types/friend.types';
import { FriendCard } from './FriendCard';
import { FriendRequestItem } from './FriendRequestItem';
import { styles, APP_BAR_HEIGHT } from './FriendsScreen.styles';

function FriendsAppBar({ userId }: { userId: string }) {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile(userId);
  const router = useRouter();

  return (
    <View style={[styles.appBarWrapper, { paddingTop: insets.top }]}>
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <Pressable onPress={() => router.navigate('/profile')}>
            <Avatar uri={profile?.avatarUrl} displayName={profile?.displayName} size="sm" />
          </Pressable>
          <Text style={styles.appBarTitle}>Tìm bạn bè</Text>
        </View>
        <Pressable style={styles.appBarAction}>
          <Text style={styles.appBarActionText}>👥+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function FriendsScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
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
    await Promise.all([refetchFriends(), refetchRequests()]);
    setRefreshing(false);
  };

  const appBarHeight = APP_BAR_HEIGHT + insets.top;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* ── Search Section ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Thêm bạn mới</Text>
        <View style={styles.searchRow}>
          <Input
            placeholder="Tìm theo email..."
            keyboardType="email-address"
            autoCapitalize="none"
            value={searchEmail}
            onChangeText={(t) => { setSearchEmail(t); reset(); }}
            containerStyle={styles.searchInput}
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
          />
          <Button
            label="Gửi"
            size="sm"
            onPress={handleSend}
            isLoading={isSending}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && <Text style={styles.successText}>✅ {successMessage}</Text>}
      </View>

      {/* ── Incoming Requests ── */}
      {requests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Lời mời kết bạn ({requests.length})
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

      {/* ── Friends section heading ── */}
      <Text style={styles.sectionTitle}>
        Bạn bè ({friends?.length ?? 0})
      </Text>
    </View>
  );

  const renderFooter = () => (
    /* ── Invite Section (Stitch "Mời bạn bè" block) ── */
    <View style={styles.inviteCard}>
      <View style={styles.inviteIcon}>
        <Text style={styles.inviteIconEmoji}>🎉</Text>
      </View>
      <Text style={styles.inviteTitle}>Mời bạn bè</Text>
      <Text style={styles.inviteSubtitle}>
        Chia sẻ khoảnh khắc đẹp cùng những người thân yêu nhất.
      </Text>
      <Button label="📤  Gửi lời mời ngay" fullWidth />
    </View>
  );

  const renderEmpty = () => {
    if (loadingFriends && !refreshing) return <Loader />;
    return (
      <EmptyState
        emoji="👋"
        title="Chưa có bạn bè"
        message="Tìm theo email để thêm người bạn đầu tiên!"
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <FriendsAppBar userId={user?.uid ?? ''} />
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
            ListFooterComponent={renderFooter}
            contentContainerStyle={[
              styles.list,
              { paddingTop: appBarHeight + spacing.sm, paddingBottom: 120 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
                progressViewOffset={appBarHeight}
              />
            }
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Helper component for request rows
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
