import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { routes } from '@/constants/routes';
import { getErrorMessage } from '@/utils/error.utils';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all React Query cache on logout to prevent data leaks
      queryClient.clear();
      router.replace(routes.auth.login);
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
