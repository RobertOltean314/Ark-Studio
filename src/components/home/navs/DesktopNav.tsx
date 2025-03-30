import { NavLink } from "@/types/types";

interface DesktopNavProps {
  activeSection: string;
  navLinks: NavLink[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ activeSection, navLinks }) => {
  return (
    <nav className="desktop-nav">
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={activeSection === link.id ? "active" : ""}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopNav;
