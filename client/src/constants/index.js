// Constants file for repeated strings and magic values throughout app

// Categories
export const CATEGORIES = {
  ALL: 'all',
  T_SHIRTS: 't-shirts',
  JACKETS: 'jackets',
  JEANS: 'jeans',
  ACCESSORIES: 'accessories',
};

export const CATEGORY_DISPLAY = {
  [CATEGORIES.T_SHIRTS]: 'T-Shirts',
  [CATEGORIES.JACKETS]: 'Jackets',
  [CATEGORIES.JEANS]: 'Jeans',
  [CATEGORIES.ACCESSORIES]: 'Accessories',
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Stock visibility
export const STOCK_STATUS = {
  IN_STOCK: 'in-stock',
  OUT_OF_STOCK: 'out-of-stock',
  LOW_STOCK: 'low-stock',
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// API error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
};

// Toast message types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart',
  LANGUAGE: 'language',
  THEME: 'theme',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
};

// Sort options
export const SORT_OPTIONS = {
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  NEW_FIRST: 'new-first',
  POPULAR: 'popular',
};

// Price constraints
export const PRICE_CONSTRAINTS = {
  MIN: 0,
  MAX: 500,
  STEP: 5,
};

// Validation rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 100,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
};

// UI delays (in ms)
export const DELAYS = {
  TOAST_DEFAULT: 3000,
  TOAST_ERROR: 5000,
  DEBOUNCE_SEARCH: 300,
  LOADING_MIN: 500,
};

// Support contact URLs
export const SUPPORT_URLS = {
  TELEGRAM: 'https://t.me/Mayushy',
  EMAIL: 'mailto:mvasilyev2016@gmail.com',
};
