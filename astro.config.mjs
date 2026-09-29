// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  adapter: vercel(),

  output: "static",

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@lenis/react", "lenis", "framer-motion"],
    },
  },
});