import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'https://men-style-shop.onrender.com/api';

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]);

    const fetchUserProfile = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const profileData = await response.json();
                
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const fullUserData = {
                    ...storedUser,
                    ...profileData
                };
                
                setUser(fullUserData);
                localStorage.setItem('user', JSON.stringify(fullUserData));
            } else {
                console.error("Failed to fetch user profile:", await response.json());
                if (response.status === 401) logout();
            }
        } catch (error) {
            console.error("Network error during profile fetch:", error);
        }
    };
    
    const fetchCart = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/user/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user || !user.token) {
            return { success: false, error: "Please log in to add items to your cart." };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user/cart`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'Failed to add item to cart' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or server unavailable' };
        }
    };

    const removeFromCart = async (productId) => {
        if (!user || !user.token) return { success: false, error: "Not authenticated." };

        try {
            const response = await fetch(`${API_BASE_URL}/user/cart/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` },
            });

            if (response.ok) {
                setCart(prevCart => prevCart.filter(item => item.productId._id !== productId));
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'Failed to remove item' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };
    
    const processCheckout = async () => {
        
        if (!user || !user.token) return { success: false, error: "Not authenticated." };
        if (cart.length === 0) return { success: false, error: "Cart is empty." };

        try {
            const response = await fetch(`${API_BASE_URL}/user/checkout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            
            if (response.ok) {
                setCart([]);
                return { success: true, message: "Order successfully placed." };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'Checkout failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or server unavailable' };
        }
    };
    
    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const minimalUserData = {
                    ...data.user, 
                    token: data.token, 
                };
                
                localStorage.setItem('user', JSON.stringify(minimalUserData));
                setUser(minimalUserData);

                await fetchUserProfile(data.token);
                await fetchCart(data.token);
                
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or server unavailable' };
        }
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                
                fetchUserProfile(userData.token);
                fetchCart(userData.token);
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const value = {
        user,
        isLoading,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        processCheckout,
        fetchUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};