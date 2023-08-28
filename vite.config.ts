import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { join, resolve } from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": join(__dirname, "./src"),
      "@apis": join(__dirname, "./src/apis"),
      "@utils": join(__dirname, "./src/utils"),
      "@components": join(__dirname, "./src/components"),
      "@assets": join(__dirname, "./src/assets"),
      "@hooks": join(__dirname, "./src/hooks"),
      "@styles": join(__dirname, "./src/styles"),
      "@pages": join(__dirname, "./src/pages"),
      "@store": join(__dirname, "./src/store"),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        wallpaper: resolve(__dirname, "wallpaper.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {},
    },
  },
});
