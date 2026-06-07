import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { routes } from '@/constants/routes';
import { colors } from '@/theme/colors';
import { styles } from './register.styles';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <RegisterForm onNavigateToLogin={() => router.push(routes.auth.login)} />
    </SafeAreaView>
  );
}
