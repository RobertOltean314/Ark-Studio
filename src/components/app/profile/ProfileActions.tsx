// components/profile/ProfileActions.tsx
import React from "react";

interface ProfileActionsProps {
  onBackToDashboard: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  onBackToDashboard,
}) => {
  return (
    <div className="profile-actions">
      <button className="btn-secondary" onClick={onBackToDashboard}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ProfileActions;
