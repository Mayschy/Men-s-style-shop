import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./InfoPage.css";

const Shipping = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: "📦", title: "Place Order", desc: "Add items to your cart and checkout" },
    { icon: "⚙️", title: "Processing", desc: "2-3 business days to prepare" },
    { icon: "📮", title: "Shipped", desc: "Tracking number via email" },
    { icon: "🏠", title: "Delivered", desc: "3-7 days worldwide" },
  ];

  return (
    <div className="info-page">
      <div className="info-hero info-hero-shipping">
        <div className="info-hero-overlay"></div>
        <div className="info-hero-content">
          <h1 className="info-hero-title">Shipping & Delivery</h1>
          <div className="info-hero-divider"></div>
        </div>
      </div>

      <div className="info-content">
        <div className="info-icon">🚚</div>

        <div className="shipping-info-card">
          <div className="shipping-info-row">
            <span className="shipping-info-label">Worldwide Shipping</span>
            <span className="shipping-info-value">Available</span>
          </div>
          <div className="shipping-info-row">
            <span className="shipping-info-label">Processing Time</span>
            <span className="shipping-info-value">2-3 Business Days</span>
          </div>
          <div className="shipping-info-row">
            <span className="shipping-info-label">Free Shipping</span>
            <span className="shipping-info-value">Orders Over $150</span>
          </div>
        </div>

        <h2 className="info-section-title">How It Works</h2>

        <div className="shipping-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`shipping-step ${activeStep === index ? "active" : ""}`}
              onMouseEnter={() => setActiveStep(index)}
              onClick={() => setActiveStep(index === activeStep ? -1 : index)}
            >
              <div className="shipping-step-number">{index + 1}</div>
              <div className="shipping-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {index < steps.length - 1 && <div className="shipping-step-connector"></div>}
            </div>
          ))}
        </div>

        <div className="info-note">
          <span className="info-note-icon">💡</span>
          <p>Tracking information will be sent to your email once your order ships.</p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
