import { Folder, Users, Calculator, Clock, BarChart2 } from "lucide-react";

// Application navigation links
export const appLinks = [
  { path: "/app/projects", label: "Projects", icon: <Folder size={18} /> },
  { path: "/app/clients", label: "Clients", icon: <Users size={18} /> },
  {
    path: "/app/calculator",
    label: "Payment Calculator",
    icon: <Calculator size={18} />,
  },
  {
    path: "/app/time-tracking",
    label: "Time Tracking",
    icon: <Clock size={18} />,
  },
  {
    path: "/app/statistics",
    label: "Statistics",
    icon: <BarChart2 size={18} />,
  },
];
