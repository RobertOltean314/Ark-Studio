import React from "react";
import Button from "../../ui/Button";

interface CtaSectionProps {
  registerSectionRef: (id: string, ref: HTMLElement | null) => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ registerSectionRef }) => {
  return (
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
          <Button
            href="/signup"
            variant="primary"
            size="large"
            fullWidth={true}
          >
            Create Free Account
          </Button>
          <Button href="/login" variant="secondary">
            Already have an account? Log In
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
