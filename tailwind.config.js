
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./content/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        card: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
