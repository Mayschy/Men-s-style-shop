import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state
 * Replaces multiple useState calls with a single object state
 * Eliminates code duplication in Auth.jsx, Profile.jsx, etc.
 * 
 * Usage:
 * const { formData, updateField, resetForm, setFormData } = useFormState({
 *   email: '',
 *   password: '',
 *   firstName: ''
 * });
 */
export const useFormState = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  /**
   * Update a single field in the form
   */
  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  }, [errors]);

  /**
   * Mark field as touched (for validation display)
   */
  const markTouched = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  /**
   * Mark multiple fields as touched
   */
  const markMultipleTouched = useCallback((fieldNames) => {
    const newTouched = {};
    fieldNames.forEach(name => {
      newTouched[name] = true;
    });
    setTouched(prev => ({ ...prev, ...newTouched }));
  }, []);

  /**
   * Set field errors
   */
  const setFieldErrors = useCallback((fieldErrors) => {
    setErrors(fieldErrors);
  }, []);

  /**
   * Clear field error
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  /**
   * Reset form to initial values and clear touched/errors
   */
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  /**
   * Reset form to specific values
   */
  const resetToValues = useCallback((values) => {
    setFormData(values);
    setTouched({});
    setErrors({});
  }, []);

  /**
   * Check if form has any touched fields
   */
  const isTouched = Object.values(touched).some(t => t === true);

  /**
   * Check if form has any errors
   */
  const hasErrors = Object.values(errors).some(e => e !== '');

  /**
   * Get error for a field if touched
   */
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  }, [touched, errors]);

  /**
   * Get field state object (value, error, touched)
   */
  const getFieldState = useCallback((fieldName) => {
    return {
      value: formData[fieldName] || '',
      error: getFieldError(fieldName),
      isTouched: touched[fieldName] || false
    };
  }, [formData, touched, errors]);

  return {
    formData,
    setFormData,
    updateField,
    touched,
    markTouched,
    markMultipleTouched,
    errors,
    setFieldErrors,
    clearFieldError,
    resetForm,
    resetToValues,
    isTouched,
    hasErrors,
    getFieldError,
    getFieldState
  };
};

export default useFormState;
