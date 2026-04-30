// Centralized API configuration - eliminates hardcoded URLs across codebase
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://men-style-shop.onrender.com';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  PRODUCTS_ALL: `${API_BASE_URL}/api/products`,
  PRODUCTS_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_CREATE: `${API_BASE_URL}/api/products`,
  PRODUCTS_UPDATE: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_DELETE: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  USER_UPDATE: `${API_BASE_URL}/api/user/update`,
  USER_CART: `${API_BASE_URL}/api/user/cart`,
  USER_ADD_TO_CART: `${API_BASE_URL}/api/user/cart/add`,
  USER_REMOVE_FROM_CART: `${API_BASE_URL}/api/user/cart/remove`,
  USER_ORDERS: `${API_BASE_URL}/api/user/orders`,
  USER_CHECKOUT: `${API_BASE_URL}/api/user/checkout`,
};
