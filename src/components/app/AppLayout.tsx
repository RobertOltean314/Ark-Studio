// components/layouts/AppLayout.tsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AppNavbar from "./AppNavbar";
import "../../styles/app/AppLayout.css";

const AppLayout: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="app-layout">
      <AppNavbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
