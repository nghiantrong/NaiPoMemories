/**
 * AuthRepository — the ONLY layer allowed to talk to Firebase Auth and
 * write the initial user document to Firestore.
 *
 * Never import this directly in a component or screen.
 * Always go through AuthService → AuthRepository.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/lib/firebase';

export const authRepository = {
  /**
   * Create a new Firebase Auth user and write their profile document
   * to the `users` Firestore collection.
   */
  async register(
    email: string,
    password: string,
    displayName: string,
  ): Promise<User> {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    // Update Firebase Auth display name
    await updateProfile(credential.user, { displayName });

    // Write user document to Firestore
    await setDoc(doc(firestore, 'users', credential.user.uid), {
      id: credential.user.uid,
      email,
      displayName,
      avatarUrl: null,
      createdAt: serverTimestamp(),
    });

    return credential.user;
  },

  /**
   * Sign in an existing user with email and password.
   */
  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    return credential.user;
  },

  /**
   * Sign out the current user.
   */
  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  },

  /**
   * Subscribe to Firebase Auth state changes.
   * Returns an unsubscribe function — always call it on unmount.
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(firebaseAuth, callback);
  },

  /**
   * Get the currently authenticated user (synchronous snapshot).
   */
  getCurrentUser(): User | null {
    return firebaseAuth.currentUser;
  },
};
