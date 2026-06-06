/**
 * PostRepository — Firestore CRUD for the `posts` collection.
 * Only this file is allowed to read/write posts.
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  or,
  getDoc,
  doc,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Post, CreatePostPayload } from '../types/post.types';

const POSTS_COL = 'posts';

export const postRepository = {
  async create(payload: CreatePostPayload): Promise<string> {
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );
    const ref = await addDoc(collection(firestore, POSTS_COL), {
      ...cleanedPayload,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  /**
   * Fetch posts for a list of user IDs (own + friends), newest first.
   * Firestore `in` operator supports up to 30 items per query.
   * For larger friend lists, we chunk the query.
   */
  async getFeedPosts(userIds: string[], pageLimit = 20): Promise<Post[]> {
    if (userIds.length === 0) return [];

    // Chunk into groups of 30 (Firestore `in` limit)
    const chunks: string[][] = [];
    for (let i = 0; i < userIds.length; i += 30) {
      chunks.push(userIds.slice(i, i + 30));
    }

    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const q = query(
          collection(firestore, POSTS_COL),
          where('userId', 'in', chunk),
          orderBy('createdAt', 'desc'),
          limit(pageLimit),
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
      }),
    );

    // Merge and sort across chunks
    return results
      .flat()
      .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    const q = query(
      collection(firestore, POSTS_COL),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
  },
};
