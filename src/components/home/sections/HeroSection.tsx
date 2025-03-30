import React from "react";
import StatCard from "../../ui/StatCard";
import Button from "../../ui/Button";

interface HeroSectionProps {
  registerSectionRef: (id: string, ref: HTMLElement | null) => void;
  parallax: { x: number; y: number };
}

const HeroSection: React.FC<HeroSectionProps> = ({
  registerSectionRef,
  parallax,
}) => {
  const heroStats = [
    {
      label: "Earnings",
      trend: { value: "+15%", type: "positive" },
      value: "$24,856",
      period: "This Month",
    },
    {
      label: "Projects",
      trend: { value: "+3", type: "positive" },
      value: "18",
      period: "Active",
    },
    {
      label: "Hours",
      trend: { value: "-8", type: "negative" },
      value: "164",
      period: "This Month",
    },
    {
      label: "Efficiency",
      trend: { value: "+2%", type: "positive" },
      value: "94%",
      period: "Edit Ratio",
    },
  ];

  return (
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
          <Button href="#signup" variant="primary">
            Create Account
          </Button>
          <Button href="#demo" variant="secondary">
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
          </Button>
        </div>

        <div className="hero-stats">
          {heroStats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              trend={stat.trend}
              value={stat.value}
              period={stat.period}
            />
          ))}
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
  );
};

export default HeroSection;
