import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx"; // ✅ Added
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap App with AuthProvider */}
      <SearchProvider> {/* ✅ Wrap App with SearchProvider */}
        <App />
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);
