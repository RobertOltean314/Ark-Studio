import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";

// Types
interface Position {
  x: number;
  y: number;
}

interface NavLink {
  id: string;
  label: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

// 3D animation utility hook
const useMouseParallax = (strength: number = 10): Position => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / strength;
      const y = (window.innerHeight / 2 - e.clientY) / strength;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength]);

  return position;
};

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [animatedElements, setAnimatedElements] = useState<
    Record<string, boolean>
  >({});
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const parallax = useMouseParallax(50);

  // Navigation links
  const navLinks: NavLink[] = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "workflow", label: "Workflow" },
    { id: "testimonials", label: "Testimonials" },
    { id: "signup", label: "Sign Up" },
  ];

  // Features data
  const features: Feature[] = [
    {
      id: "project-tracking",
      title: "Project Tracking",
      description:
        "Keep all your video projects organized with detailed status tracking and milestone management.",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 14H14V21H21V14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 14H3V21H10V14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3H14V10H21V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 3H3V10H10V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      benefits: [
        "Organize your projects with custom templates",
        "Track project status in real-time",
        "Set and monitor milestones",
        "Share progress with clients",
      ],
    },
    {
      id: "time-tracker",
      title: "Time Tracker",
      description:
        "Automatically track your editing hours with precision down to the second, fully integrated with popular editing software.",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6V12L16 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      benefits: [
        "Track time automatically while editing",
        "Integration with Premiere Pro & DaVinci Resolve",
        "Generate detailed time reports",
        "Analyze your work patterns",
      ],
    },
    {
      id: "analytics",
      title: "Analytics Dashboard",
      description:
        "Visualize your productivity and earnings with customizable charts and reports that help optimize your workflow.",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 20V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 20V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20V14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      benefits: [
        "Track project profitability",
        "Monitor hourly rates over time",
        "View long-term productivity trends",
        "Identify your most valuable clients",
      ],
    },
    {
      id: "financial",
      title: "Financial Tools",
      description:
        "Calculate earnings based on project rates, hourly fees, and generate professional invoices with ease.",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1V23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      benefits: [
        "Generate professional invoices",
        "Track payments automatically",
        "Support for multiple currencies",
        "Tax calculation and reporting",
      ],
    },
  ];

  // Workflow steps
  const workflowSteps: WorkflowStep[] = [
    {
      id: "plan",
      title: "Plan",
      description: "Organize your project workflow and set milestones",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 2V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 2V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 8H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12H8.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 12H16.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16H8.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16H16.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "track",
      title: "Track",
      description: "Monitor time spent on each editing task precisely",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8V12L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.05 11C3.27151 8.7633 4.33668 6.69772 6.06568 5.22361C7.79468 3.74951 10.0225 2.9731 12.2743 3.00219C14.5261 3.03128 16.731 3.86358 18.4225 5.38555C20.114 6.90752 21.131 8.99996 21.3009 11.2433C21.4708 13.4866 20.7839 15.7161 19.3732 17.506C17.9625 19.2959 15.9276 20.5358 13.6878 20.9895C11.4479 21.4432 9.12212 21.078 7.1718 19.9603C5.22149 18.8427 3.7822 17.043 3.12 14.95"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 15V11H7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "analyze",
      title: "Analyze",
      description: "Review performance metrics and optimize workflow",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3V21H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9L9 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 13L14 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 7L19 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "earn",
      title: "Earn",
      description: "Calculate your revenue and maximize profitability",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2V6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.93 4.93L7.76 7.76"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.24 16.24L19.07 19.07"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 12H22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.93 19.07L7.76 16.24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.24 7.76L19.07 4.93"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Freelance Video Editor",
      avatar: "AC",
      quote:
        "ARK Studio has completely transformed my freelance business. I've increased my rates by 30% because I can now show clients exactly how I spend my time.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Post-Production Supervisor",
      quote:
        "Managing our studio's workflow used to be a nightmare. With ARK Studio, I can oversee all projects and editor productivity in real-time.",
      avatar: "SJ",
    },
    {
      id: 3,
      name: "Marcus Rivera",
      role: "YouTube Content Creator",
      quote:
        "The analytics dashboard helps me understand which videos are most profitable based on editing time vs. revenue. Game changer!",
      avatar: "MR",
    },
  ];

  // Track scroll position to determine active section
  useEffect(() => {
    const handleScroll = () => {
      // Determine which section is currently in view
      Object.entries(sectionsRef.current).forEach(([id, ref]) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const offset = window.innerHeight * 0.3;

        if (rect.top < offset && rect.bottom > offset) {
          setActiveSection(id);
        }
      });

      // Check for elements to animate
      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;

        if (isVisible && !element.classList.contains("animated")) {
          element.classList.add("animated");
          setAnimatedElements((prev) => ({
            ...prev,
            [element.id]: true,
          }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Register section refs
  const registerSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref && !sectionsRef.current[id]) {
      sectionsRef.current = { ...sectionsRef.current, [id]: ref };
    }
  };

  return (
    <div className="homepage">
      {/* Header and Navigation */}
      <header
        className={`header ${
          activeSection !== "hero" ? "header-scrolled" : ""
        }`}
      >
        <div className="header-container">
          <div className="logo">
            <span className="logo-text">ARK</span>
            <span className="logo-text-sub">STUDIO</span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile menu button */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
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
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={(ref) => registerSectionRef("hero", ref)}
        className="hero-section"
      >
        <div className="hero-background">
          <div className="hero-shapes">
            <div
              className="shape shape-1"
              style={{
                transform: `translate(${parallax.x * -1}px, ${
                  parallax.y * -1
                }px)`,
              }}
            ></div>
            <div
              className="shape shape-2"
              style={{
                transform: `translate(${parallax.x * -1.5}px, ${
                  parallax.y * -1.5
                }px)`,
              }}
            ></div>
            <div
              className="shape shape-3"
              style={{
                transform: `translate(${parallax.x * -2}px, ${
                  parallax.y * -2
                }px)`,
              }}
            ></div>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">ARK</span>
            <span className="hero-title-sub">STUDIO</span>
          </h1>
          <p className="hero-subtitle">Elevate Your Video Editing Workflow</p>

          <div className="hero-cta">
            <a href="#signup" className="btn btn-primary">
              Create Account
            </a>
            <a href="#demo" className="btn btn-secondary">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3L19 12L5 21V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Watch Demo
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Earnings</span>
                <span className="stat-trend positive">+15%</span>
              </div>
              <div className="stat-value">$24,856</div>
              <div className="stat-period">This Month</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Projects</span>
                <span className="stat-trend positive">+3</span>
              </div>
              <div className="stat-value">18</div>
              <div className="stat-period">Active</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Hours</span>
                <span className="stat-trend negative">-8</span>
              </div>
              <div className="stat-value">164</div>
              <div className="stat-period">This Month</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Efficiency</span>
                <span className="stat-trend positive">+2%</span>
              </div>
              <div className="stat-value">94%</div>
              <div className="stat-period">Edit Ratio</div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={(ref) => registerSectionRef("features", ref)}
        className="features-section"
      >
        <div className="section-header">
          <h2 className="section-title">
            Powerful Tools for Video Professionals
          </h2>
          <p className="section-subtitle">
            Streamline your workflow with our integrated suite of tools designed
            for video editors
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              id={`feature-${feature.id}`}
              className={`feature-card animate-on-scroll ${
                animatedElements[`feature-${feature.id}`] ? "animated" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>

              <ul className="feature-benefits">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="feature-benefit">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3D Application Preview Section */}
      <section id="preview" className="preview-section">
        <div className="preview-content">
          <div className="section-header">
            <h2 className="section-title">Intuitive Interface</h2>
            <p className="section-subtitle">
              A powerful dashboard that brings all your editing metrics together
            </p>
          </div>

          <div className="preview-features">
            <div className="preview-feature">
              <div className="preview-feature-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12C21 13.8805 20.411 15.7137 19.3156 17.2423C18.2203 18.7709 16.6736 19.9179 14.893 20.5224C13.1123 21.1268 11.187 21.1583 9.38744 20.6125C7.58792 20.0666 6.00459 18.9707 4.85982 17.4789C3.71505 15.987 3.06635 14.174 3.00482 12.2945C2.94329 10.415 3.47203 8.56344 4.51677 6.99987C5.56152 5.4363 7.06979 4.23925 8.82975 3.57685C10.5897 2.91444 12.513 2.81996 14.3294 3.30667"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3L9 15L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Real-time Updates</h4>
              <p>See your progress as it happens with live tracking</p>
            </div>

            <div className="preview-feature">
              <div className="preview-feature-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 12H17.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.5 12H11.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 12H5.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 6H17.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.5 6H11.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 6H5.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 18H17.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.5 18H11.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 18H5.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Customizable Layout</h4>
              <p>Arrange your workspace to match your workflow</p>
            </div>

            <div className="preview-feature">
              <div className="preview-feature-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 8H8V16H16V8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3H3V21H21V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Cross-platform</h4>
              <p>Work seamlessly across desktop and mobile devices</p>
            </div>
          </div>
        </div>

        <div className="preview-display">
          <div className="preview-screen">
            <div className="preview-ui">
              <div className="preview-ui-header"></div>
              <div className="preview-ui-sidebar"></div>
              <div className="preview-ui-content">
                <div className="preview-ui-widget widget-1"></div>
                <div className="preview-ui-widget widget-2"></div>
                <div className="preview-ui-widget widget-3"></div>
                <div className="preview-ui-widget widget-4"></div>
              </div>
            </div>

            {/* 3D Effect Elements */}
            <div className="preview-reflections"></div>
            <div className="preview-shadows"></div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section
        id="workflow"
        ref={(ref) => registerSectionRef("workflow", ref)}
        className="workflow-section"
      >
        <div className="section-header">
          <h2 className="section-title">Your Editing Journey</h2>
          <p className="section-subtitle">
            A streamlined process that saves time and maximizes profitability
          </p>
        </div>

        <div className="workflow-timeline">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              id={`workflow-${step.id}`}
              className={`workflow-step animate-on-scroll ${
                animatedElements[`workflow-${step.id}`] ? "animated" : ""
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="workflow-step-icon">{step.icon}</div>
              <div className="workflow-connector"></div>
              <div className="workflow-step-content">
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        ref={(ref) => registerSectionRef("testimonials", ref)}
        className="testimonials-section"
      >
        <div className="section-header">
          <h2 className="section-title">What Editors Say</h2>
          <p className="section-subtitle">
            Stories from video professionals who've transformed their workflow
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              id={`testimonial-${testimonial.id}`}
              className={`testimonial-card animate-on-scroll ${
                animatedElements[`testimonial-${testimonial.id}`]
                  ? "animated"
                  : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="testimonial-content">
                <div className="quote-mark">"</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section (Replaced Download Section) */}
      <section
        id="signup"
        ref={(ref) => registerSectionRef("signup", ref)}
        className="cta-section"
      >
        <div className="cta-content">
          <h2 className="cta-title">Get Started with ARK Studio</h2>
          <p className="cta-text">
            Create your free account today and elevate your video editing
            workflow. No credit card required.
          </p>
          <div
            className="cta-actions"
            style={{ maxWidth: "500px", margin: "0 auto 3rem" }}
          >
            <a href="/signup" className="btn btn-primary btn-large btn-full">
              Create Free Account
            </a>
            <a href="/login" className="btn btn-secondary">
              Already have an account? Log In
            </a>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="logo">
            <span className="logo-text">ARK</span>
            <span className="logo-text-sub">STUDIO</span>
          </div>
          <p className="footer-tagline">
            Developed with ❤️ by one developer for video editors everywhere
          </p>
          <div className="copyright">
            © 2025 ARK Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
