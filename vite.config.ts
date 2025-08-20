import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://googleads.g.doubleclick.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
