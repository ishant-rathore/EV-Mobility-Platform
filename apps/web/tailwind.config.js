/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        volt: {
          400: "#5ee7a5",
          500: "#27d980",
          900: "#0b2f27"
        }
      }
    }
  },
  plugins: []
};
