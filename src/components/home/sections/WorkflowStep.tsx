import React from "react";
import { WorkflowStep as WorkflowStepType } from "@/types/types";

interface WorkflowStepProps {
  step: WorkflowStepType;
  animationDelay: number;
  isAnimated: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  step,
  animationDelay,
  isAnimated,
}) => {
  return (
    <div
      id={`workflow-${step.id}`}
      className={`workflow-step animate-on-scroll ${
        isAnimated ? "animated" : ""
      }`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="workflow-step-icon">{step.icon}</div>
      <div className="workflow-connector"></div>
      <div className="workflow-step-content">
        <h3 className="workflow-step-title">{step.title}</h3>
        <p className="workflow-step-description">{step.description}</p>
      </div>
    </div>
  );
};

export default WorkflowStep;
