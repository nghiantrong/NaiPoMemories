import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
import { useProfile } from '../hooks/useProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { ProfileHeader } from './ProfileHeader';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { styles } from './ProfileContent.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - spacing.screenPaddingHorizontal * 2 - spacing.sm) / 2;

export function ProfileContent() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, error, refetch } = useProfile(user?.uid);
  const { logout, isLoading: isLoggingOut } = useLogout();

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
      <ProfileHeader user={profile} />

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Empty post grid placeholder ── */}
      <View style={styles.gridSection}>
        <Text style={styles.gridTitle}>Khoảnh khắc của bạn</Text>
        <View style={styles.emptyGrid}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyText}>Chưa có khoảnh khắc nào</Text>
          <Text style={styles.emptySubtext}>Chụp ảnh đầu tiên của bạn!</Text>
        </View>
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
    </ScrollView>
  );
}
