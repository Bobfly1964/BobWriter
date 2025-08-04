	// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,css}",
    "./components/**/*.{js,ts,jsx,tsx,css}",
    "./Writer/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      /* ... */
    }
  },
 

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // если используете CSS-переменную:
        border: "hsl(var(--border))",
        // или жёстко:
        // border: "#e5e7eb",
      }
    }
  },
  plugins: []
};
