import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { routes } from '@/constants/routes';

/**
 * Root index — immediately redirects based on auth state.
 * The actual loading screen is handled in _layout.tsx.
 */
export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href={routes.app.feed} />;
  }

  return <Redirect href={routes.auth.login} />;
}
