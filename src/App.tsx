import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as needed */}
        <Route
          path="/projects"
          element={<div>Projects Page (Coming Soon)</div>}
        />
        <Route
          path="/time-tracking"
          element={<div>Time Tracking Page (Coming Soon)</div>}
        />
        <Route path="/signup" element={<div>Signup Page (Coming Soon)</div>} />
        <Route path="/demo" element={<div>Demo Page (Coming Soon)</div>} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
