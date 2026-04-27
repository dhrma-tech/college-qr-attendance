/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#151515',
        paper: '#f8faf7',
        mist: '#e8ece5',
        carbon: '#24211f',
        teal: '#087f7a',
        coral: '#e35d4f',
        citron: '#b7d34b',
        amber: '#d79a2b',
      },
      boxShadow: {
        crisp: '0 18px 60px rgba(21, 21, 21, 0.08)',
        panel: '0 1px 0 rgba(21, 21, 21, 0.08), 0 20px 40px rgba(21, 21, 21, 0.06)',
      }
    },
  },
  plugins: [],
}
