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
    //
    // React is not the only one at risk. The repo and the catalogue each have
    // their own copy of these (sonner 2.0.7 vs 2.0.8, say), and every one of
    // them keeps state OUTSIDE React: sonner's toast queue is module-level, and
    // base-ui and react-virtual pass context. Load two copies and a component's
    // `toast.success` lands in one while the sandbox's <Toaster/> renders from
    // the other — nothing throws, the toast simply never appears. Deduped for
    // the same reason React was (2026-08-17).
    dedupe: [
      "react",
      "react-dom",
      "sonner",
      "@base-ui/react",
      "@tanstack/react-virtual",
    ],
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
