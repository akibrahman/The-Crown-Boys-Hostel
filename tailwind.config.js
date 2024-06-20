/** @type {import('tailwindcss').Config} */
module.exports = {
  optimizeCss: false,
  enableBabelRuntime: true,
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // primary: "#A32615",
        // secondary: "#F25864",
        primary: "#141515",
        secondary: "#141E30",
        dashboard: "#1F2937",
      },
    },
  },
  plugins: [],
};
