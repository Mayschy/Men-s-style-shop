import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFormState } from "../hooks/useFormState";
import { API_ENDPOINTS } from "../config/api";
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
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Form state management with useFormState hook
  const { formData, updateField, resetForm } = useFormState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  const formTitle = isLogin ? t("signInForm") : t("signUp");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (isLogin) {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        showToast(t("success"), 'success');
        navigate("/");
      } else {
        setAuthError(result.error || t("error"));
      }
    } else {
      const endpoint = API_ENDPOINTS.AUTH_REGISTER;
      const body = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.street,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
      };

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (response.ok) {
          showToast(t("success"), 'success');
          setIsLogin(true);
          resetForm();
        } else {
          setAuthError(data.message || t("error"));
        }
      } catch (err) {
        setAuthError(t("error"));
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
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
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
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
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
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
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
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
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
              value={formData.street}
              onChange={(e) => updateField("street", e.target.value)}
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
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                style={{
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder={t("zip")}
                value={formData.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                style={{
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder={t("country")}
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                style={{
                  padding: "10px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}

        {authError && (
          <p style={{ color: "red", margin: 0, fontSize: "0.9em" }}>{authError}</p>
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
