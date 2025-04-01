import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ProfilePage.css";

// Import icons
import {
  User as UserIcon,
  Mail,
  Calendar,
  Edit,
  LogOut,
  Shield,
  Settings,
  Bell,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Interface for form data
interface FormData {
  displayName: string;
  "preferences.theme": string;
  "preferences.notifications": boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    userProfile,
    loading,
    error,
    logOut,
    updateUserProfile,
    clearError,
  } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: userProfile?.displayName || "",
    "preferences.theme": userProfile?.preferences?.theme || "light",
    "preferences.notifications":
      userProfile?.preferences?.notifications || true,
  });

  // Update formData when userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        "preferences.theme": userProfile.preferences?.theme || "light",
        "preferences.notifications":
          userProfile.preferences?.notifications || true,
      });
    }
  }, [userProfile]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission for profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    clearError();

    try {
      if (!currentUser) return;

      // Prepare update data
      const updateData = {
        displayName: formData.displayName,
        preferences: {
          theme: formData["preferences.theme"],
          notifications: formData["preferences.notifications"],
        },
      };

      // Update the profile
      const success = await updateUserProfile(updateData);

      if (success) {
        setSuccess("Profile updated successfully!");
        setEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Format date from Firestore timestamp
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "N/A";

    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString();
    }

    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }

    return "N/A";
  };

  // Show loading screen
  // Show loading screen while authentication is being checked
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!currentUser && !loading) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-shapes">
          <div className="profile-shape profile-shape-1"></div>
          <div className="profile-shape profile-shape-2"></div>
          <div className="profile-shape profile-shape-3"></div>
        </div>

        <div className="profile-header">
          <h1 className="profile-title">
            Your <span className="profile-title-accent">Profile</span>
          </h1>
          <p className="profile-subtitle">
            Manage your account settings and preferences
          </p>
        </div>

        {error && (
          <div className="profile-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="profile-alert success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {formData.displayName.charAt(0) ||
                    currentUser?.email?.charAt(0) ||
                    "U"}
                </div>
              )}
            </div>

            <div className="profile-info">
              <h2 className="profile-name">
                {userProfile?.displayName || currentUser?.email?.split("@")[0]}
              </h2>
              <p className="profile-role">
                <Shield size={16} />
                <span>{userProfile?.role || "User"}</span>
              </p>
            </div>

            <button
              className="profile-edit-button"
              onClick={() => setEditing(!editing)}
            >
              <Edit size={18} />
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="profile-card-body">
            {editing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <div className="input-with-icon">
                    <UserIcon className="input-icon" size={18} />
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      placeholder="Enter your display name"
                      value={formData.displayName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="theme">Theme Preference</label>
                  <div className="input-with-icon">
                    <Settings className="input-icon" size={18} />
                    <select
                      id="theme"
                      name="preferences.theme"
                      value={formData["preferences.theme"]}
                      onChange={handleChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>

                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="preferences.notifications"
                    checked={formData["preferences.notifications"]}
                    onChange={handleChange}
                  />
                  <label htmlFor="notifications">
                    <Bell size={18} />
                    Enable Notifications
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-detail">
                  <div className="detail-icon">
                    <Mail />
                  </div>
                  <div className="detail-content">
                    <h3>Email Address</h3>
                    <p>
                      {userProfile?.email ||
                        currentUser?.email ||
                        "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="profile-detail">
                  <div className="detail-icon">
                    <Calendar />
                  </div>
                  <div className="detail-content">
                    <h3>Member Since</h3>
                    <p>
                      {userProfile?.createdAt
                        ? formatDate(userProfile.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="profile-detail">
                  <div className="detail-icon">
                    <Activity />
                  </div>
                  <div className="detail-content">
                    <h3>Last Login</h3>
                    <p>
                      {userProfile?.lastLogin
                        ? formatDate(userProfile.lastLogin)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="profile-detail">
                  <div className="detail-icon">
                    <Settings />
                  </div>
                  <div className="detail-content">
                    <h3>Theme Preference</h3>
                    <p>{userProfile?.preferences?.theme || "Light"}</p>
                  </div>
                </div>

                <div className="profile-detail">
                  <div className="detail-icon">
                    <Bell />
                  </div>
                  <div className="detail-content">
                    <h3>Notifications</h3>
                    <p>
                      {userProfile?.preferences?.notifications
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card-footer">
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
