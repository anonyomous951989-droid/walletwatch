import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// ─── Suppress the benign "ResizeObserver loop" error ────────────────────────
// Ant Design's Table, Select, Dropdown, and Chart components use ResizeObserver
// internally. In React's development mode the error overlay treats any
// unhandled window error as fatal — even this informational browser notice.
// Filtering it here keeps the dev console clean without hiding real errors.
const _origOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (
    typeof message === "string" &&
    message.includes("ResizeObserver loop")
  ) {
    return true; // suppress — don't bubble to React overlay
  }
  if (_origOnError) return _origOnError(message, source, lineno, colno, error);
  return false;
};

// Also suppress the ResizeObserver error event variant
window.addEventListener("error", (e) => {
  if (e.message && e.message.includes("ResizeObserver loop")) {
    e.stopImmediatePropagation();
  }
});
// ────────────────────────────────────────────────────────────────────────────

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


