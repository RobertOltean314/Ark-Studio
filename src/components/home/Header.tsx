import DesktopNav from "./navs/DesktopNav";
import { NavLink } from "@/types/types";

interface HeaderProps {
  activeSection: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: NavLink[];
}

const Header: React.FC<HeaderProps> = ({ activeSection, navLinks }) => {
  return (
    <header
      className={`header ${activeSection !== "hero" ? "header-scrolled" : ""}`}
    >
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">ARK</span>
          <span className="logo-text-sub">STUDIO</span>
        </div>
        <DesktopNav activeSection={activeSection} navLinks={navLinks} />
      </div>
    </header>
  );
};
export default Header;
