// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // now you can use `font-lora`
        lora: ["Franklin Gothic", "serif"],
      },
      colors: {
        // adds a `bg-site` class for your custom background
        site: "#EAF6F1",
      },
    },
  },
  plugins: [],
};
