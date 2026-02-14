import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://men-style-shop.onrender.com/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert(`✅ Added ${quantity} item(s) to cart`);
      setQuantity(1);
    } else {
      alert(`❌ ${result.error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">Error: {error}</p>
        <button
          onClick={() => navigate('/shop')}
          className="btn-primary"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <div className="product-detail-container">
      <button
        onClick={() => navigate('/shop')}
        className="btn-back"
      >
        ← Back to Shop
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
                {product.isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            <div className="category-pill">
              Category: {product.category}
            </div>

            <div className="divider"></div>

            <div className="description-box">
              <h3 className="section-title">Description</h3>
              <p className="description-text">
                {product.description}
              </p>
            </div>

            {product.styleTags && product.styleTags.length > 0 && (
              <div className="style-tags-box">
                <h3 className="section-title">Style Tags</h3>
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
              <label className="quantity-label">Quantity:</label>
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
              {product.isAvailable ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;