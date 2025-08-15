import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import PageFade from "./components/PageFade.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const SignIn = lazy(() => import("./pages/SignIn.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="h-1 w-full bg-gray-200 animate-pulse" />}> 
          <Routes>
            <Route path="/" element={<PageFade><Home /></PageFade>} />
            <Route path="/products" element={<PageFade><Products /></PageFade>} />
            <Route path="/products/:id" element={<PageFade><ProductDetails /></PageFade>} />
            <Route path="/cart" element={<PageFade><Cart /></PageFade>} />
            <Route path="/checkout" element={<PageFade><Checkout /></PageFade>} />
            <Route path="/signin" element={<PageFade><SignIn /></PageFade>} />
            <Route path="/signup" element={<PageFade><SignUp /></PageFade>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}