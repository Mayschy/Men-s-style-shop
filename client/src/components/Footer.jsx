import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const footerStyle = {
    backgroundColor: "var(--color-prim2)",
    color: "white",
    padding: isMobile ? "20px 15px 15px" : "30px var(--space-lg) 20px",
    marginTop: "30px",
    borderTop: "5px solid var(--color-secondary)",
  };

  const containerStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
    gap: isMobile ? "20px" : "40px",
  };

  const columnTitleStyle = {
    fontSize: isMobile ? "0.9em" : "1em",
    fontWeight: "700",
    marginBottom: "12px",
    color: "var(--color-secondary)",
    letterSpacing: "0.8px",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginBottom: "6px",
    display: "block",
    fontSize: isMobile ? "0.8em" : "0.9em",
    transition: "color 0.2s ease",
    onMouseEnter: (e) => (e.target.style.color = "var(--color-secondary)"),
    onMouseLeave: (e) => (e.target.style.color = "white"),
  };

  const contactTextStyle = {
    marginBottom: "6px",
    fontSize: isMobile ? "0.85em" : "0.95em",
    color: "#F0F0F0",
  };

  const sloganBoxStyle = {
    paddingRight: isMobile ? "0" : "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  const sloganStyle = {
    fontSize: isMobile ? "1em" : "1.4em",
    fontWeight: "900",
    color: "var(--color-secondary)",
    lineHeight: "1.1",
    letterSpacing: "1px",
    marginBottom: isMobile ? "8px" : "5px",
  };

  const copyrightStyle = {
    marginTop: isMobile ? "15px" : "30px",
    paddingTop: isMobile ? "10px" : "15px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    fontSize: isMobile ? "0.7em" : "0.8em",
    color: "rgba(255, 255, 255, 0.7)",
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sloganBoxStyle}>
          <p
            style={{
              ...sloganStyle,
              color: "white",
              fontSize: "1.8em",
              fontWeight: 900,
            }}
          >
            MEN'S STYLE
          </p>
          <p style={sloganStyle}>
            "{t("slogan")}"
          </p>
        </div>

        <div>
          <h4 style={columnTitleStyle}>{t("company")}</h4>
          <Link
            to="/about"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            {t("aboutUs")}
          </Link>
          <Link
            to="/careers"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            {t("careers")}
          </Link>
        </div>

        <div>
          <h4 style={columnTitleStyle}>{t("help")}</h4>
          <Link
            to="/faq"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            {t("faq")}
          </Link>
          <Link
            to="/shipping"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            {t("shippingReturns")}
          </Link>
        </div>

        <div>
          <h4 style={columnTitleStyle}>{t("contactUs")}</h4>
          <p style={contactTextStyle}>{t("needAssistance")}</p>
          <p style={contactTextStyle}>
            <strong style={{ color: "var(--color-secondary)" }}>
              {t("callUs")}
            </strong>
          </p>
          <a
            href="tel:+1234567890"
            style={{ ...linkStyle, fontSize: "1.4em", fontWeight: "bold" }}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            +1 (234) 567-890
          </a>
          <p style={{ ...contactTextStyle, marginTop: "15px" }}>
            {t("email")}: info@mensstyle.com
          </p>
        </div>
      </div>

      <div style={copyrightStyle}>
        &copy; {new Date().getFullYear()} MEN'S STYLE. {t("copyright")}
      </div>
    </footer>
  );
};

export default Footer;
