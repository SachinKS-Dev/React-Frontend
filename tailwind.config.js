/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./react_code_base/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-primary)",
          "primary-fg": "var(--color-primary-foreground)",
          secondary: "var(--color-secondary)",
          "secondary-fg": "var(--color-secondary-foreground)",
          accent: "var(--color-accent)",
          "accent-fg": "var(--color-accent-foreground)",
          background: "var(--color-background)",
          surface: "var(--color-surface)",
          muted: "var(--color-muted)",
          "muted-fg": "var(--color-muted-foreground)",
          border: "var(--color-border)",
          destructive: "var(--color-destructive)",
          "destructive-fg": "var(--color-destructive-foreground)",
          success: "var(--color-success)",
          "success-fg": "var(--color-success-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        brand: "var(--radius-brand)",
      },
    },
  },
  plugins: [],
};
