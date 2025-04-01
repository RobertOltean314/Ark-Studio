import React, { useState, useEffect } from "react";
import PresentationPageNavbar from "./nav/PresentationPageNavbar";
import { useAuthNav } from "../../hooks/useAuthNav";

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Get authentication-aware navigation links
  const { navLinks } = useAuthNav();

  // Handle scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        <a href="/" className="logo">
          <span className="logo-text">ARK</span>
          <span className="logo-text-sub">Studio</span>
        </a>

        {/* Desktop Navigation */}
        <PresentationPageNavbar
          activeSection={activeSection}
          navLinks={navLinks}
        />

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}></div>
        </button>
      </div>
    </header>
  );
};

export default Header;
