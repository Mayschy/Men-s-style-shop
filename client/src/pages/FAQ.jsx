import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./InfoPage.css";

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqKeys = [
    { q: "faqTrackOrder", a: "faqTrackOrderAnswer", icon: "📍" },
    { q: "faqReturnPolicy", a: "faqReturnPolicyAnswer", icon: "↩️" },
    { q: "faqShippingTime", a: "faqShippingTimeAnswer", icon: "📦" },
    { q: "faqInternational", a: "faqInternationalAnswer", icon: "🌍" },
    { q: "faqSizeGuide", a: "faqSizeGuideAnswer", icon: "📏" },
    { q: "faqChangeOrder", a: "faqChangeOrderAnswer", icon: "✏️" },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="info-page">
      <div className="info-hero info-hero-faq">
        <div className="info-hero-overlay"></div>
        <div className="info-hero-content">
          <h1 className="info-hero-title">{t("faqTitle")}</h1>
          <div className="info-hero-divider"></div>
          <p className="info-hero-subtitle">{t("faqSubtitle")}</p>
        </div>
      </div>

      <div className="info-content">
        <div className="faq-list">
          {faqKeys.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span className="faq-icon">{faq.icon}</span>
                <span className="faq-q-text">{t(faq.q)}</span>
                <span className={`faq-toggle ${openIndex === index ? "rotated" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? "show" : ""}`}>
                <p>{t(faq.a)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-contact-card">
          <h3>{t("faqStillQuestions")}</h3>
          <p>{t("faqSupportTeam")}</p>
          <a href="mailto:support@mensfashion.site" className="info-contact-btn">
            {t("faqContactSupport")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
