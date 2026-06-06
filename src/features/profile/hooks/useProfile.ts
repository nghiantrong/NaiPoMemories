import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { userService } from '../services/user.service';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile.byId(userId ?? ''),
    queryFn: () => userService.getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
