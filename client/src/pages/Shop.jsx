import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const { addToCart } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://men-style-shop.onrender.com/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products from server");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          err.message || "Something went wrong while fetching products."
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, productName) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert(`✅ ${productName}`);
    } else {
      alert(`❌ ${result.error}`);
    }
  };

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const filterButtonStyle = (currentFilter) => ({
    padding: "8px 15px",
    margin: "0 5px",
    border: "1px solid var(--color-primary)",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor:
      filter === currentFilter ? "var(--color-primary)" : "white",
    color: filter === currentFilter ? "white" : "var(--color-primary)",
    transition: "all 0.3s ease",
    fontWeight: "500",
  });

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "1.5em" }}>
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.2em",
          color: "red",
        }}
      >
        Error: {error}
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "var(--color-text-dark)",
        }}
      >
        Product Catalog
      </h1>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button
          style={filterButtonStyle("all")}
          onClick={() => setFilter("all")}
        >
          All Products
        </button>
        {["t-shirts", "jackets", "jeans", "accessories"].map((cat) => (
          <button
            key={cat}
            style={filterButtonStyle(cat)}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={() => handleAddToCart(product._id, product.name)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p
          style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2em" }}
        >
          No products found for this category.
        </p>
      )}
    </div>
  );
};

export default Shop;
