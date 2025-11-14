// Black & White Brand Color System
export const colors = {
  black: '#000000',
  white: '#ffffff',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#404040',
    700: '#2d2d2d',
    800: '#1f1f1f',
    900: '#111111',
  },
  primary: '#000000',
  secondary: '#ffffff',
};

// Function to generate CSS variables
export const generateColorVariables = () => {
  return `:root {\n  --color-black: #000000;\n  --color-white: #ffffff;\n  --color-gray-900: #111111;\n  --color-gray-800: #1f1f1f;\n  --color-gray-700: #2d2d2d;\n  --color-gray-600: #404040;\n  --color-gray-500: #737373;\n  --color-gray-400: #a3a3a3;\n  --color-gray-300: #d4d4d4;\n  --color-gray-200: #e5e5e5;\n  --color-gray-100: #f5f5f5;\n  --color-gray-50: #fafafa;\n  --color-primary: var(--color-black);\n  --color-secondary: var(--color-white);\n  --color-background: var(--color-white);\n  --color-surface: var(--color-white);\n  --color-text: var(--color-black);\n  --color-text-secondary: var(--color-gray-600);\n  --color-border: var(--color-gray-300);\n  --color-shadow: rgba(0, 0, 0, 0.1);\n}\n`;
};

export default colors;