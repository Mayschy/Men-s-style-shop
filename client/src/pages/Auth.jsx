import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ToastContext } from "../App";

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
  const { t } = useLanguage();
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
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const formTitle = isLogin ? t("signInForm") : t("signUp");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const API_BASE_URL = "https://men-style-shop.onrender.com";

    if (isLogin) {
      const result = await login(email, password);

      if (result.success) {
        showToast(t("success"), 'success');
        navigate("/");
      } else {
        setError(result.error || t("error"));
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
          showToast(t("success"), 'success');
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
            data.message || t("error")
          );
        }
      } catch (err) {
        setError(
          t("error")
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
          placeholder={t("email")}
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
          placeholder={t("password")}
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
                placeholder={t("firstName")}
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
                placeholder={t("lastName")}
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
              placeholder={t("street")}
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
                placeholder={t("city")}
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
                placeholder={t("zip")}
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
                placeholder={t("country")}
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
          {isLogin ? t("signInForm") : t("register")}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9em" }}>
        {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "var(--color-primary)",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isLogin ? t("signUp") : t("signInForm")}
        </span>
      </p>
    </div>
  );
};

export default Auth;
