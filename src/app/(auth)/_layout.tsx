import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { routes } from '@/constants/routes';

/**
 * Auth group layout.
 * If user is already authenticated, redirect to the app.
 */
export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href={routes.app.feed} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
