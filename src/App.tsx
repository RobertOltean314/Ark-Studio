import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PresentationPage from "./pages/presentation/PresentationPage"; // Your public landing page
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";

// App pages (authenticated area)
import AppLayout from "./components/app/AppLayout";
import AppPage from "./pages/app/AppPage"; // Main dashboard after login
import ProfilePage from "./pages/app/ProfilePage";
// import ProjectsPage from "./pages/app/ProjectsPage";
// import ClientsPage from "./pages/app/ClientsPage";
// import CalculatorPage from "./pages/app/CalculatorPage";
// import TimeTrackingPage from "./pages/app/TimeTrackingPage";
// import StatisticsPage from "./pages/app/StatisticsPage";

import "./styles/App.css";

// Component to handle authenticated redirection
// If the user is logged in and tries to access the public home page,
// they'll be redirected to the app dashboard
const HomeRedirect: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is logged in, redirect to app dashboard
  if (currentUser) {
    return <Navigate to="/app" />;
  }

  // Otherwise, show the public presentation page
  return <PresentationPage />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* App routes (authenticated) */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* <Route path="projects" element={<ProjectsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="time-tracking" element={<TimeTrackingPage />} />
        <Route path="statistics" element={<StatisticsPage />} /> */}
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
