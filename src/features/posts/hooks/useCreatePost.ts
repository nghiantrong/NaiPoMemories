import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import { queryKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/error.utils';
import { MediaType, UploadProgress } from '@/types';
import { friendService } from '@/features/friends/services/friend.service';
import { pushService } from '@/features/notifications/services/push.service';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

interface CreatePostVars {
  userId: string;
  userName: string;
  localUri: string;
  mediaType: MediaType;
  duration?: number;
  caption?: string;
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { schedule12HourReminder } = useNotifications();

  const mutation = useMutation({
    mutationFn: async (vars: CreatePostVars) => {
      const postId = await postService.createPost({
        ...vars,
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        },
      });

      // Update streaks
      await friendService.updatePostStreak(vars.userId);

      // Send push notifications to friends
      const friends = await friendService.getFriendsWithProfiles(vars.userId);
      const pushTokens = friends
        .map(f => f.expoPushToken)
        .filter((token): token is string => Boolean(token));

      if (pushTokens.length > 0) {
        await pushService.sendPushToFriends(pushTokens, vars.userName);
      }

      return postId;
    },
    onSuccess: (_, vars) => {
      setUploadProgress(null);
      schedule12HourReminder();
      // Invalidate feed so it refetches with the new post
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.feed(vars.userId),
      });
    },
    onError: () => {
      setUploadProgress(null);
    },
  });

  return {
    createPost: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    uploadProgress,
  };
}
