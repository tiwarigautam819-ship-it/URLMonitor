import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

window.addEventListener("error", (event) => {
  document.body.innerHTML = `
    <div style="padding:24px;font-family:Arial;color:#d32f2f">
      <h2>URL Monitor Error</h2>
      <pre style="white-space:pre-wrap">${event.error?.stack || event.message}</pre>
    </div>
  `;
});

window.addEventListener("unhandledrejection", (event) => {
  document.body.innerHTML = `
    <div style="padding:24px;font-family:Arial;color:#d32f2f">
      <h2>URL Monitor Error</h2>
      <pre style="white-space:pre-wrap">${event.reason?.stack || event.reason}</pre>
    </div>
  `;
});

try {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  document.body.innerHTML = `
    <div style="padding:24px;font-family:Arial;color:#d32f2f">
      <h2>URL Monitor Error</h2>
      <pre style="white-space:pre-wrap">${error.stack || error}</pre>
    </div>
  `;
}
