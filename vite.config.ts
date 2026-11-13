import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import securityHeaders from "./security-headers.json";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    fs: { strict: true },
  },
  preview: {
    host: "127.0.0.1",
    headers: securityHeaders,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: { three: ["three"], react: ["react", "react-dom"] },
      },
    },
  },
});
