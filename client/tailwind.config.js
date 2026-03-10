/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        ink3: 'var(--ink3)',
        paper: 'var(--paper)',
        teal: 'var(--teal)',
        amber: 'var(--amber)',
        coral: 'var(--coral)',
        sky: 'var(--sky)',
        violet: 'var(--violet)',
        lime: 'var(--lime)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
