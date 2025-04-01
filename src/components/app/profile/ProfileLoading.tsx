// components/profile/ProfileLoading.tsx
import React from "react";

const ProfileLoading: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    </div>
  );
};

export default ProfileLoading;
