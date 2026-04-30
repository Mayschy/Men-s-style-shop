import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./InfoPage.css";

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I track my order?",
      a: "You will receive a tracking link via email after your order has shipped. You can also check your order status in your profile page.",
      icon: "📍"
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 30 days of purchase. Items must be unworn with original tags attached. Start a return from your profile page.",
      icon: "↩️"
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 5-10 business days. Express shipping (2-3 days) is available at checkout for an additional fee.",
      icon: "📦"
    },
    {
      q: "Do you ship internationally?",
      a: "Yes! We offer worldwide shipping to over 100 countries. Shipping rates and times vary by location.",
      icon: "🌍"
    },
    {
      q: "How do I find my correct size?",
      a: "Check the size guide on each product page. Our AI style consultant can also help you find the perfect fit based on your measurements.",
      icon: "📏"
    },
    {
      q: "Can I change or cancel my order?",
      a: "Orders can be modified within 2 hours of placement. Contact support@mensfashion.site immediately for changes.",
      icon: "✏️"
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="info-page">
      <div className="info-hero info-hero-faq">
        <div className="info-hero-overlay"></div>
        <div className="info-hero-content">
          <h1 className="info-hero-title">Frequently Asked Questions</h1>
          <div className="info-hero-divider"></div>
          <p className="info-hero-subtitle">Find answers to common questions</p>
        </div>
      </div>

      <div className="info-content">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span className="faq-icon">{faq.icon}</span>
                <span className="faq-q-text">{faq.q}</span>
                <span className={`faq-toggle ${openIndex === index ? "rotated" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? "show" : ""}`}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-contact-card">
          <h3>Still have questions?</h3>
          <p>Our support team is here to help.</p>
          <a href="mailto:support@mensfashion.site" className="info-contact-btn">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
