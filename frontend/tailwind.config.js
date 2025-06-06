/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        'all-around': '0 4px 15px rgba(0, 0, 0, 0.2)',
      },

    },
  },
  plugins: [],
};
