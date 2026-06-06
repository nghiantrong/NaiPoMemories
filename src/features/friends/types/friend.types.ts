import { Timestamp } from 'firebase/firestore';

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: Timestamp;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Timestamp;
}

export interface FriendWithProfile {
  friendshipId: string;
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
}
