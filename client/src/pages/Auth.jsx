import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const buttonStyle = {
  padding: "8px 15px",
  backgroundColor: "var(--color-secondary)",
  color: "var(--color-text-dark)",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const formTitle = isLogin
    ? "Sign In to Your Account"
    : "Create a New Account";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const API_BASE_URL = "http://localhost:3000";

    if (isLogin) {
      const result = await login(email, password);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } else {
      const endpoint = `${API_BASE_URL}/api/auth/register`;
      const body = {
        email,
        password,
        firstName,
        lastName,
        street,
        city,
        zip,
        country,
      };

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful! Please sign in now.");
          setIsLogin(true);
          setFirstName("");
          setLastName("");
          setStreet("");
          setCity("");
          setZip("");
          setCountry("");
          setPassword("");
        } else {
          setError(
            data.message || "Registration failed. Please check your data."
          );
        }
      } catch (err) {
        setError(
          "An error occurred during registration. Check if the backend is running."
        );
        console.error(err);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: isLogin ? "400px" : "600px",
        margin: "50px auto",
        padding: "30px",
        border: `1px solid var(--color-border)`,
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        backgroundColor: "white",
      }}
    >
      <h2>{formTitle}</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            border: `1px solid var(--color-border)`,
            borderRadius: "4px",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            border: `1px solid var(--color-border)`,
            borderRadius: "4px",
          }}
        />

        {!isLogin && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
            </div>

            <input
              type="text"
              placeholder="Street Address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              style={{
                padding: "10px",
                border: `1px solid var(--color-border)`,
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="ZIP/Postal Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                style={{
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <p style={{ color: "red", margin: 0, fontSize: "0.9em" }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            ...buttonStyle,
            backgroundColor: "var(--color-primary)",
            color: "white",
          }}
        >
          {isLogin ? "Sign In" : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9em" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "var(--color-primary)",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "Register Here" : "Sign In Here"}
        </span>
      </p>
    </div>
  );
};

export default Auth;
