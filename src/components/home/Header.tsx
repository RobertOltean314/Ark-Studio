import DesktopNav from "./navs/DesktopNav";
import MobileNav from "./navs/MobileNav";
import { NavLink } from "@/types/types";

interface HeaderProps {
  activeSection: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: NavLink[];
}

const Header: React.FC<HeaderProps> = ({
  activeSection,
  isMenuOpen,
  setIsMenuOpen,
  navLinks,
}) => {
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

        <MobileNav
          isMenuOpen={isMenuOpen}
          activeSection={activeSection}
          setIsMenuOpen={setIsMenuOpen}
          navLinks={navLinks}
        />
      </div>
    </header>
  );
};
export default Header;
