// Shared styles to eliminate duplication across components
export const commonStyles = {
  // Input styles
  input: {
    padding: "10px",
    border: "1px solid var(--color-border)",
    borderRadius: "4px",
    fontSize: "1em",
    fontFamily: "inherit",
  },

  inputLarge: {
    padding: "12px",
    border: "1px solid var(--color-border)",
    borderRadius: "4px",
    fontSize: "1em",
  },

  // Button styles
  buttonPrimary: {
    padding: "10px 20px",
    backgroundColor: "var(--color-primary)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1em",
    transition: "background-color 0.3s ease",
  },

  buttonSecondary: {
    padding: "10px 20px",
    backgroundColor: "var(--color-secondary)",
    color: "var(--color-text-dark)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1em",
    transition: "background-color 0.3s ease",
  },

  buttonDanger: {
    padding: "10px 20px",
    backgroundColor: "#D9534F",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1em",
    transition: "background-color 0.3s ease",
  },

  buttonSmall: {
    padding: "6px 12px",
    backgroundColor: "var(--color-primary)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9em",
  },

  // Container styles
  containerCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  containerSpaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  containerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  // Text styles
  textError: {
    color: "#D9534F",
    fontSize: "0.9em",
    margin: "5px 0",
  },

  textSuccess: {
    color: "#5CB85C",
    fontSize: "0.9em",
    margin: "5px 0",
  },

  textLight: {
    color: "var(--color-text-light)",
    fontSize: "0.9em",
  },

  // Icon styles
  minimalistIcon: {
    width: "24px",
    height: "24px",
    filter: "invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0) contrast(1)",
    display: "block",
  },
};

// Helper function to merge styles
export const mergeStyles = (...styles) => {
  return Object.assign({}, ...styles);
};

// Helper for hover states
export const getButtonStyleWithHover = (baseStyle) => ({
  ...baseStyle,
  "&:hover": {
    opacity: 0.9,
  },
});
