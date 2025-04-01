import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

// Import Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import main SCSS file (which includes Bootstrap and custom styles)
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
