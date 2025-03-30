import React from "react";
import SectionHeader from "@/components/home/sections/SectionHeader";

const PreviewSection: React.FC = () => {
  const previewFeatures = [
    {
      id: "realtime",
      title: "Real-time Updates",
      description: "See your progress as it happens with live tracking",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12C21 13.8805 20.411 15.7137 19.3156 17.2423C18.2203 18.7709 16.6736 19.9179 14.893 20.5224C13.1123 21.1268 11.187 21.1583 9.38744 20.6125C7.58792 20.0666 6.00459 18.9707 4.85982 17.4789C3.71505 15.987 3.06635 14.174 3.00482 12.2945C2.94329 10.415 3.47203 8.56344 4.51677 6.99987C5.56152 5.4363 7.06979 4.23925 8.82975 3.57685C10.5897 2.91444 12.513 2.81996 14.3294 3.30667"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3L9 15L6 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "customizable",
      title: "Customizable Layout",
      description: "Arrange your workspace to match your workflow",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 12H17.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 12H11.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 12H5.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 6H17.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 6H11.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 6H5.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 18H17.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 18H11.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 18H5.51"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "crossplatform",
      title: "Cross-platform",
      description: "Work seamlessly across desktop and mobile devices",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 8H8V16H16V8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3H3V21H21V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="preview" className="preview-section">
      <div className="preview-content">
        <SectionHeader
          title="Intuitive Interface"
          subtitle="A powerful dashboard that brings all your editing metrics together"
        />

        <div className="preview-features">
          {previewFeatures.map((feature) => (
            <div key={feature.id} className="preview-feature">
              <div className="preview-feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="preview-display">
        <div className="preview-screen">
          <div className="preview-ui">
            <div className="preview-ui-header"></div>
            <div className="preview-ui-sidebar"></div>
            <div className="preview-ui-content">
              <div className="preview-ui-widget widget-1"></div>
              <div className="preview-ui-widget widget-2"></div>
              <div className="preview-ui-widget widget-3"></div>
              <div className="preview-ui-widget widget-4"></div>
            </div>
          </div>

          {/* 3D Effect Elements */}
          <div className="preview-reflections"></div>
          <div className="preview-shadows"></div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
