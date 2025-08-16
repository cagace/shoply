import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RouteProgress from "./components/RouteProgress.jsx";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <RouteProgress />
          <Suspense fallback={<div className="h-1 w-full bg-gray-200 animate-pulse" />}>
            <App />
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
