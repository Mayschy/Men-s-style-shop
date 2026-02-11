import React, { useState } from "react";

const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const sectionStyle = {
    paddingBottom: "var(--space-lg)",
    color: "var(--color-text-dark)",
    fontFamily: "'Inter', sans-serif",
  };

  const heroSectionStyle = {
    position: "relative",
    height: "60vh",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "60px",
    backgroundImage: `url('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=2000')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(2px)",
    zIndex: 1,
  };

  const heroContentStyle = {
    position: "relative",
    zIndex: 2,
    color: "white",
    padding: "0 20px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    padding: "20px 0",
  };

  const getCardStyle = (index) => ({
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: hoveredCard === index 
      ? "0 20px 40px rgba(0,0,0,0.15)" 
      : "0 10px 30px rgba(0,0,0,0.05)",
    transform: hoveredCard === index ? "translateY(-10px)" : "translateY(0)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "default",
  });

  return (
    <div style={sectionStyle}>
      <div style={heroSectionStyle}>
        <div style={overlayStyle}></div>
        <div style={heroContentStyle}>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 6vw, 4rem)", 
            fontWeight: "900", 
            margin: 0,
            letterSpacing: "2px",
            textTransform: "uppercase"
          }}>
            Elevating <span style={{ color: "var(--color-secondary)" }}>Male</span> Essentials
          </h1>
          <p style={{ fontSize: "1.2em", maxWidth: "600px", margin: "20px auto 0", opacity: 0.9 }}>
            Where cutting-edge AI meets timeless sartorial elegance.
          </p>
        </div>
      </div>

      <div style={{
        padding: "60px",
        textAlign: "center",
        background: "linear-gradient(135deg, var(--color-navbar-bg) 0%, #f0f0f0 100%)",
        borderRadius: "20px",
        marginBottom: "60px"
      }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}>Our Philosophy</h2>
        <p style={{ maxWidth: "800px", margin: "0 auto", fontSize: "1.1rem", color: "#555", lineHeight: "1.8" }}>
          Founded at the intersection of classic tailoring and digital innovation, 
          we bridge the gap between traditional craftsmanship and the future of fashion. 
          Our mission is to simplify your style journey without compromising on character.
        </p>
      </div>
      <div style={gridStyle}>
        {[
          { 
            title: "Premium Curation", 
            text: "Sourcing the world's finest fabrics from Italy to Japan.",
            phase: "01" 
          },
          { 
            title: "AI Stylist", 
            text: "Personalized wardrobe algorithms tailored to your unique fit.",
            phase: "02" 
          },
          { 
            title: "Timeless Design", 
            text: "Engineered staples that outlast any fleeting fashion trend.",
            phase: "03" 
          }
        ].map((item, index) => (
          <div 
            key={index}
            style={getCardStyle(index)}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <span style={{ 
              color: "var(--color-primary)", 
              fontWeight: "900", 
              fontSize: "0.9rem",
              letterSpacing: "3px" 
            }}>PHASE {item.phase}</span>
            <h3 style={{ marginTop: "15px", fontSize: "1.5rem" }}>{item.title}</h3>
            <p style={{ color: "#666", marginTop: "10px" }}>{item.text}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "80px",
        padding: "80px 20px",
        textAlign: "center",
        position: "relative",
        background: "var(--color-prim2)",
        borderRadius: "20px",
        color: "white"
      }}>
        <div style={{
          fontSize: "2rem",
          fontStyle: "italic",
          maxWidth: "800px",
          margin: "0 auto",
          fontWeight: "300"
        }}>
          "Style is the only luxury that is really free."
        </div>
        <div style={{ 
          marginTop: "30px", 
          height: "2px", 
          width: "50px", 
          backgroundColor: "var(--color-secondary)", 
          margin: "30px auto" 
        }}></div>
        <p style={{ letterSpacing: "3px", fontSize: "0.9rem", fontWeight: "700" }}>
          THE MANIFESTO
        </p>
      </div>
    </div>
  );
};

export default AboutUs;