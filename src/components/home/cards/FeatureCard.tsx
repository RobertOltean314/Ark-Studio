import React from "react";
import { Feature } from "@/types/types";

interface FeatureCardProps {
  feature: Feature;
  animationDelay: number;
  isAnimated: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  animationDelay,
  isAnimated,
}) => {
  return (
    <div
      id={`feature-${feature.id}`}
      className={`feature-card animate-on-scroll ${
        isAnimated ? "animated" : ""
      }`}
      style={{ animationDelay: `${animationDelay}s` }}
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
  );
};

export default FeatureCard;
