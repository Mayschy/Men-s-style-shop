import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
      <div
        style={{
          textAlign: 'center',
          marginTop: '100px',
          fontSize: '1.5em',
          color: 'var(--color-text-dark)',
        }}
      >
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '100px',
          fontSize: '1.2em',
          color: 'red',
        }}
      >
        <p>Error: {error}</p>
        <button
          onClick={() => navigate('/shop')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px',
        backgroundColor: '#fafafa',
        minHeight: '100vh',
      }}
    >
      <button
        onClick={() => navigate('/shop')}
        style={{
          marginBottom: '30px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '2px solid var(--color-primary)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1em',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.backgroundColor = 'var(--color-primary)';
          e.target.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.backgroundColor = 'transparent';
          e.target.color = 'var(--color-primary)';
        }}
      >
        ← Back to Shop
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '20px',
        }}
      >
        {/* Image Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Details Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5em',
                margin: '0 0 15px 0',
                color: 'var(--color-text-dark)',
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              <p
                style={{
                  fontSize: '2em',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)',
                  margin: 0,
                }}
              >
                ${product.price.toFixed(2)}
              </p>
              <span
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  backgroundColor: product.isAvailable ? '#4caf50' : '#f44336',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9em',
                }}
              >
                {product.isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            <div
              style={{
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                Category: {product.category}
              </span>
            </div>

            <hr
              style={{
                border: 'none',
                borderTop: '2px solid #ddd',
                margin: '20px 0',
              }}
            />

            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 10px 0',
                  color: 'var(--color-text-dark)',
                  fontSize: '1.2em',
                }}
              >
                Description
              </h3>
              <p
                style={{
                  margin: 0,
                  color: '#666',
                  lineHeight: '1.6',
                  fontSize: '1em',
                }}
              >
                {product.description}
              </p>
            </div>

            {product.styleTags && product.styleTags.length > 0 && (
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 10px 0',
                    color: 'var(--color-text-dark)',
                    fontSize: '1.2em',
                  }}
                >
                  Style Tags
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.styleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#f0f0f0',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9em',
                        color: '#333',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Purchase Section */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              <label
                style={{
                  fontSize: '1em',
                  fontWeight: 'bold',
                  color: 'var(--color-text-dark)',
                }}
              >
                Quantity:
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid var(--color-primary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  style={{
                    width: '50px',
                    textAlign: 'center',
                    fontSize: '1em',
                    fontWeight: 'bold',
                    border: 'none',
                    padding: '8px',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: product.isAvailable
                  ? 'var(--color-primary)'
                  : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                cursor: product.isAvailable ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (product.isAvailable) {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (product.isAvailable) {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
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