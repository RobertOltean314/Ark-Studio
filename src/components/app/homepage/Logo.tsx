// components/navs/Logo.tsx
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => (
  <Link to="/app" className="app-logo">
    <span className="logo-text">ARK</span>
    <span className="logo-text-sub">Studio</span>
  </Link>
);

export default Logo;
