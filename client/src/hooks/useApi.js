import { useState, useCallback } from 'react';

/**
 * Custom hook for centralized API calls with error/loading state management
 * Eliminates duplicate fetch code across Shop, ProductDetail, Profile, Checkout, etc.
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generic fetch function
   * @param {string} endpoint - API endpoint URL
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {object} data - Data to send (for POST/PUT)
   * @returns {Promise} Response data or null on error
   */
  const request = useCallback(async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      // Add request body for POST/PUT
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      setLoading(false);
      return responseData;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching data';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * GET request
   */
  const get = useCallback((endpoint) => {
    return request(endpoint, 'GET');
  }, [request]);

  /**
   * POST request
   */
  const post = useCallback((endpoint, data) => {
    return request(endpoint, 'POST', data);
  }, [request]);

  /**
   * PUT request
   */
  const put = useCallback((endpoint, data) => {
    return request(endpoint, 'PUT', data);
  }, [request]);

  /**
   * DELETE request
   */
  const del = useCallback((endpoint) => {
    return request(endpoint, 'DELETE');
  }, [request]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    del,
    clearError,
    reset,
  };
};

export default useApi;
