import React from "react";
import { Testimonial } from "@/types/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  animationDelay: number;
  isAnimated: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  animationDelay,
  isAnimated,
}) => {
  return (
    <div
      id={`testimonial-${testimonial.id}`}
      className={`testimonial-card animate-on-scroll ${
        isAnimated ? "animated" : ""
      }`}
      style={{ animationDelay: `${animationDelay}s` }}
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
  );
};

export default TestimonialCard;
