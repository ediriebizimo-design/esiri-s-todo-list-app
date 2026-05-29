// ============================================================
// FILE: client/src/index.js
// PURPOSE: This is the ENTRY POINT of the React app.
// It is the very first file that runs when the app starts.
// It connects your React code to the actual HTML page.
// ============================================================

// Line 1: Import React itself — required in every React file
import React from "react";

// Line 2: Import ReactDOM — this is what puts React content
// onto the actual webpage (into the browser's DOM)
import ReactDOM from "react-dom/client";

// Line 3: Import your main App component (the todo list)
import App from "./App";

// Line 4: Import the global CSS file that comes with
// create-react-app — you can leave this or customize it
import "./index.css";

// Lines 6-8: Find the <div id="root"> in public/index.html
// and mount (attach) your entire React App inside it.
// Everything your user sees is rendered inside that one div.
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* StrictMode is a development tool — it highlights
        potential problems in your app during development.
        It does NOT affect the production build. */}
    <App />
  </React.StrictMode>
);
