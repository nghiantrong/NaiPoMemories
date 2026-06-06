import { postRepository } from '../repositories/post.repository';
import { friendService } from '@/features/friends/services/friend.service';
import { mediaService } from '@/features/media/services/media.service';
import { parseFirebaseError } from '@/utils/error.utils';
import { Post } from '../types/post.types';
import { MediaType, UploadProgress } from '@/types';

interface CreatePostInput {
  userId: string;
  localUri: string;
  mediaType: MediaType;
  /** Duration in seconds — required for video */
  duration?: number;
  caption?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export const postService = {
  /**
   * Full create-post flow:
   * 1. Upload media to Cloudinary
   * 2. Write post document to Firestore
   */
  async createPost({
    userId,
    localUri,
    mediaType,
    duration = 0,
    caption,
    onProgress,
  }: CreatePostInput): Promise<string> {
    try {
      // Upload to Cloudinary
      console.log('[PostService] Starting media upload...');
      const uploadResult =
        mediaType === 'image'
          ? await mediaService.uploadImage(localUri, onProgress)
          : await mediaService.uploadVideo(localUri, duration, onProgress);

      console.log('[PostService] Upload done. Writing to Firestore...', {
        userId,
        mediaType,
        mediaUrl: uploadResult.secureUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        caption,
      });

      // Write post to Firestore
      const postId = await postRepository.create({
        userId,
        mediaType,
        mediaUrl: uploadResult.secureUrl,
        thumbnailUrl: uploadResult.thumbnailUrl ?? null,
        caption: caption || null,
      });

      console.log('[PostService] Firestore write success, postId:', postId);
      return postId;
    } catch (error) {
      console.error('[PostService] createPost error:', error);
      throw parseFirebaseError(error, 'create post');
    }
  },

  /**
   * Fetch feed posts: user's own posts + all friends' posts, newest first.
   */
  async getFeed(userId: string): Promise<Post[]> {
    try {
      console.log('[PostService] getFeed for userId:', userId);
      const friendIds = await friendService.getFriendIds(userId);
      console.log('[PostService] friendIds:', friendIds);
      const allUserIds = [userId, ...friendIds];
      const posts = await postRepository.getFeedPosts(allUserIds);
      console.log('[PostService] getFeed returned', posts.length, 'posts');
      return posts;
    } catch (error) {
      console.error('[PostService] getFeed error:', error);
      throw parseFirebaseError(error, 'feed');
    }
  },
};

