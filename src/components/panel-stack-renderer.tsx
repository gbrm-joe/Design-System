"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { HEADER_H, HEADER_PAD, SURFACE_HEADER, BREADCRUMB_PARENT, BREADCRUMB_SEP } from "../design";
import { usePanelStack } from "./panel-stack-provider";

// ---------------------------------------------------------------------------
// PanelStackRenderer
// ---------------------------------------------------------------------------

/**
 * Renders all panels in the stack. Place this once inside the app layout, as a
 * sibling of the main content area. Fully driven by PanelStackProvider context.
 *
 * All panels render at the same width (w-3/4) and same right-edge position.
 * Stacking is purely z-index — the topmost panel covers the one beneath.
 * Non-top panels get a dim overlay; clicking it closes the topmost (LIFO).
 */
export function PanelStackRenderer() {
  const { stack, close, closeAll } = usePanelStack();
  const pathname = usePathname();

  // Close every panel when the route changes — otherwise an open panel persists
  // over the new page (the layout, and so the panel stack, survives client-side
  // navigation), leaving the main nav looking dead until a refresh.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // ── Keyboard: Escape closes the topmost panel ──
  // Sibling navigation is the header's Prev/Next buttons only. The arrow keys are
  // reserved for cell navigation inside the model grid.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (stack.length === 0) return;
      if (e.key === "Escape") close();
    },
    [stack.length, close],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (stack.length === 0) return null;

  // A nested top panel (one with a topInset) deliberately leaves the panel below
  // it partly visible — its header and tab bar sit above the inset. Dimming or
  // covering that strip would make the exposed nav unusable, so when the top
  // panel is nested we drop the backdrop and the dim overlay entirely.
  const topIsNested = !!stack[stack.length - 1].topInset;

  return (
    <>
      {/* Backdrop behind the entire stack — click to close topmost.
          Excludes the main nav (starts at the sidebar's right edge) so a click
          in the nav area never closes the panel beneath an open sub-Sheet. */}
      {!topIsNested && (
        <div
          className="fixed inset-y-0 right-0 left-[var(--sidebar-w)] z-[35] bg-black/10 transition-opacity"
          onClick={() => close()}
          aria-hidden
        />
      )}

      {stack.map((panel, index) => {
        const isTop = index === stack.length - 1;
        const widthClass = panel.widthClass ?? "w-3/4";

        return (
          <div
            key={panel.id}
            role="dialog"
            aria-label={panel.title}
            // A nested panel draws its own border-t: it sits exactly over the tab
            // bar's border-b (the tab bar's -mb-px pulls the inset edge up 1px), so
            // without one there is no rule between the tabs and the panel header.
            // No shadow — spilling up onto the tab bar would darken it.
            className={`fixed bottom-0 right-0 flex flex-col border-l border-neutral-200 bg-white ${
              panel.topInset ? "border-t" : "shadow-lg"
            } ${widthClass}`}
            // Panels sit below the Sheet / Dialog / Select layer (z-50): a detail
            // Sheet opened from inside a panel must paint over it, not under it.
            style={{ zIndex: 40 + index, top: panel.topInset ?? 0 }}
          >
            {/* ── Header — a HEADER_H chrome band (grey: it is not editable),
                matching the sidebar app-name band: ONE centred leading-none
                line holding the breadcrumb INLINE before the title, so
                nothing crowds the top edge and the title sits level with the
                app name. HEADER_PAD: the ONE band inset, so the title lands on
                the same vertical line as the data below it. ── */}
            <div className={`flex ${HEADER_H} shrink-0 items-center justify-between border-b border-neutral-300 ${SURFACE_HEADER} ${HEADER_PAD}`}>
              {/* ONE breadcrumb style app-wide (Joe, 2026-08-04): muted
                  clickable parent › ChevronRight › dark title — matching
                  PanelHeader; no slashes, no arrows. */}
              <div className="flex min-w-0 items-center">
                {panel.subtitle && (
                  <>
                    <button
                      onClick={() => close(panel.id)}
                      className={`max-w-48 truncate text-sm leading-none ${BREADCRUMB_PARENT}`}
                    >
                      {panel.subtitle}
                    </button>
                    <ChevronRight className={BREADCRUMB_SEP} />
                  </>
                )}
                <h2
                  className={"truncate text-sm font-semibold leading-none text-neutral-900"}
                >
                  {panel.title}
                </h2>
                {panel.titleExtra}
              </div>
              {/* DECIDED (Joe, 2026-08-04): no prev/next/close buttons — the
                  table navigates between records; Escape / the backdrop /
                  the breadcrumb close. */}
              <div className="flex shrink-0 items-center gap-1.5">
                {panel.headerActions}
              </div>
            </div>

            {/* ── Body (scrollable) ───────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-neutral-100">{panel.content}</div>

            {/* Dim overlay on non-top panels — click closes topmost */}
            {!isTop && !topIsNested && (
              <div
                className="absolute inset-0 z-[1] bg-black/5"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </>
  );
}
