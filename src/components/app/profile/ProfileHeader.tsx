// components/profile/ProfileHeader.tsx
import React from "react";

const ProfileHeader: React.FC = () => {
  return (
    <div className="profile-header">
      <h1 className="profile-title">
        Your <span className="profile-title-accent">Profile</span>
      </h1>
      <p className="profile-subtitle">
        Manage your account settings and preferences
      </p>
    </div>
  );
};

export default ProfileHeader;
