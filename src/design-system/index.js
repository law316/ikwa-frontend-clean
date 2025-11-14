import colors from './colors';
import typography from './typography';

// Export all design system elements
export { colors, typography };

// Export utility functions
export const generateCSSVariables = () => {
  const colorVars = require('./colors').generateColorVariables();
  const typographyVars = require('./typography').generateTypographyVariables();
  
  return `${colorVars}\n${typographyVars}`;
};

// Export spacing constants
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

// Export breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Export animations
export const animations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easings: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    vintage: 'cubic-bezier(0.25, 0.1, 0.25, 1.25)', // Slightly bouncy for vintage feel
  },
};

// Export shadows
export const shadows = {
  sm: '0 1px 2px rgba(42, 42, 42, 0.05)',
  md: '0 4px 6px rgba(42, 42, 42, 0.1)',
  lg: '0 10px 15px rgba(42, 42, 42, 0.1)',
  inner: 'inset 0 2px 4px rgba(42, 42, 42, 0.05)',
  vintage: '2px 2px 0 rgba(42, 42, 42, 0.2)',
};

// Export border radius
export const borderRadius = {
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  full: '9999px',
};