import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // The sandbox imports components from ../src, which sits outside this
    // root — so React resolved from the REPO's node_modules there and from
    // the catalogue's here. Two copies, and every hook in a shipped component
    // threw. One copy, always.
    dedupe: ["react", "react-dom"],
    alias: {
      // The sandbox renders the REAL shipped components. PanelStackRenderer is
      // the only one that imports Next, and only for `usePathname` — this
      // points it at the sandbox's own route store so panels really do close
      // on navigation. See src/sandbox/router.tsx.
      "next/navigation": fileURLToPath(
        new URL("./src/sandbox/router.tsx", import.meta.url),
      ),
    },
  },
});
