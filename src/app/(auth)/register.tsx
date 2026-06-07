import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { routes } from '@/constants/routes';
import { colors } from '@/theme/colors';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <RegisterForm onNavigateToLogin={() => router.push(routes.auth.login)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
