import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./InfoPage.css";

const Careers = () => {
  const { t } = useLanguage();
  const [emailHovered, setEmailHovered] = useState(false);

  const valueIcons = [
    "/assets/icons/purpose.svg",
    "/assets/icons/impact.svg",
    "/assets/icons/growth.svg",
  ];

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-overlay"></div>
        <div className="info-hero-content">
          <h1 className="info-hero-title">{t("careersTitle")}</h1>
          <div className="info-hero-divider"></div>
        </div>
      </div>

      <div className="info-content">
        <div className="info-icon">👔</div>

        <p className="info-main-text">{t("careersText")}</p>

        <p className="info-secondary-text">{t("careersNoOpenings")}</p>

        <a
          href={`mailto:careers@mensfashion.site?subject=${encodeURIComponent(t("careersEmailSubject"))}`}
          className="info-email-link"
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
          style={{
            transform: emailHovered ? "translateY(-2px)" : "translateY(0)",
            boxShadow: emailHovered ? "0 8px 25px rgba(0,0,0,0.15)" : "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          careers@mensfashion.site
        </a>

        <div className="info-values">
          <div className="info-value-card">
            <span className="info-value-icon">
              <img
                src={valueIcons[0]}
                alt="icon"
                className="minimalist-icon"
              />
            </span>
            <h3>{t("careersPurpose")}</h3>
          </div>
          <div className="info-value-card">
            <span className="info-value-icon">
              <img
                src={valueIcons[1]}
                alt="icon"
                className="minimalist-icon"
              />
            </span>
            <h3>{t("careersImpact")}</h3>
          </div>
          <div className="info-value-card">
            <span className="info-value-icon">
              <img
                src={valueIcons[2]}
                alt="icon"
                className="minimalist-icon"
              />
            </span>
            <h3>{t("careersGrowth")}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
