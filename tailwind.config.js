const colors = require('./src/design-system/colors').colors;
const typography = require('./src/design-system/typography');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
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
    },
    extend: {
      backgroundColor: ({ theme }) => theme('colors'),
      textColor: ({ theme }) => theme('colors'),
      borderColor: ({ theme }) => theme('colors'),
      fontFamily: typography.fontFamilies,
      fontSize: typography.fontSizes,
      fontWeight: typography.fontWeights,
      lineHeight: typography.lineHeights,
      letterSpacing: typography.letterSpacing,
    },
  },
  plugins: [],
}