import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import { queryKeys } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/error.utils';
import { MediaType, UploadProgress } from '@/types';

interface CreatePostVars {
  userId: string;
  localUri: string;
  mediaType: MediaType;
  duration?: number;
  caption?: string;
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: (vars: CreatePostVars) =>
      postService.createPost({
        ...vars,
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        },
      }),
    onSuccess: (_, vars) => {
      setUploadProgress(null);
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
