import React from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { routes } from '@/constants/routes';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable padded>
      <RegisterForm
        onNavigateToLogin={() => router.push(routes.auth.login)}
      />
    </ScreenContainer>
  );
}
