import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { friendService } from '../services/friend.service';
import { getErrorMessage } from '@/utils/error.utils';

export function useFriendRequests(userId: string | undefined) {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: queryKeys.friends.requests(userId ?? ''),
    queryFn: () => friendService.getIncomingRequests(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30,
  });

  const acceptMutation = useMutation({
    mutationFn: ({
      requestId,
      senderId,
      receiverId,
    }: {
      requestId: string;
      senderId: string;
      receiverId: string;
    }) => friendService.acceptRequest(requestId, senderId, receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests(userId ?? '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list(userId ?? '') });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      friendService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests(userId ?? '') });
    },
  });

  return {
    requests: requestsQuery.data ?? [],
    isLoading: requestsQuery.isLoading,
    error: requestsQuery.error ? getErrorMessage(requestsQuery.error) : null,
    refetch: requestsQuery.refetch,
    accept: acceptMutation.mutate,
    reject: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
