/**
 * UserRepository — handles all Firestore reads/writes for the `users` collection.
 * This is the ONLY layer that imports from firebase/firestore for user data.
 */

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { UserDocument, UpdateProfilePayload } from '../types/user.types';

const USERS_COLLECTION = 'users';

export const userRepository = {
  /**
   * Fetch a single user document by their UID.
   */
  async getById(userId: string): Promise<UserDocument | null> {
    const snap = await getDoc(doc(firestore, USERS_COLLECTION, userId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as UserDocument;
  },

  /**
   * Find users by exact email match (for friend search).
   * Returns the first matching user or null.
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    const q = query(
      collection(firestore, USERS_COLLECTION),
      where('email', '==', email.trim().toLowerCase()),
      limit(1),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const snap = snapshot.docs[0];
    return { id: snap.id, ...snap.data() } as UserDocument;
  },

  /**
   * Update a user's profile fields (displayName, avatarUrl).
   */
  async update(userId: string, payload: UpdateProfilePayload): Promise<void> {
    await updateDoc(doc(firestore, USERS_COLLECTION, userId), payload as Record<string, unknown>);
  },
};
