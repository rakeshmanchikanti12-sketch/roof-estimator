import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminLeads from "./pages/AdminLeads.jsx";
import AdminConfig from "./pages/AdminConfig.jsx";

import "./App.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/leads"
          element={<AdminLeads />}
        />

        <Route
          path="/admin/config"
          element={<AdminConfig />}
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);