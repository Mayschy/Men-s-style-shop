// src/pages/Checkout.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [step, setStep] = useState(1);

  const { cart, processCheckout, user } = useAuth();
  const navigate = useNavigate();

  const shippingInfoComplete = user?.shippingAddress?.city;

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Cannot place an order.");
      navigate("/");
      return;
    }

    const result = await processCheckout();

    if (result.success) {
      alert("🎉 Order Placed Successfully! Your cart has been cleared.");
      navigate("/shop");
    } else {
      alert(`❌ Payment failed: ${result.error}`);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Step 1: Shipping Information</h2>
            <p>
              Using saved address for **{user?.firstName}** in **
              {user?.shippingAddress?.city || "Not specified"}**.
            </p>

            <button
              onClick={() =>
                shippingInfoComplete
                  ? setStep(2)
                  : alert(
                      "Please update your shipping address in your profile first."
                    )
              }
              style={{
                padding: "10px 20px",
                backgroundColor: shippingInfoComplete ? "green" : "#999",
                color: "white",
                border: "none",
                cursor: shippingInfoComplete ? "pointer" : "not-allowed",
              }}
            >
              Continue to Payment →
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Payment Method</h2>
            <p>Using simulated payment (default method).</p>
            <button
              onClick={() => setStep(3)}
              style={{
                padding: "10px 20px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                marginRight: "10px",
              }}
            >
              Review Order →
            </button>
            <button
              onClick={() => setStep(1)}
              style={{ padding: "10px 20px", border: "1px solid #333" }}
            >
              ← Back
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Review & Place Order</h2>

            <h3>Order Summary</h3>
            <p>Total Items: **{cart.length}**</p>
            <p>
              Shipping Address: **{user?.shippingAddress?.street}**,{" "}
              {user?.shippingAddress?.city}
            </p>
            <p
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                borderTop: "1px solid #333",
                paddingTop: "10px",
              }}
            >
              Order Total: **${totalAmount.toFixed(2)}**
            </p>

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              style={{
                padding: "15px 30px",
                backgroundColor: cart.length > 0 ? "darkred" : "#999",
                color: "white",
                border: "none",
                cursor: cart.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              PLACE ORDER NOW (Simulated Payment)
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user || cart === null) {
    return (
      <p
        className="page-content"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Loading or not authorized...
      </p>
    );
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <p
        className="page-content"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Your cart is empty. Cannot proceed to checkout.
      </p>
    );
  }

  return (
    <div
      className="page-content"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1>Finalizing Your Order</h1>

      <div
        style={{
          marginBottom: "40px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <span
          style={{
            fontWeight: step === 1 ? "bold" : "normal",
            marginRight: "15px",
          }}
        >
          1. Shipping
        </span>
        <span
          style={{
            fontWeight: step === 2 ? "bold" : "normal",
            marginRight: "15px",
          }}
        >
          2. Payment
        </span>
        <span style={{ fontWeight: step === 3 ? "bold" : "normal" }}>
          3. Review
        </span>
      </div>

      {renderStepContent()}
    </div>
  );
};

export default Checkout;
