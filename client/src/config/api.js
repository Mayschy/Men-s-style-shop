// Centralized API configuration - eliminates hardcoded URLs across codebase
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://men-style-shop.onrender.com';

export const SUPPORT_URLS = {
  TELEGRAM: 'https://t.me/Mayushy',
  EMAIL: 'mailto:mvasilyev2016@gmail.com',
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,

  PRODUCTS_ALL: `${API_BASE_URL}/api/products`,
  PRODUCTS_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_CREATE: `${API_BASE_URL}/api/products`,
  PRODUCTS_UPDATE: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_DELETE: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_MIGRATE: `${API_BASE_URL}/api/products/migrate`,

  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  USER_CART: `${API_BASE_URL}/api/user/cart`,
  USER_CART_ITEM: (productId, size) => `${API_BASE_URL}/api/user/cart/${productId}?size=${size}`,
  USER_ORDERS: `${API_BASE_URL}/api/user/orders`,
  USER_CHECKOUT: `${API_BASE_URL}/api/user/checkout`,

  AI_CHAT: `${API_BASE_URL}/api/ai/chat`,
};
