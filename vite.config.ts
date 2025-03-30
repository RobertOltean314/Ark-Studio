import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Set up path aliases for easier imports
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    // Configure preprocessing for Sass
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@styles/variables.scss";`,
      },
    },
  },
});
