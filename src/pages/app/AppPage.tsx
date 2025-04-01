// components/layouts/DashboardLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../../components/app/AppNavbar";
import "../../styles/app/AppPage.css";

const AppPage: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <AppNavbar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppPage;
