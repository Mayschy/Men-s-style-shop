import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { ChatWidget } from "./components/ChatWidget";
import { ToastContainer, useToast } from "./components/Toast";
import { LanguageProvider } from "./context/LanguageContext";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/AboutUs"));
const AdminProductManager = lazy(() => import("./pages/AdminProductManager"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

export const ToastContext = React.createContext();

const App = () => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <LanguageProvider>
      <ToastContext.Provider value={{ showToast }}>
        <Router>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <AdminProductManager />
                      </AdminRoute>
                    }
                  />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <ChatWidget />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
          </div>
        </Router>
      </ToastContext.Provider>
    </LanguageProvider>
  );
};

export default App;
