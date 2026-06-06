/**
 * FriendRepository — handles all Firestore operations for:
 *   - `friendRequests` collection
 *   - `friendships` collection
 *
 * This is the ONLY layer that directly reads/writes these collections.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  or,
  and,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import {
  FriendRequest,
  FriendRequestStatus,
  Friendship,
} from '../types/friend.types';

const REQUESTS_COL = 'friendRequests';
const FRIENDSHIPS_COL = 'friendships';

export const friendRepository = {
  // ─── Friend Requests ────────────────────────────────────────────────────────

  async sendRequest(senderId: string, receiverId: string): Promise<string> {
    const ref = await addDoc(collection(firestore, REQUESTS_COL), {
      senderId,
      receiverId,
      status: 'pending' as FriendRequestStatus,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async updateRequestStatus(
    requestId: string,
    status: FriendRequestStatus,
  ): Promise<void> {
    await updateDoc(doc(firestore, REQUESTS_COL, requestId), { status });
  },

  /** Get all pending requests received by a user */
  async getIncomingRequests(userId: string): Promise<FriendRequest[]> {
    const q = query(
      collection(firestore, REQUESTS_COL),
      where('receiverId', '==', userId),
      where('status', '==', 'pending'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FriendRequest);
  },

  /** Get all pending requests sent by a user */
  async getSentRequests(userId: string): Promise<FriendRequest[]> {
    const q = query(
      collection(firestore, REQUESTS_COL),
      where('senderId', '==', userId),
      where('status', '==', 'pending'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FriendRequest);
  },

  /**
   * Check if a pending/accepted request already exists between two users.
   * Used to prevent duplicate requests.
   */
  async findExistingRequest(
    userA: string,
    userB: string,
  ): Promise<FriendRequest | null> {
    // Check both directions
    const q1 = query(
      collection(firestore, REQUESTS_COL),
      where('senderId', '==', userA),
      where('receiverId', '==', userB),
    );
    const q2 = query(
      collection(firestore, REQUESTS_COL),
      where('senderId', '==', userB),
      where('receiverId', '==', userA),
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const allDocs = [...snap1.docs, ...snap2.docs];
    if (allDocs.length === 0) return null;
    const d = allDocs[0];
    return { id: d.id, ...d.data() } as FriendRequest;
  },

  // ─── Friendships ────────────────────────────────────────────────────────────

  async createFriendship(user1Id: string, user2Id: string): Promise<string> {
    const ref = await addDoc(collection(firestore, FRIENDSHIPS_COL), {
      user1Id,
      user2Id,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async getFriendships(userId: string): Promise<Friendship[]> {
    const q1 = query(
      collection(firestore, FRIENDSHIPS_COL),
      where('user1Id', '==', userId),
    );
    const q2 = query(
      collection(firestore, FRIENDSHIPS_COL),
      where('user2Id', '==', userId),
    );
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    return [...snap1.docs, ...snap2.docs].map(
      (d) => ({ id: d.id, ...d.data() }) as Friendship,
    );
  },

  async findExistingFriendship(
    userA: string,
    userB: string,
  ): Promise<Friendship | null> {
    const q1 = query(
      collection(firestore, FRIENDSHIPS_COL),
      where('user1Id', '==', userA),
      where('user2Id', '==', userB),
    );
    const q2 = query(
      collection(firestore, FRIENDSHIPS_COL),
      where('user1Id', '==', userB),
      where('user2Id', '==', userA),
    );
    const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const all = [...s1.docs, ...s2.docs];
    if (all.length === 0) return null;
    const d = all[0];
    return { id: d.id, ...d.data() } as Friendship;
  },

  /** Get the IDs of all friends for a given user */
  async getFriendIds(userId: string): Promise<string[]> {
    const friendships = await friendRepository.getFriendships(userId);
    return friendships.map((f) =>
      f.user1Id === userId ? f.user2Id : f.user1Id,
    );
  },
};
