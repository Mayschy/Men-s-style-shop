// src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const cardColors = {
    background: "white",
    shadow: "0 4px 12px rgba(0,0,0,0.1)",
    hoverShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const cardStyle = {
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "center",
    boxShadow: cardColors.shadow,
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  };

  return (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = cardColors.hoverShadow;
          e.currentTarget.style.transform = "translateY(-8px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = cardColors.shadow;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <div
          style={{
            padding: "15px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px 0",
                fontSize: "1.3em",
                color: "var(--color-text-dark)",
              }}
            >
              {product.name}
            </h3>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "0.9em",
                color: "#666",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </p>
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "var(--color-primary)",
              }}
            >
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: product.isAvailable ? "#f0f0f0" : "#ffe0e0",
              borderRadius: "4px",
              fontSize: "0.85em",
              fontWeight: "bold",
              color: product.isAvailable ? "#333" : "#d32f2f",
            }}
          >
            {product.isAvailable ? "✓ In Stock" : "✗ Out of Stock"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
