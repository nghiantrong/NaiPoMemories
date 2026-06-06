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
};
