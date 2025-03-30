import { NavLink } from "@/types/types";

interface MobileNavInterface {
  isMenuOpen: boolean;
  activeSection: string;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: NavLink[];
}

const MobileNav: React.FC<MobileNavInterface> = ({
  isMenuOpen,
  activeSection,
  setIsMenuOpen,
  navLinks,
}) => {
  return (
    <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
      <ul className="mobile-nav-links">
        {navLinks.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={activeSection === link.id ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNav;
