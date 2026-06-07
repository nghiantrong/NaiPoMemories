/**
 * AuthService — business logic layer for authentication.
 *
 * Responsibilities:
 * - Input validation before calling the repository
 * - Mapping Firebase errors into our AppError hierarchy
 * - Orchestrating multi-step operations (register + write Firestore doc)
 *
 * This service MUST NOT import anything from React or Expo Router.
 */

import { authRepository } from '../repositories/auth.repository';
import { userRepository } from '@/features/profile/repositories/user.repository';
import { LoginFormData, RegisterFormData } from '../types/auth.types';
import { parseFirebaseError, ValidationError } from '@/utils/error.utils';
import { isValidEmail } from '@/utils/validation.utils';

export const authService = {
  async login({ email, password }: LoginFormData) {
    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      throw new ValidationError('Please enter a valid email address.');
    }
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters.');
    }

    try {
      return await authRepository.login(trimmedEmail, password);
    } catch (error) {
      throw parseFirebaseError(error);
    }
  },

  async register({ email, password, displayName }: RegisterFormData) {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = displayName.trim();

    if (!isValidEmail(trimmedEmail)) {
      throw new ValidationError('Please enter a valid email address.');
    }
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters.');
    }
    if (trimmedName.length < 2) {
      throw new ValidationError('Display name must be at least 2 characters.');
    }
    if (trimmedName.length > 50) {
      throw new ValidationError('Display name must be 50 characters or fewer.');
    }

    try {
      return await authRepository.register(trimmedEmail, password, trimmedName);
    } catch (error) {
      throw parseFirebaseError(error);
    }
  },

  async logout() {
    try {
      const user = authRepository.getCurrentUser();
      if (user) {
        // Clear push token so another logged in user on this device doesn't receive pushes meant for this account
        await userRepository.update(user.uid, { expoPushToken: null });
      }
      await authRepository.logout();
    } catch (error) {
      throw parseFirebaseError(error);
    }
  },

  onAuthStateChanged: authRepository.onAuthStateChanged,

  getCurrentUser: authRepository.getCurrentUser,
};
