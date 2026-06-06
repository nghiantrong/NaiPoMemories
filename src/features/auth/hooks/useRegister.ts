import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { RegisterFormData } from '../types/auth.types';
import { routes } from '@/constants/routes';
import { getErrorMessage } from '@/utils/error.utils';

export function useRegister() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: () => {
      router.replace(routes.app.feed);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
