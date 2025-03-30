import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import main SCSS file (which includes Bootstrap and custom styles)
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
