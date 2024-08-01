import React from "react";
import ReactDOM from "react-dom/client";
import "./config/firebase-config.js"; // maybe i will remove it
import App from "./App.jsx";
import "./index.css";
import { NotificationProvider } from "./context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </NotificationProvider>
);
