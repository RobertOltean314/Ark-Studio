/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

// User profile data structure
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any; // Firestore timestamp
  lastLogin: any; // Firestore timestamp
  role: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

// Context interface
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
  clearError: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Clear any error messages
  const clearError = () => {
    setError(null);
  };

  // Function to fetch user profile
  const fetchUserProfile = async (user: User) => {
    if (!user) return null;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setUserProfile(userData);

        // Update last login time
        await setDoc(
          userDocRef,
          { lastLogin: serverTimestamp() },
          { merge: true }
        );

        return userData;
      } else {
        // Create new user profile if it doesn't exist
        const newUserProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: "user",
          preferences: {
            theme: "light",
            notifications: true,
          },
        };

        await setDoc(userDocRef, newUserProfile);
        setUserProfile(newUserProfile);
        return newUserProfile;
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user data. Please try again.");
      return null;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      clearError();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return result;
    } catch (err: any) {
      console.error("Error signing up:", err);
      if (err.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email or login."
        );
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
      throw err;
    }
  };

  // Login with email and password
  const logIn = async (email: string, password: string) => {
    try {
      clearError();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err: any) {
      console.error("Error logging in:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many failed login attempts. Please try again later or reset your password."
        );
      } else {
        setError("Failed to log in. Please try again.");
      }
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (err: any) {
      console.error("Error signing in with Google:", err);
      setError("Failed to sign in with Google. Please try again.");
      throw err;
    }
  };

  // Log out
  const logOut = async () => {
    try {
      clearError();
      await signOut(auth);
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError("Failed to sign out. Please try again.");
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (
    data: Partial<UserProfile>
  ): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      clearError();
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, data, { merge: true });

      // Refresh profile data
      const updatedDoc = await getDoc(userDocRef);
      if (updatedDoc.exists()) {
        setUserProfile(updatedDoc.data() as UserProfile);
      }

      return true;
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
      return false;
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Context value
  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    logIn,
    signInWithGoogle,
    logOut,
    clearError,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
