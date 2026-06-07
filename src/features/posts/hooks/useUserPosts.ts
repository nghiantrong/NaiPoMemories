import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { postService } from '../services/post.service';

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.posts.all, 'user', userId],
    queryFn: () => postService.getUserPosts(userId!),
    enabled: !!userId,
  });
}
