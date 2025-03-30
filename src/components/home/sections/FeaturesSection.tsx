import React from "react";
import SectionHeader from "./SectionHeader";
import FeatureCard from "../cards/FeatureCard";
import { features } from "../../../data/home/features";

interface FeaturesSectionProps {
  registerSectionRef: (id: string, ref: HTMLElement | null) => void;
  animatedElements: Record<string, boolean>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  registerSectionRef,
  animatedElements,
}) => {
  return (
    <section
      id="features"
      ref={(ref) => registerSectionRef("features", ref)}
      className="features-section"
    >
      <SectionHeader
        title="Powerful Tools for Video Professionals"
        subtitle="Streamline your workflow with our integrated suite of tools designed for video editors"
      />

      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            animationDelay={index * 0.1}
            isAnimated={animatedElements[`feature-${feature.id}`]}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
