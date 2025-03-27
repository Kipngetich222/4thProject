import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: "jsx", // Default loader for JSX files
    include: [/\.jsx?$/], // Ensures it applies to both .js and .jsx files
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
