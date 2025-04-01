// components/navs/AppNavbar.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { appLinks } from "@/data/app/appLinks";

// Import sub-components
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import Logo from "./Logo";
import "../../../styles/app/AppNavbar.css";

const AppNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="app-header-container">
        <Logo />

        <DesktopNavigation
          appLinks={appLinks}
          currentLocation={location.pathname}
        />

        <MobileNavigation appLinks={appLinks} />
      </div>
    </header>
  );
};

export default AppNavbar;
