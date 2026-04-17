import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContext } from '../App';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS } from '../config/api';
import { useApi } from '../hooks/useApi';
import './ProductDetail.css';

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

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      showToast(`Added ${quantity} item(s) to cart`, 'success');
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
              <span className={`stock-badge ${product.isAvailable ? 'in-stock' : 'out-of-stock'}`}>
                {product.isAvailable ? `✓ ${t("inStock")}` : `✗ ${t("outOfStock")}`}
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
            <div className="quantity-row">
              <label className="quantity-label">{t("quantity")}:</label>
              <div className="quantity-control">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="qty-input"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`btn-add-to-cart ${!product.isAvailable ? 'disabled' : ''}`}
            >
              {product.isAvailable ? `🛒 ${t("addToCart")}` : t("outOfStock")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;