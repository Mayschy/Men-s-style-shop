import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./InfoPage.css";

const Shipping = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const stepKeys = [
    { titleKey: "shippingPlaceOrder", descKey: "shippingPlaceOrderDesc" },
    { titleKey: "shippingProcessing", descKey: "shippingProcessingDesc" },
    { titleKey: "shippingShipped", descKey: "shippingShippedDesc" },
    { titleKey: "shippingDelivered", descKey: "shippingDeliveredDesc" },
  ];

  const stepIcons = ["📦", "⚙️", "📮", "🏠"];

  return (
    <div className="info-page">
      <div className="info-hero info-hero-shipping">
        <div className="info-hero-overlay"></div>
        <div className="info-hero-content">
          <h1 className="info-hero-title">{t("shippingTitle")}</h1>
          <div className="info-hero-divider"></div>
        </div>
      </div>

      <div className="info-content">
        <div className="info-icon">🚚</div>

        <div className="shipping-info-card">
          <div className="shipping-info-row">
            <span className="shipping-info-label">{t("shippingWorldwide")}</span>
            <span className="shipping-info-value">{t("shippingAvailable")}</span>
          </div>
          <div className="shipping-info-row">
            <span className="shipping-info-label">{t("shippingProcessingTime")}</span>
            <span className="shipping-info-value">{t("shippingBusinessDays")}</span>
          </div>
          <div className="shipping-info-row">
            <span className="shipping-info-label">{t("shippingFreeThreshold")}</span>
            <span className="shipping-info-value">{t("shippingOrdersOver")}</span>
          </div>
        </div>

        <h2 className="info-section-title">{t("shippingHowItWorks")}</h2>

        <div className="shipping-steps">
          {stepKeys.map((step, index) => (
            <div
              key={index}
              className={`shipping-step ${activeStep === index ? "active" : ""}`}
              onMouseEnter={() => setActiveStep(index)}
              onClick={() => setActiveStep(index === activeStep ? -1 : index)}
            >
              <div className="shipping-step-number">{index + 1}</div>
              <div className="shipping-step-icon">{stepIcons[index]}</div>
              <h3>{t(step.titleKey)}</h3>
              <p>{t(step.descKey)}</p>
            </div>
          ))}
        </div>

        <div className="info-note">
          <span className="info-note-icon">💡</span>
          <p>{t("shippingTrackingTip")}</p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
