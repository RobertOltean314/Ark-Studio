import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "../types/types";

// Original navigation links (from your navLinks.ts file)
const publicNavLinks: NavLink[] = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "workflow", label: "Workflow" },
  { id: "testimonials", label: "Testimonials" },
  { id: "signup", label: "Sign Up" },
];

// Private navigation links (only shown to authenticated users)
const privateNavLinks: NavLink[] = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "workflow", label: "Workflow" },
  { id: "testimonials", label: "Testimonials" },
  { id: "projects", label: "Projects" },
  { id: "time-tracking", label: "Time Tracking" },
];

/**
 * A custom hook that provides navigation links based on authentication status
 * @returns An object containing navigation links and user data
 */
export const useAuthNav = () => {
  const { currentUser, userProfile } = useAuth();

  // Derive navigation links based on authentication status
  const navLinks = useMemo(() => {
    return currentUser ? privateNavLinks : publicNavLinks;
  }, [currentUser]);

  // Get a display name for the user
  const displayName = useMemo(() => {
    if (!currentUser) return null;

    return (
      userProfile?.displayName || currentUser.email?.split("@")[0] || "User"
    );
  }, [currentUser, userProfile]);

  // Get the user's profile picture or first initial
  const userAvatar = useMemo(() => {
    if (!currentUser) return null;

    return {
      photoURL: userProfile?.photoURL || null,
      initial: (userProfile?.displayName || currentUser.email || "U").charAt(0),
    };
  }, [currentUser, userProfile]);

  return {
    navLinks,
    isAuthenticated: !!currentUser,
    displayName,
    userAvatar,
  };
};
