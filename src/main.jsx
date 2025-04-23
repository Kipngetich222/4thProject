// import { jsxDEV } from "@emotion/react/jsx-dev-runtime";
import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use 'react-dom/client'
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PWAProvider } from "./context/PWAContext";
import "./index.css";

// Create a root using React 18 API
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <PWAProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PWAProvider>
  </React.StrictMode>
);
