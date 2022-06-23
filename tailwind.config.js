const production = !process.env.ROLLUP_WATCH;
module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.svelte"],
    enabled: production // disable purge in dev
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
};
