import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { friendService } from '../services/friend.service';

export function useFriends(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.friends.list(userId ?? ''),
    queryFn: () => friendService.getFriendsWithProfiles(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}
