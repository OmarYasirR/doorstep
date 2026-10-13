/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#16324F', 50: '#EAF0F5', 100: '#CBDAE6', 400: '#3D6A94', 600: '#1E4468', 900: '#0F2338' },
        paper: '#F7F5F0',
        charcoal: '#2B2B28',
        brass: { DEFAULT: '#B08D57', light: '#D4B483', dark: '#8C6D3F' },
        slate: { DEFAULT: '#8A93A0' },
        sage: '#6B7A5E',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
