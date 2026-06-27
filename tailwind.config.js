/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(15,23,42,.05)',
        'card-hover': '0 12px 36px rgba(15,23,42,.08)',
      },
      backgroundImage: theme => ({
        // Hero card gradients
        'breakthrough': 'linear-gradient(135deg, #FFF8FA 0%, #FFF5F7 45%, #FFFDFD 100%)',
        'rising': 'linear-gradient(135deg, #FFFBFC 0%, #FFF9FB 100%)',
        'sota': 'linear-gradient(135deg, #F8FCF9 0%, #F4FAF6 100%)',
        'github': 'linear-gradient(135deg, #FFFCFA 0%, #FFF8F4 100%)',
        // Widget gradients
        'x-widget': 'linear-gradient(135deg, #FCFCFD 0%, #F8F9FB 100%)',
        'reddit-widget': 'linear-gradient(135deg, #FFFBF8 0%, #FFF7F2 100%)',
      }),
      spacing: {
        '6': '24px', // gap-6 already 1.5rem = 24px, just explicit
        '22': '88px', // logo container size
        '13': '52px', // logo size
      },
      colors: {
        brand: '#FF4D73',
      },
      width: {
        'breakthrough': 'calc(100% * 1.06)', // ~6% wider than other cards
      },
      screens: {
        'sm': '640px',   // mobile small
        'md': '768px',   // tablet
        'lg': '1024px', // desktop small
        'xl': '1280px', // desktop medium
        '2xl': '1440px', // desktop large
      },
    },
  },
  plugins: [],
};
