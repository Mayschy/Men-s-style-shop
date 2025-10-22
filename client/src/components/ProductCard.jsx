// src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const cardColors = {
    background: "white",
    shadow: "0 4px 12px rgba(0,0,0,0.1)",
    hoverShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const buttonStyle = {
    padding: "10px 15px",
    backgroundColor: "var(--color-primary)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  };

  const cardStyle = {
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "center",
    boxShadow: cardColors.shadow,
    transition: "box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = cardColors.hoverShadow)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = cardColors.shadow)
      }
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
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
              fontSize: "1.2em",
              fontWeight: "bold",
              color: "var(--color-primary)",
            }}
          >
            ${product.price.toFixed(2)}
          </p>
        </div>

        <button style={buttonStyle} onClick={onAddToCart}>
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
