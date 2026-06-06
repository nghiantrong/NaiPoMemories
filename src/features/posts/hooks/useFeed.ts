import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { postService } from '../services/post.service';

export function useFeed(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.feed(userId ?? ''),
    queryFn: () => postService.getFeed(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });
}
