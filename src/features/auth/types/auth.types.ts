import { Timestamp } from 'firebase/firestore';

// ─── Auth Forms ───────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  displayName: string;
}

// ─── Firestore User Document ──────────────────────────────────────────────────

export interface UserDocument {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Timestamp;
}

// ─── Auth State ───────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}
