import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../sport-meal-plan.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
