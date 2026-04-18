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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 12;

  const allStyleTags = useMemo(() =>
    Array.from(new Set(products.flatMap(p => p.styleTags || []))),
    [products]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await get(`${API_ENDPOINTS.PRODUCTS_ALL}?page=${currentPage}&limit=${limit}`);

      if (data) {
        setProducts(data.products || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.totalCount);
        }

        if (data.products && data.products.length > 0) {
          const prices = data.products.map(p => p.price);
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
  }, [get, apiError, currentPage]);

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

  const categories = ["t-shirts", "jackets", "jeans", "accessories"];

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="shop-loading-spinner"></div>
        <p>{t("loadingProducts")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-error">
        <p>{t("errorFetching")}: {error}</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">{t("productCatalog")}</h1>

        {/* Minimal Search Bar */}
        <div className="shop-search-wrapper">
          <svg className="shop-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="shop-search"
            type="text"
            placeholder={t("searchProducts") || "Search products..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clean Filter Bar */}
      <div className="shop-filter-bar">
        {/* Category Links */}
        <div className="shop-categories">
          <button
            className={`shop-category-link ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`shop-category-link ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="shop-price-filter">
          <span className="shop-price-text">
            ${priceRange[0]} — ${priceRange[1]}
          </span>
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
          />
          <input
            className="shop-price-range"
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => {
              const newMax = Math.max(Number(e.target.value), priceRange[0]);
              setPriceRange([priceRange[0], newMax]);
            }}
          />
        </div>
      </div>

      {/* Style Tags & Stock Filter */}
      <div className="shop-secondary-filters">
        {allStyleTags.length > 0 && (
          <div className="shop-tags">
            {allStyleTags.map((tag) => (
              <button
                key={tag}
                className={`shop-tag ${selectedTags.includes(tag) ? "active" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <label className="shop-stock-toggle">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span className="shop-stock-label">In Stock Only</span>
        </label>
      </div>

      {/* Results Counter */}
      <div className="shop-results-counter">
        <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{totalCount}</strong> products</span>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="shop-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="shop-pagination-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <span className="shop-pagination-text">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="shop-pagination-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="shop-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <div className="shop-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <p>No products found</p>
            <span>Try adjusting your search or filters</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
