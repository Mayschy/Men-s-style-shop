import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const navStyle = {
    padding: "var(--space-md) var(--space-lg)",
    background: "var(--color-navbar-bg)",
    borderBottom: `2px solid var(--color-primary)`,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 500,
    letterSpacing: "0.5px",
    zIndex: 1000,
  };

  const baseLinkStyle = {
    color: "var(--color-text-dark)",
    marginRight: "var(--space-lg)",
    textDecoration: "none",
    transition: "color 0.3s ease, border-bottom 0.3s ease",
    padding: "2px 0",
  };

  const logoStyle = {
    ...baseLinkStyle,
    color: "var(--color-primary)",
    fontSize: "1.6em",
    fontWeight: "900",
    letterSpacing: "1px",
    marginRight: "30px",
  };
  const dynamicButtonStyle = {
    padding: "10px 18px",
    backgroundColor: isButtonHovered ? "#BFA54F" : "var(--color-secondary)",
    color: "var(--color-text-dark)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.1s ease",
    transform: isButtonHovered ? "translateY(-1px)" : "translateY(0)",
    boxShadow: isButtonHovered
      ? "0 3px 6px rgba(0,0,0,0.2)"
      : "0 2px 4px rgba(0,0,0,0.1)",
  };

  const NavLinkWithHover = ({ to, children, isLogo = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentStyle = isLogo
      ? logoStyle
      : {
          ...baseLinkStyle,
          borderBottom: isHovered
            ? `2px solid var(--color-primary)`
            : "2px solid transparent",
          color: isHovered ? "var(--color-primary)" : "var(--color-text-dark)",
        };

    return (
      <Link
        to={to}
        style={currentStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children} {" "}
      </Link>
    );
  };
  return (
    <nav style={navStyle}>
      {" "}
      <div style={{ display: "flex", alignItems: "center" }}>
        {" "}
        <NavLinkWithHover to="/" isLogo={true}>
          MEN'S STYLE
        </NavLinkWithHover>
        <NavLinkWithHover to="/shop">Shop</NavLinkWithHover> {" "}
        {user && user.role === "admin" && (
          <NavLinkWithHover to="/admin/products">Admin Panel</NavLinkWithHover>
        )}
      </div>{" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
        }}
      >
        {" "}
        <NavLinkWithHover to="/cart">
          <span style={{ fontSize: "1.2em" }}>🛒 Cart</span>
        </NavLinkWithHover>{" "}
        {user ? (
          <>
            {" "}
            <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>
              Welcome, {user.name}
            </span>
            <NavLinkWithHover to="/profile">Profile</NavLinkWithHover> {" "}
            <button
              onClick={handleLogout}
              style={dynamicButtonStyle}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              Log Out{" "}
            </button>{" "}
          </>
        ) : (
          <Link
            to="/auth"
            style={dynamicButtonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Sign In / Register{" "}
          </Link>
        )}{" "}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
