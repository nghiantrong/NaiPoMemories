import { userRepository } from '../repositories/user.repository';
import { UpdateProfilePayload, UserDocument } from '../types/user.types';
import { parseFirebaseError, ValidationError } from '@/utils/error.utils';

export const userService = {
  async getProfile(userId: string): Promise<UserDocument | null> {
    try {
      return await userRepository.getById(userId);
    } catch (error) {
      throw parseFirebaseError(error, 'profile');
    }
  },

  async findByEmail(email: string): Promise<UserDocument | null> {
    if (!email.trim()) {
      throw new ValidationError('Please enter an email address to search.');
    }
    try {
      return await userRepository.findByEmail(email);
    } catch (error) {
      throw parseFirebaseError(error, 'user search');
    }
  },

  async updateProfile(
    userId: string,
    payload: UpdateProfilePayload,
  ): Promise<void> {
    if (payload.displayName !== undefined) {
      const name = payload.displayName.trim();
      if (name.length < 2) {
        throw new ValidationError('Display name must be at least 2 characters.');
      }
      if (name.length > 50) {
        throw new ValidationError('Display name must be 50 characters or fewer.');
      }
      payload = { ...payload, displayName: name };
    }

    try {
      await userRepository.update(userId, payload);
    } catch (error) {
      throw parseFirebaseError(error, 'profile update');
    }
  },
};
