import React, { useState } from "react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useSectionTracker } from "@/hooks/useSectionTracker";
import "../styles/HomePage.css";

// Import section components
import Header from "@components/home/Header";
import HeroSection from "@components/home/sections/HeroSection";
import FeaturesSection from "@components/home/sections/FeaturesSection";
import PreviewSection from "@/components/home/sections/PreviewSection";
import WorkflowSection from "@components/home/sections/WorkflowSection";
import TestimonialsSection from "@components/home/sections/TestimonialsSection";
import CtaSection from "@components/home/sections/CtaSection";
import Footer from "@/components/home/sections/Footer";

// Import data
import { navLinks } from "@/data/home/navLinks";

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const parallax = useMouseParallax(50);

  // Use the custom section tracker hook
  const { activeSection, animatedElements, registerSectionRef } =
    useSectionTracker();

  return (
    <div className="homepage">
      <Header
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        navLinks={navLinks}
      />

      <HeroSection
        registerSectionRef={registerSectionRef}
        parallax={parallax}
      />

      <FeaturesSection
        registerSectionRef={registerSectionRef}
        animatedElements={animatedElements}
      />

      <PreviewSection />

      <WorkflowSection
        registerSectionRef={registerSectionRef}
        animatedElements={animatedElements}
      />

      <TestimonialsSection
        registerSectionRef={registerSectionRef}
        animatedElements={animatedElements}
      />

      <CtaSection registerSectionRef={registerSectionRef} />

      <Footer />
    </div>
  );
};

export default HomePage;
