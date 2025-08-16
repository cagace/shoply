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
<<<<<<< HEAD
    <HashRouter>
=======
    <BrowserRouter basename={import.meta.env.BASE_URL}>
>>>>>>> e355770 (first commit)
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
