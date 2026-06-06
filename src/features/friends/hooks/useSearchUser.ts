import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { friendService } from '../services/friend.service';
import { queryKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/error.utils';

export function useSearchUser(currentUserId: string | undefined) {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (email: string) =>
      friendService.sendRequestByEmail(currentUserId!, email),
    onSuccess: (targetUser) => {
      setSuccessMessage(`Friend request sent to ${targetUser.displayName}!`);
      // Invalidate sent requests cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.friends.sentRequests(currentUserId ?? ''),
      });
    },
    onError: () => {
      setSuccessMessage(null);
    },
  });

  return {
    sendRequest: (email: string) => {
      setSuccessMessage(null);
      mutation.mutate(email);
    },
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    successMessage,
    reset: () => {
      mutation.reset();
      setSuccessMessage(null);
    },
  };
}
