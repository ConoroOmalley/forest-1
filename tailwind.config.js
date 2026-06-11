/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#f2f2f2',
        surface: '#e6e6e6',
        ink: '#000000',
        secondary: '#666666',
        muted: '#888888',
        line: '#d4d4d4',
        header: '#000000',
        'header-dark': '#000000',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'PingFang SC',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
