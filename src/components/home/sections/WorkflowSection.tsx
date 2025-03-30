import React from "react";
import SectionHeader from "@/components/home/sections/SectionHeader";
import WorkflowStep from "./WorkflowStep";
import { workflowSteps } from "../../../data/home/workflowSteps";

interface WorkflowSectionProps {
  registerSectionRef: (id: string, ref: HTMLElement | null) => void;
  animatedElements: Record<string, boolean>;
}

const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  registerSectionRef,
  animatedElements,
}) => {
  return (
    <section
      id="workflow"
      ref={(ref) => registerSectionRef("workflow", ref)}
      className="workflow-section"
    >
      <SectionHeader
        title="Your Editing Journey"
        subtitle="A streamlined process that saves time and maximizes profitability"
      />

      <div className="workflow-timeline">
        {workflowSteps.map((step, index) => (
          <WorkflowStep
            key={step.id}
            step={step}
            animationDelay={index * 0.15}
            isAnimated={animatedElements[`workflow-${step.id}`]}
          />
        ))}
      </div>
    </section>
  );
};

export default WorkflowSection;
