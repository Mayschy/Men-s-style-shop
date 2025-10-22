import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "var(--color-prim2)",
    color: "white",
    padding: "30px var(--space-lg) 20px",
    marginTop: "30px",
    borderTop: "5px solid var(--color-secondary)",
  };

  const containerStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "40px",
  };

  const columnTitleStyle = {
    fontSize: "1em",
    fontWeight: "700",
    marginBottom: "15px",
    color: "var(--color-secondary)",
    letterSpacing: "0.8px",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginBottom: "8px",
    display: "block",
    fontSize: "0.9em",
    transition: "color 0.2s ease",
    onMouseEnter: (e) => (e.target.style.color = "var(--color-secondary)"),
    onMouseLeave: (e) => (e.target.style.color = "white"),
  };

  const contactTextStyle = {
    marginBottom: "8px",
    fontSize: "0.95em",
    color: "#F0F0F0",
  };

  const sloganBoxStyle = {
    paddingRight: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  const sloganStyle = {
    fontSize: "1.4em",
    fontWeight: "900",
    color: "var(--color-secondary)",
    lineHeight: "1.1",
    letterSpacing: "1px",
    marginBottom: "5px",
  };

  const copyrightStyle = {
    marginTop: "30px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    fontSize: "0.8em",
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
            "DRESS SHARP. <br />
            LIVE BOLD."
          </p>
        </div>

        <div>
          <h4 style={columnTitleStyle}>COMPANY</h4>
          <Link
            to="/about"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            About Us
          </Link>
          <Link
            to="/careers"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            Careers (TODO)
          </Link>
        </div>

        <div>
          <h4 style={columnTitleStyle}>HELP</h4>
          <Link
            to="/faq"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            FAQ (TODO)
          </Link>
          <Link
            to="/shipping"
            style={linkStyle}
            onMouseEnter={linkStyle.onMouseEnter}
            onMouseLeave={linkStyle.onMouseLeave}
          >
            Shipping & Returns
          </Link>
        </div>

        <div>
          <h4 style={columnTitleStyle}>CONTACT US</h4>
          <p style={contactTextStyle}>Need assistance with your order?</p>
          <p style={contactTextStyle}>
            <strong style={{ color: "var(--color-secondary)" }}>
              CALL US:
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
            Email: info@mensstyle.com
          </p>
        </div>
      </div>

      <div style={copyrightStyle}>
        &copy; {new Date().getFullYear()} MEN'S STYLE. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
