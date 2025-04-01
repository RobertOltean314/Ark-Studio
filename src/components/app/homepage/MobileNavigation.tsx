// components/navs/MobileNavigation.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { User, LogOut, Menu, X } from "lucide-react";

// Type definitions
interface AppLink {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileNavigationProps {
  appLinks: AppLink[];
}

interface MobileUserProfileProps {
  userProfile: any;
  currentUser: any;
  displayName: string;
}

interface MobileNavLinksProps {
  appLinks: AppLink[];
  onProfileClick: () => void;
}

// Mobile User Profile Sub-Component
const MobileUserProfile: React.FC<MobileUserProfileProps> = ({
  userProfile,
  currentUser,
  displayName,
}) => (
  <div className="app-mobile-profile">
    {userProfile?.photoURL ? (
      <img
        src={userProfile.photoURL}
        alt="User"
        className="app-mobile-user-avatar"
      />
    ) : (
      <div className="app-mobile-user-avatar-placeholder">
        {(userProfile?.displayName || currentUser?.email || "U").charAt(0)}
      </div>
    )}
    <div className="app-mobile-user-info">
      <span className="app-mobile-username">{displayName}</span>
      <span className="app-mobile-user-email">{currentUser?.email}</span>
    </div>
  </div>
);

// Mobile Navigation Links Sub-Component
const MobileNavLinks: React.FC<MobileNavLinksProps> = ({
  appLinks,
  onProfileClick,
}) => (
  <ul className="app-mobile-nav-links">
    {appLinks.map((link) => (
      <li key={link.path}>
        <Link to={link.path}>
          {link.icon}
          <span>{link.label}</span>
        </Link>
      </li>
    ))}
    <li>
      <button onClick={onProfileClick} className="mobile-nav-link">
        <User size={18} />
        <span>Profile</span>
      </button>
    </li>
    <li>
      <Link to="/">
        <span>Visit Website</span>
      </Link>
    </li>
  </ul>
);

// Main Mobile Navigation Component
const MobileNavigation: React.FC<MobileNavigationProps> = ({ appLinks }) => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get display name for the user
  const displayName =
    userProfile?.displayName ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "User");

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="app-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      <div className={`app-mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <MobileUserProfile
          userProfile={userProfile}
          currentUser={currentUser}
          displayName={displayName}
        />

        <MobileNavLinks
          appLinks={appLinks}
          onProfileClick={() => navigate("/app/profile")}
        />

        <button onClick={handleLogout} className="app-mobile-logout-button">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );
};

export default MobileNavigation;
