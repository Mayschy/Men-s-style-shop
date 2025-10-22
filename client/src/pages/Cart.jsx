import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const styles = {};

const Cart = () => {
  const { user, cart, removeFromCart } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <p
        className="page-content"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Please log in to view your cart.
      </p>
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

  const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  };
  const totalStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    padding: "10px 0",
    borderTop: "2px solid #333",
    fontWeight: "bold",
  };

  return (
    <div
      className="page-content"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1>🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <p style={{ marginTop: "20px" }}>
          Your cart is empty. Go add some style!
        </p>
      ) : (
        <div style={{ marginTop: "30px" }}>
          {cart.map((item) => (
            <div key={item.productId._id} style={itemStyle}>
              <span style={{ flex: 3 }}>
                {item.productId.name}
                <span style={{ color: "#888", marginLeft: "10px" }}>
                  x{item.quantity}
                </span>
              </span>
              <span style={{ flex: 1, textAlign: "right", fontWeight: "bold" }}>
                ${(item.productId.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() =>
                  handleRemove(item.productId._id, item.productId.name)
                }
                style={{
                  marginLeft: "15px",
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={totalStyle}>
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              marginTop: "30px",
              padding: "15px 30px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1.1em",
              width: "100%",
            }}
          >
            Proceed to Checkout →
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
