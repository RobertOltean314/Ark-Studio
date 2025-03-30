import { ReactNode } from "react";

export interface Position {
  x: number;
  y: number;
}

export interface NavLink {
  id: string;
  label: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  benefits: string[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}
