// File: templates/base/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // Use the root index.html as the build entry
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 3000,
  },
});
