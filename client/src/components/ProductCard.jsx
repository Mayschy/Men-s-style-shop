// src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const cardColors = {
    background: "white",
    shadow: "0 4px 12px rgba(0,0,0,0.1)",
    hoverShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const isOutOfStock = product.stock === 0 || product.stock < 0;

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
    cursor: isOutOfStock ? "not-allowed" : "pointer",
    opacity: isOutOfStock ? 0.6 : 1,
  };

  const content = (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        if (!isOutOfStock) {
          e.currentTarget.style.boxShadow = cardColors.hoverShadow;
          e.currentTarget.style.transform = "translateY(-8px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = cardColors.shadow;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!isOutOfStock) {
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5em",
              fontWeight: "bold",
              color: "white",
            }}
          >
            ❌ {t("outOfStock")}
          </div>
        )}
      </div>

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
            backgroundColor: product.stock > 0 ? "#E8F5E9" : "#FFEBEE",
            borderRadius: "4px",
            fontSize: "0.85em",
            fontWeight: "bold",
            color: product.stock > 0 ? "#2E7D32" : "#D32F2F",
            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
            opacity: product.stock > 0 ? 1 : 0.6,
          }}
        >
          {product.stock > 0 ? `✓ ${t("inStock")} (${product.stock})` : `✗ ${t("outOfStock")}`}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOutOfStock ? (
        <div style={{ textDecoration: "none", color: "inherit" }}>
          {content}
        </div>
      ) : (
        <Link
          to={`/product/${product._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {content}
        </Link>
      )}
    </>
  );
};

export default ProductCard;
