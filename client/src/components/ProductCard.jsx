// src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ProductCard = React.memo(({ product }) => {
  const { t } = useLanguage();

  const totalStock = product.totalStock ?? (product.stock || 0);
  const isOutOfStock = totalStock === 0 || totalStock < 0;

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    cursor: isOutOfStock ? "not-allowed" : "pointer",
    opacity: isOutOfStock ? 0.5 : 1,
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };

  const content = (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        if (!isOutOfStock) {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", background: "#f8f8f8" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "280px",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) => {
            if (!isOutOfStock) {
              e.currentTarget.style.transform = "scale(1.04)";
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
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "white",
              letterSpacing: "0.05em",
            }}
          >
            OUT OF STOCK
          </div>
        )}
      </div>

      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "var(--color-text-dark)",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#888",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--color-text-dark)",
              letterSpacing: "-0.02em",
            }}
          >
            ${product.price.toFixed(2)}
          </span>

          {isOutOfStock ? (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#999",
                fontWeight: 500,
              }}
            >
              Out of stock
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.75rem",
                color: "#2E7D32",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                }}
              />
              In stock
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {content}
    </Link>
  );
}, (prev, next) => prev.product._id === next.product._id);

export default ProductCard;
