import { Timestamp } from 'firebase/firestore';

export interface UserDocument {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt: Timestamp;
}

export interface UpdateProfilePayload {
  displayName?: string;
  avatarUrl?: string;
}
