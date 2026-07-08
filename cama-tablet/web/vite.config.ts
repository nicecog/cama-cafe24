import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "../android/app/src/main/assets/www"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
  server: {
    port: 5176,
    host: true,
  },
});
