import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContext } from '../App';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS } from '../config/api';
import { useApi } from '../hooks/useApi';
import './ProductDetail.css';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useContext(ToastContext);
  const { get, loading, error: apiError } = useApi();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const endpoint = `${API_ENDPOINTS.PRODUCTS_ALL}/${id}`;
      const data = await get(endpoint);

      if (data) {
        setProduct(data);
        setError(null);
      } else {
        setError(apiError || t("failedFetchProduct") || 'Failed to fetch product');
      }
    };
    fetchProduct();
  }, [id, get, apiError, t]);

  const getStockForSize = (size) => {
    if (!product || !product.sizes) return 0;
    const sizeData = product.sizes.find(s => s.size === size);
    return sizeData ? sizeData.stock : 0;
  };

  const handleQuantityChange = (newQuantity) => {
    const stock = selectedSize ? getStockForSize(selectedSize) : Infinity;
    const clampedQuantity = Math.max(1, Math.min(newQuantity, stock));
    setQuantity(clampedQuantity);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      showToast('Please select a size before adding to cart', 'error');
      return;
    }

    const stock = getStockForSize(selectedSize);
    if (stock < quantity) {
      showToast(`Not enough stock for size ${selectedSize}`, 'error');
      return;
    }

    const result = await addToCart(product._id, quantity, selectedSize);
    if (result.success) {
      showToast(`Added ${quantity} item(s) of size ${selectedSize} to cart`, 'success');
      setQuantity(1);
    } else {
      showToast(`${result.error}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t("loadingProducts")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{t("error")}: {error}</p>
        <button
          onClick={() => navigate('/shop')}
          className="btn-primary"
        >
          {t("backToShop")}
        </button>
      </div>
    );
  }

  if (!product) return <div className="not-found">{t("productNotFound")}</div>;

  const totalStock = product.sizes
    ? product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
    : 0;
  const isAvailable = totalStock > 0;

  return (
    <div className="product-detail-container">
      <button
        onClick={() => navigate('/shop')}
        className="btn-back"
      >
        ← {t("goBack")}
      </button>

      <div className="product-layout">
        {/* Image Section */}
        <div className="product-image-section">
          <div className="image-zoom-wrapper">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="product-details-section">
          <div className="details-header">
            <h1 className="product-title">{product.name}</h1>

            <div className="price-stock-row">
              <p className="product-price">
                ${product.price.toFixed(2)}
              </p>
              <span className={`stock-badge ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
                {isAvailable ? `✓ ${t("inStock")}` : `✗ ${t("outOfStock")}`}
              </span>
            </div>

            <div className="category-pill">
              {t("category")}: {product.category}
            </div>

            <div className="divider"></div>

            <div className="description-box">
              <h3 className="section-title">{t("description")}</h3>
              <p className="description-text">
                {product.description}
              </p>
            </div>

            {product.styleTags && product.styleTags.length > 0 && (
              <div className="style-tags-box">
                <h3 className="section-title">{t("styleTags")}</h3>
                <div className="tags-container">
                  {product.styleTags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Purchase Section */}
          <div className="purchase-section">
            {/* Size Selection */}
            <div className="size-selector">
              <label className="size-label">{t("selectSize") || "Select Size"}:</label>
              <div className="size-buttons">
                {SIZES.map(size => {
                  const stock = getStockForSize(size);
                  const isOutOfStock = stock === 0;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`size-btn ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                      title={isOutOfStock ? 'Out of stock' : `${stock} in stock`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <p className="selected-stock">
                  {t("inStock")}: {getStockForSize(selectedSize)}
                </p>
              )}
            </div>

            {/* Quantity Selection */}
            <div className="quantity-row">
              <label className="quantity-label">{t("quantity")}:</label>
              <div className="quantity-control">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="qty-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="qty-input"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              {selectedSize && (
                <span style={{ fontSize: "0.85em", color: "var(--color-text-light)" }}>
                  (Max: {getStockForSize(selectedSize)})
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || !selectedSize}
              className={`btn-add-to-cart ${!isAvailable || !selectedSize ? 'disabled' : ''}`}
            >
              {!isAvailable
                ? t("outOfStock")
                : !selectedSize
                ? t("selectSize") || "Select a Size"
                : `🛒 ${t("addToCart")}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
