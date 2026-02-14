import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { user, cart, removeFromCart } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-container">
        <div className="auth-message">
          <p>Please log in to view your cart.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/auth")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const handleRemove = async (productId, productName) => {
    if (window.confirm(`Remove ${productName} from cart?`)) {
      const result = await removeFromCart(productId);
      if (result.success) {
        alert(`✅ ${productName} removed.`);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <p className="cart-subtitle">Review your items before checkout</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">📭</div>
          <h2>Your cart is empty</h2>
          <p>Discover our collection of premium men's fashion</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.productId._id} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.productId.name}</h3>
                    <div className="item-meta">
                      <span className="item-price">
                        ${item.productId.price.toFixed(2)} each
                      </span>
                      <span className="item-quantity">
                        Quantity: <strong>{item.quantity}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-total">
                      ${(item.productId.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        handleRemove(item.productId._id, item.productId.name)
                      }
                      className="btn-remove"
                      title="Remove from cart"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-free">Free</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-checkout"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="btn-continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
