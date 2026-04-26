/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--bg-void)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        cyan: "var(--accent-cyan)",
        violet: "var(--accent-violet)",
        rose: "var(--accent-rose)",
        gold: "var(--accent-gold)",
        primary: "var(--text-primary)",
        muted: "var(--text-muted)"
      },
      boxShadow: {
        cyan: "var(--glow-cyan)",
        violet: "var(--glow-violet)"
      }
    }
  },
  plugins: []
};
