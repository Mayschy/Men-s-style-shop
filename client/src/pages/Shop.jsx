import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filter === "all" || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const searchStyle = {
    width: "100%",
    maxWidth: "500px",
    padding: "10px 15px",
    margin: "0 auto 20px",
    display: "block",
    border: "2px solid var(--color-secondary)",
    borderRadius: "5px",
    fontSize: "1em",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  };

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

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
        onBlur={(e) => e.target.style.borderColor = "var(--color-secondary)"}
      />

      {/* Category Filter */}
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

      {/* Results Counter */}
      <div style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>

      {/* Products Grid */}
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
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p
          style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2em", color: "#999" }}
        >
          ❌ No products found {searchTerm ? `matching "${searchTerm}"` : "in this category"}.
        </p>
      )}
    </div>
  );
};

export default Shop;
