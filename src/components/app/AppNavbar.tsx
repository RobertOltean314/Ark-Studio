// components/navs/AppNavbar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Folder,
  Users,
  Calculator,
  Clock,
  BarChart2,
} from "lucide-react";
import "../../styles/app/AppNavbar.css";

const AppNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
    useState<boolean>(false);

  // Application navigation links
  const appLinks = [
    { path: "/app/projects", label: "Projects", icon: <Folder size={18} /> },
    { path: "/app/clients", label: "Clients", icon: <Users size={18} /> },
    {
      path: "/app/calculator",
      label: "Payment Calculator",
      icon: <Calculator size={18} />,
    },
    {
      path: "/app/time-tracking",
      label: "Time Tracking",
      icon: <Clock size={18} />,
    },
    {
      path: "/app/statistics",
      label: "Statistics",
      icon: <BarChart2 size={18} />,
    },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileDropdownOpen) {
      setIsProfileDropdownOpen(false);
    }
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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

  // Get display name for the user
  const displayName =
    userProfile?.displayName ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "User");

  return (
    <header className="app-header">
      <div className="app-header-container">
        <Link to="/app" className="app-logo">
          <span className="logo-text">ARK</span>
          <span className="logo-text-sub">Studio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="app-desktop-nav">
          <ul className="app-nav-links">
            {appLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? "active" : ""}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* User Profile */}
          <div className="app-user-profile">
            <button
              className="app-profile-trigger"
              onClick={toggleProfileDropdown}
            >
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="User"
                  className="app-user-avatar"
                />
              ) : (
                <div className="app-user-avatar-placeholder">
                  {(
                    userProfile?.displayName ||
                    currentUser?.email ||
                    "U"
                  ).charAt(0)}
                </div>
              )}
              <span className="app-username">{displayName}</span>
              <ChevronDown size={16} />
            </button>

            {isProfileDropdownOpen && (
              <div className="app-profile-dropdown">
                <Link to="/app/profile" className="app-dropdown-item">
                  <User size={16} />
                  Profile
                </Link>
                <button onClick={handleLogout} className="app-dropdown-item">
                  <LogOut size={16} />
                  Sign Out
                </button>
                <Link to="/" className="app-dropdown-item">
                  <span>Visit Website</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="app-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`app-mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="app-mobile-profile">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="User"
                className="app-mobile-user-avatar"
              />
            ) : (
              <div className="app-mobile-user-avatar-placeholder">
                {(userProfile?.displayName || currentUser?.email || "U").charAt(
                  0
                )}
              </div>
            )}
            <div className="app-mobile-user-info">
              <span className="app-mobile-username">{displayName}</span>
              <span className="app-mobile-user-email">
                {currentUser?.email}
              </span>
            </div>
          </div>

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
              <Link to="/app/profile">
                <User size={18} />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <span>Visit Website</span>
              </Link>
            </li>
          </ul>

          <button onClick={handleLogout} className="app-mobile-logout-button">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
