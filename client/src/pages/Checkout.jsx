// src/pages/Checkout.jsx

import React, { useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../App";
import "./Checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(1);

  const { cart, processCheckout, user } = useAuth();
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const shippingInfoComplete = user?.shippingAddress?.city;

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty. Cannot place an order.", 'error');
      navigate("/");
      return;
    }

    const result = await processCheckout();

    if (result.success) {
      showToast("Order Placed Successfully! Your cart has been cleared.", 'success');
      navigate("/shop");
    } else {
      showToast(`Payment failed: ${result.error}`, 'error');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="checkout-section">
            <h2 className="section-title">📍 Shipping Information</h2>
            <div className="shipping-info">
              <div className="shipping-info-label">
                <span className="shipping-info-icon">✓</span>
                Delivery Address
              </div>
              <div className="shipping-info-value">
                {user?.firstName} {user?.lastName}
                <br />
                {user?.shippingAddress?.street || "Not specified"}
                <br />
                {user?.shippingAddress?.city || "City"}, {user?.shippingAddress?.zip || "ZIP"}
              </div>
            </div>
            <p style={{ color: "var(--color-text-light)", marginBottom: "20px" }}>
              We'll deliver this order to your saved address. You can update your address in your profile.
            </p>
            <div className="button-group">
              <button
                onClick={() => {
                  if (!shippingInfoComplete) {
                    showToast("Please update your shipping address in your profile first.", 'warning');
                  } else {
                    setStep(2);
                  }
                }}
                className="btn-checkout-next"
                disabled={!shippingInfoComplete}
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-section">
            <h2 className="section-title">💳 Payment Method</h2>
            <div className="payment-method">
              <div className="payment-icon">💳</div>
              <div className="payment-info">
                <h4>Secure Payment (Simulated)</h4>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>
            <p style={{ color: "var(--color-text-light)", marginBottom: "20px" }}>
              We accept all major credit cards. Your payment is processed securely through our payment gateway.
            </p>
            <div className="button-group">
              <button
                onClick={() => setStep(3)}
                className="btn-checkout-next"
              >
                Review Order →
              </button>
              <button
                onClick={() => setStep(1)}
                className="btn-checkout-back"
              >
                ← Back
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-section">
            <h2 className="section-title">✅ Review & Place Order</h2>

            <div className="order-review">
              <div className="review-item">
                <span className="review-item-label">Order Items</span>
                <span className="review-item-value">{cart.length} item(s)</span>
              </div>
              <div className="review-item">
                <span className="review-item-label">Subtotal</span>
                <span className="review-item-value">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="review-item">
                <span className="review-item-label">Shipping</span>
                <span className="review-item-value" style={{ color: "#4caf50" }}>
                  FREE
                </span>
              </div>
              <div className="review-item">
                <span className="review-item-label">Delivery to</span>
                <span className="review-item-value" style={{ fontSize: "0.9em" }}>
                  {user?.shippingAddress?.city}
                </span>
              </div>
            </div>

            <p style={{ color: "var(--color-text-light)", marginBottom: "20px", fontSize: "0.9em" }}>
              ✓ All items are in stock<br />
              ✓ Free shipping included<br />
              ✓ Secure payment processing
            </p>

            <div className="button-group">
              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className="btn-place-order"
              >
                🎉 PLACE ORDER NOW
              </button>
              <button
                onClick={() => setStep(2)}
                className="btn-checkout-back"
              >
                ← Back
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user || cart === null) {
    return (
      <div className="checkout-container">
        <div className="checkout-unauthorized">
          <p>Loading or not authorized...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <div className="empty-checkout-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart before proceeding to checkout.</p>
          <button
            onClick={() => navigate("/shop")}
            className="btn-return-shop"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>🛍️ Complete Your Order</h1>
        <p>Secure checkout in 3 simple steps</p>
      </div>

      <div className="steps-container">
        <div className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
          <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
          <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
          <div className="step-label">Payment</div>
        </div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <div className="step-circle">3</div>
          <div className="step-label">Review</div>
        </div>
      </div>

      <div className="checkout-content">
        {renderStepContent()}

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div key={item.productId._id} className="summary-item">
              <div className="summary-item-name">
                {item.productId.name}
                <br />
                <span style={{ fontSize: "0.85em", color: "var(--color-text-light)" }}>
                  x{item.quantity}
                </span>
              </div>
              <div className="summary-item-price">
                ${(item.productId.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="summary-divider"></div>

          <div className="summary-item">
            <span className="summary-item-label">Subtotal</span>
            <span className="summary-item-price">${totalAmount.toFixed(2)}</span>
          </div>

          <div className="summary-item">
            <span className="summary-item-label">Shipping</span>
            <span style={{ color: "#4caf50", fontWeight: "700" }}>FREE</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span className="summary-total-label">Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
