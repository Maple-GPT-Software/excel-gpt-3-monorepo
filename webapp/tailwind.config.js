/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#090E34',
      dark: '#1D2144',
      // TODO: primaryLight, primaryDark
      // is there any way to use the green-600 here or do we have to use the HEX?
      primary: '#16a34a',
      yellow: '#FBB040',
      'body-color': '#959CB1',
      darkGreen: '#16a34a',
    },
    screens: {
      xs: '450px',
      sm: '575px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px',
    },
    extend: {
      boxShadow: {
        signUp: '0px 5px 10px rgba(4, 10, 34, 0.2)',
        one: '0px 2px 3px rgba(7, 7, 77, 0.05)',
        sticky: 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
