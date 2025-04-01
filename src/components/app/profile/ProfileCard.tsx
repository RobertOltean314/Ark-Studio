// components/profile/ProfileCard.tsx
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { FormData } from "../../../pages/app/ProfilePage";

// Icons
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
} from "lucide-react";

// Type definitions for props
interface ProfileCardProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => Promise<void>;
  formatDate: (timestamp: any) => string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  editing,
  setEditing,
  formData,
  handleChange,
  handleSubmit,
  handleLogout,
  formatDate,
}) => {
  return (
    <div className="profile-card">
      <ProfileCardHeader
        editing={editing}
        setEditing={setEditing}
        formData={formData}
      />

      <div className="profile-card-body">
        {editing ? (
          <EditProfileForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setEditing={setEditing}
          />
        ) : (
          <ProfileDetails formatDate={formatDate} />
        )}
      </div>

      <div className="profile-card-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Sub-component for Profile Card Header
const ProfileCardHeader: React.FC<{
  editing: boolean;
  setEditing: (editing: boolean) => void;
  formData: FormData;
}> = ({ editing, setEditing, formData }) => {
  const { currentUser, userProfile } = useAuth();

  return (
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
  );
};

// Sub-component for Edit Profile Form
const EditProfileForm: React.FC<{
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setEditing: (editing: boolean) => void;
}> = ({ formData, handleChange, handleSubmit, setEditing }) => {
  return (
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
  );
};

// Sub-component for Profile Details
const ProfileDetails: React.FC<{
  formatDate: (timestamp: any) => string;
}> = ({ formatDate }) => {
  const { currentUser, userProfile } = useAuth();

  return (
    <div className="profile-details">
      <ProfileDetailItem
        icon={<Mail />}
        title="Email Address"
        content={
          userProfile?.email || currentUser?.email || "No email provided"
        }
      />

      <ProfileDetailItem
        icon={<Calendar />}
        title="Member Since"
        content={
          userProfile?.createdAt ? formatDate(userProfile.createdAt) : "N/A"
        }
      />

      <ProfileDetailItem
        icon={<Activity />}
        title="Last Login"
        content={
          userProfile?.lastLogin ? formatDate(userProfile.lastLogin) : "N/A"
        }
      />

      <ProfileDetailItem
        icon={<Settings />}
        title="Theme Preference"
        content={userProfile?.preferences?.theme || "Light"}
      />

      <ProfileDetailItem
        icon={<Bell />}
        title="Notifications"
        content={
          userProfile?.preferences?.notifications ? "Enabled" : "Disabled"
        }
      />
    </div>
  );
};

// Sub-component for individual profile detail
const ProfileDetailItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  content: string;
}> = ({ icon, title, content }) => (
  <div className="profile-detail">
    <div className="detail-icon">{icon}</div>
    <div className="detail-content">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  </div>
);

export default ProfileCard;
