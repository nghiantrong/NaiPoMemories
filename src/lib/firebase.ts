/**
 * Firebase initialization.
 * All Firebase services are initialized here and exported as singletons.
 * Only this file is allowed to import from firebase/app and related packages.
 *
 * Environment variables are loaded via Expo's EXPO_PUBLIC_ prefix,
 * which makes them available client-side without exposing build secrets.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initialization in hot reload scenarios (React Native dev)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);

export default app;
