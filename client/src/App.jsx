import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { ChatWidget } from "./components/ChatWidget";
import { ToastContainer, useToast } from "./components/Toast";
import { LanguageProvider } from "./context/LanguageContext";

import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import About from "./pages/AboutUs";
import AdminProductManager from "./pages/AdminProductManager";
import ProductDetail from "./pages/ProductDetail";

// Create a context for toast
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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />{" "}
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
              </Routes>
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
