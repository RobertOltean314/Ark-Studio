// components/navs/DesktopNavigation.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";

// Type definitions
interface AppLink {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface DesktopNavigationProps {
  appLinks: AppLink[];
  currentLocation: string;
}

interface UserProfileTriggerProps {
  userProfile: any;
  currentUser: any;
  displayName: string;
  onClick: () => void;
}

interface ProfileDropdownProps {
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

// User Profile Trigger Sub-Component
const UserProfileTrigger: React.FC<UserProfileTriggerProps> = ({
  userProfile,
  currentUser,
  displayName,
  onClick,
}) => (
  <button className="app-profile-trigger" onClick={onClick}>
    {userProfile?.photoURL ? (
      <img src={userProfile.photoURL} alt="User" className="app-user-avatar" />
    ) : (
      <div className="app-user-avatar-placeholder">
        {(userProfile?.displayName || currentUser?.email || "U").charAt(0)}
      </div>
    )}
    <span className="app-username">{displayName}</span>
    <ChevronDown size={16} />
  </button>
);

// Profile Dropdown Sub-Component
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onProfileClick,
  onLogoutClick,
}) => (
  <div className="app-profile-dropdown">
    <button onClick={onProfileClick} className="app-dropdown-item">
      <User size={16} />
      Profile
    </button>
    <button onClick={onLogoutClick} className="app-dropdown-item">
      <LogOut size={16} />
      Sign Out
    </button>
  </div>
);

// Main Desktop Navigation Component
const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  appLinks,
  currentLocation,
}) => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logOut } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Get display name for the user
  const displayName =
    userProfile?.displayName ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "User");

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="app-desktop-nav">
      {/* Navigation Links */}
      <ul className="app-nav-links">
        {appLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={currentLocation === link.path ? "active" : ""}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* User Profile */}
      <div className="app-user-profile">
        <UserProfileTrigger
          userProfile={userProfile}
          currentUser={currentUser}
          displayName={displayName}
          onClick={toggleProfileDropdown}
        />

        {isProfileDropdownOpen && (
          <ProfileDropdown
            onProfileClick={() => navigate("/app/profile")}
            onLogoutClick={handleLogout}
          />
        )}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
