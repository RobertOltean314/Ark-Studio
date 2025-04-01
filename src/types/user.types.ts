// src/types/user.types.ts
import { Timestamp } from "firebase/firestore";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  role: "user" | "admin" | "moderator";
  preferences: UserPreferences;
}

export interface UserProfileUpdate {
  displayName?: string;
  photoURL?: string;
  email?: string;
  preferences?: Partial<UserPreferences>;
  // Add other fields that can be updated
}
