// src/pages/Checkout.jsx

import React, { useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../App";
import "./Checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(1);

  const { cart, processCheckout, user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const shippingInfoComplete = user?.shippingAddress?.city;

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast(t("emptyCart"), 'error');
      navigate("/");
      return;
    }

    const result = await processCheckout();

    if (result.success) {
      showToast(t("orderConfirmed"), 'success');
      navigate("/shop");
    } else {
      showToast(`${t("paymentFailed")}: ${result.error}`, 'error');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="checkout-section">
            <h2 className="section-title">📍 {t("deliveryAddress")}</h2>
            <div className="shipping-info">
              <div className="shipping-info-label">
                <span className="shipping-info-icon">✓</span>
                {t("deliveryAddress")}
              </div>
              <div className="shipping-info-value">
                {user?.firstName} {user?.lastName}
                <br />
                {user?.shippingAddress?.street || t("notSpecified")}
                <br />
                {user?.shippingAddress?.city || t("city")}, {user?.shippingAddress?.zip || t("zip")}
              </div>
            </div>
            <p style={{ color: "var(--color-text-light)", marginBottom: "20px" }}>
              {t("wewillDeliver")}
            </p>
            <div className="button-group">
              <button
                onClick={() => {
                  if (!shippingInfoComplete) {
                    showToast(t("updateAddressAlert"), 'warning');
                  } else {
                    setStep(2);
                  }
                }}
                className="btn-checkout-next"
                disabled={!shippingInfoComplete}
              >
                {t("continuePayment")} →
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-section">
            <h2 className="section-title">💳 {t("paymentMethod")}</h2>
            <div className="payment-method">
              <div className="payment-icon">💳</div>
              <div className="payment-info">
                <h4>{t("securePayment")}</h4>
                <p>{t("paymentSecure")}</p>
              </div>
            </div>
            <p style={{ color: "var(--color-text-light)", marginBottom: "20px" }}>
              {t("acceptMajorCards")}
            </p>
            <div className="button-group">
              <button
                onClick={() => setStep(3)}
                className="btn-checkout-next"
              >
                {t("reviewOrder")} →
              </button>
              <button
                onClick={() => setStep(1)}
                className="btn-checkout-back"
              >
                ← {t("back")}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-section">
            <h2 className="section-title">✅ {t("reviewOrder")}</h2>

            <div className="order-review">
              <div className="review-item">
                <span className="review-item-label">{t("orderSummary")}</span>
                <span className="review-item-value">{cart.length} {t("item")}</span>
              </div>
              <div className="review-item">
                <span className="review-item-label">{t("subtotal")}</span>
                <span className="review-item-value">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="review-item">
                <span className="review-item-label">{t("shipping")}</span>
                <span className="review-item-value" style={{ color: "#4caf50" }}>
                  {t("free")}
                </span>
              </div>
              <div className="review-item">
                <span className="review-item-label">{t("deliveryTo")}</span>
                <span className="review-item-value" style={{ fontSize: "0.9em" }}>
                  {user?.shippingAddress?.city}
                </span>
              </div>
            </div>

            <p style={{ color: "var(--color-text-light)", marginBottom: "20px", fontSize: "0.9em" }}>
              ✓ {t("itemsInStock")}<br />
              ✓ {t("freeShippingIncluded")}<br />
              ✓ {t("securePaymentProcessing")}
            </p>

            <div className="button-group">
              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className="btn-place-order"
              >
                🎉 {t("placeOrder")}
              </button>
              <button
                onClick={() => setStep(2)}
                className="btn-checkout-back"
              >
                ← {t("back")}
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
          <p>{t("loadingOrUnauthorized")}</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <div className="empty-checkout-icon">🛒</div>
          <h2>{t("cartEmpty")}</h2>
          <p>{t("addItemsBeforeCheckout")}</p>
          <button
            onClick={() => navigate("/shop")}
            className="btn-return-shop"
          >
            {t("continueShopping")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>🛍️ {t("completeOrder")}</h1>
        <p>{t("secureCheckoutSteps")}</p>
      </div>

      <div className="steps-container">
        <div className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
          <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
          <div className="step-label">{t("shipping")}</div>
        </div>
        <div className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
          <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
          <div className="step-label">{t("paymentMethod")}</div>
        </div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <div className="step-circle">3</div>
          <div className="step-label">{t("review")}</div>
        </div>
      </div>

      <div className="checkout-content">
        {renderStepContent()}

        <div className="checkout-summary">
          <h2>{t("orderSummary")}</h2>

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
            <span className="summary-item-label">{t("subtotal")}</span>
            <span className="summary-item-price">${totalAmount.toFixed(2)}</span>
          </div>

          <div className="summary-item">
            <span className="summary-item-label">{t("shipping")}</span>
            <span style={{ color: "#4caf50", fontWeight: "700" }}>{t("free")}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span className="summary-total-label">{t("total")}</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
