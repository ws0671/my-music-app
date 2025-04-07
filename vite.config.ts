import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
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
