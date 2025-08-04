module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))", // ADD THIS
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Add other required colors
      }
    },
  },
  plugins: [],
}