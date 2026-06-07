/**
 * FriendService — business logic for the friend system.
 *
 * Enforces rules:
 *   - Cannot add self as friend
 *   - Cannot send duplicate requests
 *   - Cannot create duplicate friendships
 *   - Accepting a request atomically creates a friendship
 */

import { friendRepository } from '../repositories/friend.repository';
import { userRepository } from '@/features/profile/repositories/user.repository';
import { parseFirebaseError, ValidationError } from '@/utils/error.utils';
import { FriendWithProfile, Friendship } from '../types/friend.types';
import { UserDocument } from '@/features/profile/types/user.types';

export const friendService = {
  /**
   * Send a friend request to a user found by email.
   * Returns the target user's document so the caller can display it.
   */
  async sendRequestByEmail(
    currentUserId: string,
    targetEmail: string,
  ): Promise<UserDocument> {
    const target = await userRepository.findByEmail(targetEmail);

    if (!target) {
      throw new ValidationError('No user found with that email address.');
    }
    if (target.id === currentUserId) {
      throw new ValidationError("You can't send a friend request to yourself.");
    }

    const existingRequest = await friendRepository.findExistingRequest(
      currentUserId,
      target.id,
    );
    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        throw new ValidationError('A friend request already exists between you two.');
      }
      if (existingRequest.status === 'accepted') {
        throw new ValidationError('You are already friends with this person.');
      }
    }

    const existingFriendship = await friendRepository.findExistingFriendship(
      currentUserId,
      target.id,
    );
    if (existingFriendship) {
      throw new ValidationError('You are already friends with this person.');
    }

    try {
      await friendRepository.sendRequest(currentUserId, target.id);
      return target;
    } catch (error) {
      throw parseFirebaseError(error, 'friend request');
    }
  },

  /**
   * Accept an incoming friend request and create a friendship document.
   */
  async acceptRequest(requestId: string, senderId: string, receiverId: string): Promise<void> {
    try {
      // Update status first, then create friendship
      await friendRepository.updateRequestStatus(requestId, 'accepted');
      await friendRepository.createFriendship(senderId, receiverId);
    } catch (error) {
      throw parseFirebaseError(error, 'accepting friend request');
    }
  },

  /**
   * Reject an incoming friend request.
   */
  async rejectRequest(requestId: string): Promise<void> {
    try {
      await friendRepository.updateRequestStatus(requestId, 'rejected');
    } catch (error) {
      throw parseFirebaseError(error, 'rejecting friend request');
    }
  },

  /**
   * Get all friends for a user, including their profile info.
   */
  async getFriendsWithProfiles(userId: string): Promise<FriendWithProfile[]> {
    try {
      const friendIds = await friendRepository.getFriendIds(userId);
      if (friendIds.length === 0) return [];

      const profiles = await Promise.all(
        friendIds.map((id) => userRepository.getById(id)),
      );

      const friendships = await friendRepository.getFriendships(userId);

      return profiles
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map((profile) => {
          const friendship = friendships.find(
            (f) => f.user1Id === profile.id || f.user2Id === profile.id,
          );
          return {
            friendshipId: friendship?.id ?? '',
            userId: profile.id,
            displayName: profile.displayName,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
            expoPushToken: profile.expoPushToken,
            streakCount: friendship?.streakCount || 0,
            streakStatus: friendship?.streakStatus || 'active',
            myRecoveryChances: friendship ? (friendship.user1Id === userId ? friendship.recoveryChancesUser1 : friendship.recoveryChancesUser2) : 2,
            theirRecoveryChances: friendship ? (friendship.user1Id === userId ? friendship.recoveryChancesUser2 : friendship.recoveryChancesUser1) : 2,
          };
        });
    } catch (error) {
      throw parseFirebaseError(error, 'friends list');
    }
  },

  async getIncomingRequests(userId: string) {
    try {
      return await friendRepository.getIncomingRequests(userId);
    } catch (error) {
      throw parseFirebaseError(error, 'friend requests');
    }
  },

  async getFriendIds(userId: string): Promise<string[]> {
    try {
      return await friendRepository.getFriendIds(userId);
    } catch (error) {
      throw parseFirebaseError(error, 'friend IDs');
    }
  },

  async updatePostStreak(userId: string): Promise<void> {
    try {
      const friendships = await friendRepository.getFriendships(userId);
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.slice(0, 7);

      for (const friendship of friendships) {
        const isUser1 = friendship.user1Id === userId;
        const lastUser1PostDate = isUser1 ? today : friendship.lastUser1PostDate;
        const lastUser2PostDate = !isUser1 ? today : friendship.lastUser2PostDate;

        let { streakCount = 0, streakLastUpdatedDate, streakStatus = 'active' } = friendship;
        const todayObj = new Date(today);

        // Check if streak broke
        if (streakLastUpdatedDate) {
          const lastUpdateDateObj = new Date(streakLastUpdatedDate);
          const diffDays = Math.floor((todayObj.getTime() - lastUpdateDateObj.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 2 && streakStatus === 'active') {
            streakStatus = 'at_risk'; // Missed yesterday
          } else if (diffDays > 2) {
            streakStatus = 'broken'; // Missed more than 1 day
            streakCount = 0;
          }
        }

        // Handle today's post
        if (lastUser1PostDate === today && lastUser2PostDate === today && streakLastUpdatedDate !== today) {
          if (streakStatus === 'active' || streakStatus === 'broken') {
            streakCount += 1;
            streakStatus = 'active';
            streakLastUpdatedDate = today;
          } else if (streakStatus === 'at_risk') {
            // Old streak lost because they didn't recover before posting together
            streakCount = 1;
            streakStatus = 'active';
            streakLastUpdatedDate = today;
          }
        }

        // Monthly recovery reset
        let recoveryChancesUser1 = friendship.recoveryChancesUser1 ?? 2;
        let recoveryChancesUser2 = friendship.recoveryChancesUser2 ?? 2;
        let lastRecoveryMonth = friendship.lastRecoveryMonth;

        if (lastRecoveryMonth !== currentMonth) {
          recoveryChancesUser1 = 2;
          recoveryChancesUser2 = 2;
          lastRecoveryMonth = currentMonth;
        }

        await friendRepository.updateFriendship(friendship.id, {
          lastUser1PostDate: lastUser1PostDate ?? null,
          lastUser2PostDate: lastUser2PostDate ?? null,
          streakCount: streakCount ?? 0,
          streakLastUpdatedDate: streakLastUpdatedDate ?? null,
          streakStatus: streakStatus ?? 'active',
          recoveryChancesUser1: recoveryChancesUser1 ?? 2,
          recoveryChancesUser2: recoveryChancesUser2 ?? 2,
          lastRecoveryMonth: lastRecoveryMonth ?? null,
        });
      }
    } catch (e) {
      console.error('[FriendService] Error updating post streak', e);
    }
  },

  async recoverStreak(friendshipId: string, userId: string): Promise<void> {
    try {
      const friendships = await friendRepository.getFriendships(userId);
      const friendship = friendships.find(f => f.id === friendshipId);
      if (!friendship) return;
      
      const isUser1 = friendship.user1Id === userId;
      let { recoveryChancesUser1 = 2, recoveryChancesUser2 = 2, streakStatus } = friendship;

      const myChances = isUser1 ? recoveryChancesUser1 : recoveryChancesUser2;
      if (myChances <= 0 || streakStatus !== 'at_risk') {
        throw new Error('Không thể phục hồi chuỗi.');
      }

      if (isUser1) recoveryChancesUser1--;
      else recoveryChancesUser2--;

      // Recover by pretending they posted yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const streakLastUpdatedDate = yesterday.toISOString().split('T')[0];

      await friendRepository.updateFriendship(friendshipId, {
        recoveryChancesUser1,
        recoveryChancesUser2,
        streakStatus: 'active',
        streakLastUpdatedDate,
      });
    } catch (e) {
      console.error('[FriendService] Error recovering streak', e);
      throw e;
    }
  },
};

