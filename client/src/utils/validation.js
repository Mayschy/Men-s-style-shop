// Centralized form validation - eliminates scattered validation logic

export const validation = {
  /**
   * Validate email format
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password
   */
  password: (password) => {
    return password && password.length >= 6;
  },

  /**
   * Validate username/name
   */
  name: (name) => {
    return name && name.trim().length >= 2;
  },

  /**
   * Validate street address
   */
  street: (street) => {
    return street && street.trim().length >= 5;
  },

  /**
   * Validate city
   */
  city: (city) => {
    return city && city.trim().length >= 2;
  },

  /**
   * Validate postal code (basic)
   */
  zip: (zip) => {
    return zip && zip.trim().length >= 3;
  },

  /**
   * Validate country
   */
  country: (country) => {
    return country && country.trim().length >= 2;
  },

  /**
   * Validate full address object
   */
  address: (address) => {
    return (
      validation.street(address.street) &&
      validation.city(address.city) &&
      validation.zip(address.zip) &&
      validation.country(address.country)
    );
  },

  /**
   * Validate product quantity
   */
  quantity: (quantity) => {
    const q = parseInt(quantity);
    return q > 0 && q <= 1000;
  },

  /**
   * Validate product price
   */
  price: (price) => {
    const p = parseFloat(price);
    return p > 0 && !isNaN(p);
  },
};

/**
 * Validate form data against schema
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach((field) => {
    const validator = schema[field];
    if (validator && !validator(data[field])) {
      errors[field] = `${field} is invalid`;
      isValid = false;
    }
  });

  return { isValid, errors };
};
