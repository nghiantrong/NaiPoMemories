import { useMutation, useQueryClient } from '@tanstack/react-query';
import { friendService } from '../services/friend.service';
import { queryKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/error.utils';

export function useRecoverStreak(userId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (friendshipId: string) => {
      if (!userId) throw new Error('User not logged in');
      return friendService.recoverStreak(friendshipId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list(userId!) });
    },
  });

  return {
    recoverStreak: mutation.mutateAsync,
    isRecovering: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}
