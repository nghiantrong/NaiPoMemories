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
  // Streak Fields
  streakCount: number;
  lastUser1PostDate: string | null; // YYYY-MM-DD
  lastUser2PostDate: string | null; // YYYY-MM-DD
  streakLastUpdatedDate: string | null; // YYYY-MM-DD
  streakStatus: 'active' | 'at_risk' | 'broken';
  recoveryChancesUser1: number;
  recoveryChancesUser2: number;
  lastRecoveryMonth: string | null; // YYYY-MM
}

export interface FriendWithProfile {
  friendshipId: string;
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  expoPushToken?: string;
  streakCount: number;
  streakStatus: 'active' | 'at_risk' | 'broken';
  myRecoveryChances: number;
  theirRecoveryChances: number;
}
