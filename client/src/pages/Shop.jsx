import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { API_ENDPOINTS } from "../config/api";
import { useApi } from "../hooks/useApi";
import "./Shop.css";

const Shop = () => {
  const { t } = useLanguage();
  const { get, loading, error: apiError } = useApi();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Get all unique style tags - memoized to avoid recalculation
  const allStyleTags = useMemo(() => 
    Array.from(new Set(products.flatMap(p => p.styleTags || []))),
    [products]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await get(API_ENDPOINTS.PRODUCTS_ALL);
      
      if (data) {
        setProducts(data);
        
        // Set initial price range based on products
        if (data.length > 0) {
          const prices = data.map(p => p.price);
          const maxPrice = Math.max(...prices);
          setPriceRange([0, Math.ceil(maxPrice)]);
        }
        setError(null);
      } else {
        setError(apiError || "Something went wrong while fetching products.");
        setProducts([]);
      }
    };
    fetchProducts();
  }, [get, apiError]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = filter === "all" || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesTags = selectedTags.length === 0 || 
                          selectedTags.some(tag => (p.styleTags || []).includes(tag));
      const matchesStock = !inStockOnly || p.isAvailable;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesTags && matchesStock;
    });
  }, [products, filter, searchTerm, priceRange, selectedTags, inStockOnly]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "1.5em" }}>
        {t("loadingProducts")}
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
        {t("errorFetching")}: {error}
      </p>
    );
  }

  return (
    <div className="shop-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1
        className="shop-title"
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "var(--color-text-dark)",
        }}
      >
        🛍️ {t("productCatalog")}
      </h1>

      {/* Search Bar */}
      <input
        className="shop-search"
        type="text"
        placeholder={`🔍 ${t("searchProducts")}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
        onBlur={(e) => e.target.style.borderColor = "var(--color-secondary)"}
      />

      {/* Filters Container */}
      <div className="shop-filters" style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "30px",
        border: "1px solid #e0e0e0"
      }}>
        
        {/* Category Filter */}
        <div className="shop-filter-section" style={{ marginBottom: "20px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#333" }}>📂 {t("categoryFilter")}</h4>
          <div className="shop-filter-buttons" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              className="shop-filter-button"
              style={filterButtonStyle("all")}
              onClick={() => setFilter("all")}
            >
              {t("allProducts")}
            </button>
            {["t-shirts", "jackets", "jeans", "accessories"].map((cat) => (
              <button
                className="shop-filter-button"
                key={cat}
                style={filterButtonStyle(cat)}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="shop-filter-section" style={{ marginBottom: "20px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#333" }}>💰 {t("priceRange")}</h4>
          <div className="shop-price-controls" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div>
              <label className="shop-price-label" style={{ fontSize: "0.9em", display: "block", marginBottom: "5px" }}>
                {t("min")}: ${priceRange[0]}
              </label>
              <input
                className="shop-price-range"
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = Math.min(Number(e.target.value), priceRange[1]);
                  setPriceRange([newMin, priceRange[1]]);
                }}
                style={{ width: "150px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.9em", display: "block", marginBottom: "5px" }}>
                {t("max")}: ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Math.max(Number(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], newMax]);
                }}
                style={{ width: "150px" }}
              />
            </div>
          </div>
        </div>

        {/* Style Tags Filter */}
        {allStyleTags.length > 0 && (
          <div className="shop-filter-section" style={{ marginBottom: "20px" }}>
            <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#333" }}>🏷️ {t("styleTags")}</h4>
            <div className="shop-style-tags" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {allStyleTags.map((tag) => (
                <button
                  className="shop-tag-button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "6px 12px",
                    border: `2px solid ${selectedTags.includes(tag) ? "var(--color-primary)" : "#ddd"}`,
                    borderRadius: "20px",
                    backgroundColor: selectedTags.includes(tag) ? "var(--color-primary)" : "white",
                    color: selectedTags.includes(tag) ? "white" : "#666",
                    cursor: "pointer",
                    fontSize: "0.9em",
                    transition: "all 0.2s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Filter */}
        <div className="shop-filter-section">
          <label className="shop-stock-filter" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              className="shop-stock-checkbox"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "0.95em" }}>📦 {t("inStockOnly")}</span>
          </label>
        </div>
      </div>

      {/* Results Counter */}
      <div className="shop-results-counter" style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
        <p>{t("showing")} <strong>{filteredProducts.length}</strong> {t("of")} <strong>{products.length}</strong> {t("products")}</p>
      </div>

      {/* Products Grid */}
      {/* Products Grid */}
      <div
        className="shop-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px 20px" }}>
            <p style={{ fontSize: "3em", margin: "0 0 10px" }}>📭</p>
            <p style={{ fontSize: "1.2em", color: "#999", margin: 0 }}>
              ❌ {t("noProductsFound")} {searchTerm ? `${t("matchingSearch")} "${searchTerm}"` : t("inThisCategory")}.
            </p>
            <p style={{ fontSize: "0.95em", color: "#bbb", marginTop: "10px" }}>
              {t("tryAdjusting")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
