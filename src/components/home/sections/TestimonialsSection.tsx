import React from "react";
import SectionHeader from "@/components/home/sections/SectionHeader";
import TestimonialCard from "../cards/TestimonialsCard";
import { testimonials } from "../../../data/home/testimonials";

interface TestimonialsSectionProps {
  registerSectionRef: (id: string, ref: HTMLElement | null) => void;
  animatedElements: Record<string, boolean>;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  registerSectionRef,
  animatedElements,
}) => {
  return (
    <section
      id="testimonials"
      ref={(ref) => registerSectionRef("testimonials", ref)}
      className="testimonials-section"
    >
      <SectionHeader
        title="What Editors Say"
        subtitle="Stories from video professionals who've transformed their workflow"
      />

      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            animationDelay={index * 0.1}
            isAnimated={animatedElements[`testimonial-${testimonial.id}`]}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
