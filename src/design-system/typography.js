// Typography system for Lace and Legacy
export const fontFamilies = {
  // Serif fonts for headers
  serif: ['"Times New Roman"', 'Times', 'serif'],
  // Vintage display fonts
  display: ['"Times New Roman"', 'Times', 'serif'],
  // Sans-serif for body text
  sans: ['"Times New Roman"', 'Times', 'serif'],
  // Typewriter style for special elements
  mono: ['"Times New Roman"', 'Times', 'serif'],
};

export const fontSizes = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
};

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
  vintage: '0.15em', // Special vintage-style letter spacing
};

// Function to generate typography CSS variables
export const generateTypographyVariables = () => {
  let cssVars = ':root {\n';
  
  // Font families
  for (const [key, value] of Object.entries(fontFamilies)) {
    cssVars += `  --font-family-${key}: ${value.join(', ')};\n`;
  }
  
  // Font sizes
  for (const [key, value] of Object.entries(fontSizes)) {
    cssVars += `  --font-size-${key}: ${value};\n`;
  }
  
  // Font weights
  for (const [key, value] of Object.entries(fontWeights)) {
    cssVars += `  --font-weight-${key}: ${value};\n`;
  }
  
  // Line heights
  for (const [key, value] of Object.entries(lineHeights)) {
    cssVars += `  --line-height-${key}: ${value};\n`;
  }
  
  // Letter spacing
  for (const [key, value] of Object.entries(letterSpacing)) {
    cssVars += `  --letter-spacing-${key}: ${value};\n`;
  }
  
  cssVars += '}\n';
  
  return cssVars;
};

export default {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
};