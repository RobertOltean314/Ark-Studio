// components/profile/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Import component sub-modules
import ProfileLoading from "../../components/app/profile/ProfileLoading";
import ProfileHeader from "../../components/app/profile/ProfileHeader";
import ProfileCard from "../../components/app/profile/ProfileCard";
import ProfileActions from "../../components/app/profile/ProfileActions";
import { AlertCircle, CheckCircle } from "lucide-react";

import "../../styles/app/ProfilePage.css";

// Interface for form data
export interface FormData {
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
  useEffect(() => {
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

  // Utility function to format date
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

  // Show loading screen while authentication is being checked
  if (loading) {
    return <ProfileLoading />;
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

        <ProfileHeader />

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

        <ProfileCard
          editing={editing}
          setEditing={setEditing}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLogout={handleLogout}
          formatDate={formatDate}
        />

        <ProfileActions onBackToDashboard={() => navigate("/")} />
      </div>
    </div>
  );
};

export default ProfilePage;
