import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../App";
import { useLanguage } from "../context/LanguageContext";
import "./Cart.css";

const Cart = () => {
  const { user, cart, removeFromCart } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = React.useContext(ToastContext);

  if (!user) {
    return (
      <div className="cart-container">
        <div className="auth-message">
          <p>{t("pleaseLogIn")}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/auth")}
          >
            {t("goToLogin")}
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
        showToast(`${productName} removed from cart`, 'success');
      } else {
        showToast(`Error removing item: ${result.error}`, 'error');
      }
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 {t("shoppingCart")}</h1>
        <p className="cart-subtitle">{t("reviewItems")}</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">📭</div>
          <h2>{t("emptyCart")}</h2>
          <p>{t("discoverCollection")}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/shop")}
          >
            {t("continueShopping")}
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
                        ${item.productId.price.toFixed(2)} {t("each")}
                      </span>
                      <span className="item-quantity">
                        {t("quantity")}: <strong>{item.quantity}</strong>
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
                      title={t("removeFromCart")}
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
              <h2>{t("orderSummary")}</h2>
              
              <div className="summary-row">
                <span>{t("subtotal")}</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>{t("shipping")}</span>
                <span className="shipping-free">{t("free")}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>{t("totalAmount")}</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-checkout"
              >
                {t("proceedCheckout")}
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="btn-continue-shopping"
              >
                {t("continueShopping")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
