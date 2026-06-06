import React from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { routes } from '@/constants/routes';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable padded>
      <LoginForm
        onNavigateToRegister={() => router.push(routes.auth.register)}
      />
    </ScreenContainer>
  );
}
