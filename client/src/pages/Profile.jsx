import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Для получения user и токена

// --- СТИЛЕВЫЕ КОМПОНЕНТЫ ---

// Общий стиль кнопки (для сохранения)
const primaryButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "var(--color-primary)", // Темно-коричневый
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};

// Стиль для поля ввода/просмотра
const inputStyle = {
  padding: "12px",
  border: "1px solid var(--color-border)",
  borderRadius: "4px",
  backgroundColor: "white",
  width: "100%", // Занимает всю доступную ширину
  boxSizing: "border-box",
};

// Стиль для контейнеров (Карточек)
const cardStyle = {
  backgroundColor: "var(--color-background)", // Светлый фон
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  padding: "30px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)", // Легкая тень
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---

const Profile = () => {
  // ✅ ИСПРАВЛЕНИЕ: Мы зависим от объекта user из контекста
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Локальные состояния для формы редактирования
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  const API_BASE_URL = "http://localhost:3000";

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    const token = user?.token;

    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) logout();
        throw new Error("Failed to fetch profile data.");
      }

      const data = await response.json();
      setProfileData(data);

      setEditForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        street: data.shippingAddress?.street || "",
        city: data.shippingAddress?.city || "",
        zip: data.shippingAddress?.zip || "",
        country: data.shippingAddress?.country || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchProfile();
    } else {
      setProfileData(null);
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const token = user?.token;
    if (!token) return setError("Not authenticated.");

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed.");
      }

      setProfileData(data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        Error: {error}
      </div>
    );

  if (!profileData && !user)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Please sign in to view your profile.
      </div>
    );

  const DataRow = ({ label, value }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #E0E0E0",
      }}
    >
      <span style={{ color: "var(--color-text-light)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--color-text-dark)" }}>
        {value || "Not specified"}
      </span>
    </div>
  );

  const NavItem = ({ name, onClick, isActive }) => (
    <li
      onClick={onClick}
      style={{
        marginBottom: "15px",
        cursor: "pointer",
        color: isActive ? "var(--color-primary)" : "var(--color-text-light)",
        fontWeight: isActive ? 700 : 500,
        padding: "5px 0",
        borderLeft: isActive ? "3px solid var(--color-primary)" : "none",
        paddingLeft: isActive ? "17px" : "20px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.color = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.color = "var(--color-text-light)";
      }}
    >
      {name}
    </li>
  );

  return (
    <div
      className="page-content"
      style={{
        padding: "60px 40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "var(--color-primary)",
          marginBottom: "10px",
          fontSize: "2.2em",
        }}
      >
        My Account Dashboard
      </h1>
      <p style={{ color: "var(--color-text-light)", marginBottom: "30px" }}>
        Welcome back,{" "}
        <strong style={{ color: "var(--color-secondary)" }}>
          {profileData.firstName || profileData.email}
        </strong>
        ! Manage your personal details, orders, and addresses.
      </p>

      <div style={{ display: "flex", gap: "60px", marginTop: "40px" }}>
        <aside
          style={{
            width: "250px",
            paddingRight: "40px",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "var(--color-text-dark)",
              fontSize: "1.1em",
            }}
          >
            Profile Navigation
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <NavItem
              name="Personal Details"
              isActive={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
            <NavItem
              name="Order History"
              isActive={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <NavItem
              name="Saved Addresses"
              isActive={activeTab === "addresses"}
              onClick={() => setActiveTab("addresses")}
            />

            <li
              onClick={logout}
              style={{
                ...NavItem({}).style,
                marginTop: "30px",
                color: "red",
                fontWeight: 700,
                border: "none",
                paddingLeft: "20px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FF0000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "red")}
            >
              Log Out
            </li>
          </ul>
        </aside>

        <section style={{ flexGrow: 1, minWidth: "600px" }}>
          <h2 style={{ color: "var(--color-text-dark)", marginBottom: "30px" }}>
            {activeTab === "details" && "Personal Details"}
            {activeTab === "orders" && "Order History (TODO)"}
            {activeTab === "addresses" && "Saved Addresses (TODO)"}
          </h2>

          {activeTab === "details" && profileData && (
            <div style={{ ...cardStyle, maxWidth: "650px" }}>
              {isEditing ? (
                <form
                  onSubmit={handleUpdate}
                  style={{ display: "grid", gap: "15px" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      style={inputStyle}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      style={inputStyle}
                      required
                    />
                  </div>

                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{ ...inputStyle, backgroundColor: "#EEEEEE" }}
                  />

                  <h4
                    style={{
                      marginTop: "10px",
                      marginBottom: "0",
                      color: "var(--color-primary)",
                    }}
                  >
                    Shipping Address
                  </h4>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={editForm.street}
                    onChange={(e) =>
                      setEditForm({ ...editForm, street: e.target.value })
                    }
                    style={inputStyle}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={editForm.zip}
                      onChange={(e) =>
                        setEditForm({ ...editForm, zip: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={editForm.country}
                    onChange={(e) =>
                      setEditForm({ ...editForm, country: e.target.value })
                    }
                    style={inputStyle}
                  />

                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <div
                    style={{ display: "flex", gap: "15px", marginTop: "15px" }}
                  >
                    <button
                      type="submit"
                      style={{
                        ...primaryButtonStyle,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#8A542C")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-primary)")
                      }
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        ...primaryButtonStyle,
                        backgroundColor: "var(--color-secondary)",
                        color: "var(--color-text-dark)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#BFA54F")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-secondary)")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <DataRow label="First Name" value={profileData.firstName} />
                  <DataRow label="Last Name" value={profileData.lastName} />
                  <DataRow label="Email Address" value={profileData.email} />

                  <h4
                    style={{ marginTop: "30px", color: "var(--color-primary)" }}
                  >
                    Shipping Address
                  </h4>
                  <p style={{ margin: "10px 0 20px 0", lineHeight: "1.6" }}>
                    {profileData.shippingAddress?.street}, <br />
                    {profileData.shippingAddress?.city}{" "}
                    {profileData.shippingAddress?.zip} <br />
                    {profileData.shippingAddress?.country}
                  </p>

                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      ...primaryButtonStyle,
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-text-dark)",
                      marginTop: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#BFA54F")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-secondary)")
                    }
                  >
                    Edit Details
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab !== "details" && (
            <div style={cardStyle}>
              <p style={{ color: "var(--color-text-light)" }}>
                Content for **
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}**
                section will go here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
