import { Timestamp } from 'firebase/firestore';
import { MediaType } from '@/types';

export interface Post {
  id: string;
  userId: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  createdAt: Timestamp;
}

export interface CreatePostPayload {
  userId: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
}
