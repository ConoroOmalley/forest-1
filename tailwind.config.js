/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff385c',
        'primary-active': '#e00b41',
        ink: '#222222',
        body: '#3f3f3f',
        muted: '#6a6a6a',
        'muted-soft': '#929292',
        hairline: '#dddddd',
        'hairline-soft': '#ebebeb',
        canvas: '#ffffff',
        'surface-soft': '#f7f7f7',
        'surface-strong': '#f2f2f2',
        line: '#dddddd',
        page: '#ffffff',
        surface: '#f7f7f7',
        secondary: '#3f3f3f',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Circular',
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
      borderRadius: {
        card: '14px',
        pill: '9999px',
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px, rgba(0, 0, 0, 0.1) 0 4px 8px',
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
}
