/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all source files
  ],
  theme: {
    extend: {
      fontFamily: {
        keania: ["Keania One", "sans-serif"],
        saira: ["Saira", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
      colors: {
        orange: {
          500: "#f65415",
        },
      },
      keyframes: {
        gradientBG: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        gradientBG: "gradientBG 8s ease infinite",
      },
    },
  },
  plugins: [],
};
