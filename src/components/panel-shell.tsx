"use client";

import type { ReactNode } from "react";
import { PanelStackProvider } from "./panel-stack-provider";
import { PanelStackRenderer } from "./panel-stack-renderer";

/**
 * Client-side wrapper that provides the panel stack context and renders
 * the panel overlay.  Used inside the server-component app layout.
 */
export function PanelShell({ children }: { children: ReactNode }) {
  return (
    <PanelStackProvider>
      {children}
      <PanelStackRenderer />
    </PanelStackProvider>
  );
}
