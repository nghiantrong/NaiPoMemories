import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useProfile } from '../hooks/useProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { ProfileHeader } from './ProfileHeader';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/theme/spacing';

export function ProfileContent() {
  const { user } = useAuthStore();
  const { data: profile, isLoading, error, refetch } = useProfile(user?.uid);
  const { logout, isLoading: isLoggingOut } = useLogout();

  if (isLoading) return <Loader fullScreen />;
  if (error || !profile) {
    return (
      <ErrorState
        message="Could not load your profile."
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader user={profile} />
      <View style={styles.actions}>
        <Button
          label="Sign Out"
          variant="outline"
          onPress={() => logout()}
          isLoading={isLoggingOut}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  actions: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
});
