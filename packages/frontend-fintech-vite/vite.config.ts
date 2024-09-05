import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stylex from "vite-plugin-stylex";
import svgr from "vite-plugin-svgr";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [relay, react(), stylex(), svgr(), commonjs()],
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
});
