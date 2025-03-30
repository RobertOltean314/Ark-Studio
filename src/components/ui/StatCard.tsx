import React from "react";

interface StatCardProps {
  label: string;
  trend: {
    value: string;
    type: "positive" | "negative";
  };
  value: string;
  period: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, trend, value, period }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className={`stat-trend ${trend.type}`}>{trend.value}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-period">{period}</div>
    </div>
  );
};

export default StatCard;
