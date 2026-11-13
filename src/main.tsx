import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-600.css";
import "@fontsource/geist/latin-ext-400.css";
import "@fontsource/geist/latin-ext-500.css";
import "@fontsource/geist/latin-ext-600.css";
import App from "./App";
import "./styles.css";
import "./presentation.css";
import "./software-preview.css";

const root = document.getElementById("root")!;
// Settle an initial section URL before effects decide which media is visible.
// CSS smooth scrolling otherwise briefly exposes the hero en route to #team.
if (root.hasChildNodes() && window.location.hash) {
  try {
    document
      .getElementById(decodeURIComponent(window.location.hash.slice(1)))
      ?.scrollIntoView({ behavior: "instant" });
  } catch {
    // A malformed URL fragment must not prevent hydration.
  }
}
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
