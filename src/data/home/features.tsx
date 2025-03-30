import { Feature } from "@/types/types";

export const features: Feature[] = [
  {
    id: "project-tracking",
    title: "Project Tracking",
    description:
      "Keep all your video projects organized with detailed status tracking and milestone management.",
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 14H14V21H21V14Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 14H3V21H10V14Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 3H14V10H21V3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 3H3V10H10V3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    benefits: [
      "Organize your projects with custom templates",
      "Track project status in real-time",
      "Set and monitor milestones",
      "Share progress with clients",
    ],
  },
  {
    id: "time-tracker",
    title: "Time Tracker",
    description:
      "Automatically track your editing hours with precision down to the second, fully integrated with popular editing software.",
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 6V12L16 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    benefits: [
      "Track time automatically while editing",
      "Integration with Premiere Pro & DaVinci Resolve",
      "Generate detailed time reports",
      "Analyze your work patterns",
    ],
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description:
      "Visualize your productivity and earnings with customizable charts and reports that help optimize your workflow.",
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 20V10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 20V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 20V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    benefits: [
      "Track project profitability",
      "Monitor hourly rates over time",
      "View long-term productivity trends",
      "Identify your most valuable clients",
    ],
  },
  {
    id: "financial",
    title: "Financial Tools",
    description:
      "Calculate earnings based on project rates, hourly fees, and generate professional invoices with ease.",
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1V23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    benefits: [
      "Generate professional invoices",
      "Track payments automatically",
      "Support for multiple currencies",
      "Tax calculation and reporting",
    ],
  },
];
