import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./InfoPage.css";

const Careers = () => {
  const { t } = useLanguage();
  const [emailHovered, setEmailHovered] = useState(false);

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-overlay"></div>
        <div className="info-hero-content">
          <h1 className="info-hero-title">Join the Team</h1>
          <div className="info-hero-divider"></div>
        </div>
      </div>

      <div className="info-content">
        <div className="info-icon">👔</div>

        <p className="info-main-text">
          We're always looking for passionate people to help us reimagine menswear.
        </p>

        <p className="info-secondary-text">
          We currently have no openings, but you can send your resume to:
        </p>

        <a
          href="mailto:careers@mensfashion.site"
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
            <span className="info-value-icon">🎯</span>
            <h3>Purpose</h3>
            <p>Making quality menswear accessible to every man</p>
          </div>
          <div className="info-value-card">
            <span className="info-value-icon">🚀</span>
            <h3>Impact</h3>
            <p>Building the future of fashion retail</p>
          </div>
          <div className="info-value-card">
            <span className="info-value-icon">🤝</span>
            <h3>Growth</h3>
            <p>Mentorship and career advancement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
