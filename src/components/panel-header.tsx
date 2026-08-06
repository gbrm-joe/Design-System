"use client";

import type { ReactNode } from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import { SheetTitle } from "./sheet";
import { Button } from "./button";
import { cn } from "../utils";
import { PANEL_HEADER_BTN, SURFACE_CHROME, BREADCRUMB_PARENT, BREADCRUMB_SEP } from "../design";

/**
 * PanelHeader — the single, canonical header for every detail / edit side panel
 * (the Survey-Manager pattern). Renders a slim grey chrome band with the record title
 * (+ optional range), an optional bordered-square delete button, and an optional
 * tab strip.
 *
 * DECIDED (Joe, 2026-08-04): NO close or prev/next buttons — anywhere. Cross-
 * record navigation happens in the table; Escape and the backdrop close the
 * panel. The only header square is Delete.
 *
 * Title or breadcrumb: pass `title` for a plain record title, or `breadcrumb` for a
 * clickable path (e.g. Investment › Expenditure › Planned maintenance) where the
 * parent segments read as muted, clickable links back and the last is the active
 * record. `breadcrumb` wins when both are given.
 *
 * RULE (Joe, 2026-08-04): a record opened FROM A TABLE always gets a
 * breadcrumb — `Parent › Record`, the parent segment closing the panel back
 * to the table. A bare title with no way back is wrong.
 *
 * This is the one source of truth for panel chrome — do NOT hand-roll a header in
 * a panel. See DESIGN_SYSTEM.md › Detail Panels. Use inside a `<Sheet><SheetContent
 * showCloseButton={false} className="flex flex-col gap-0 overflow-hidden">`, above a
 * `bg-neutral-100` body.
 */

export interface PanelTab<T extends string = string> {
  id: T;
  label: string;
  /** Optional trailing count / badge shown after the label. */
  badge?: ReactNode;
}

/** One segment of a header breadcrumb. Non-last segments with an `onClick` render
 *  as muted, clickable links; the last segment is the active (black) record. */
export interface BreadcrumbSegment {
  label: ReactNode;
  onClick?: () => void;
}

export function PanelHeader<T extends string = string>({
  title,
  breadcrumb,
  range,
  actions,
  status,
  onDelete,
  deleteTitle = "Delete",
  tabs,
  activeTab,
  onTabChange,
}: {
  title: ReactNode;
  /** Clickable path shown instead of `title`, e.g. Investment › Expenditure › line. */
  breadcrumb?: BreadcrumbSegment[];
  /** Muted trailing text next to the title, e.g. a "2024 – 2029" year range. */
  range?: ReactNode;
  /** Extra controls before the nav buttons, e.g. a scenario selector / badge. */
  actions?: ReactNode;
  /** Transient status text (e.g. "Saving…" / "Saved"); nothing shown when falsy. */
  status?: ReactNode;
  /** Show a bordered delete button at the right of the band. */
  onDelete?: () => void;
  deleteTitle?: string;
  /** Optional tab strip under the header. */
  tabs?: PanelTab<T>[];
  activeTab?: T;
  onTabChange?: (id: T) => void;
}) {
  return (
    // Chrome, not content — grey like every non-editable band. NESTED inside a
    // record, so a step LIGHTER than the record header above it (greys darken
    // UP the hierarchy), and closed with a bottom border like every header
    // band (Joe, 2026-08-04).
    <div className={`shrink-0 border-b border-neutral-200 ${SURFACE_CHROME}`}>
      {/* h-9 — the same 36px as the property tab bar and the scenario name bar
          above it, so the three read as one band of chrome. */}
      {/* px-4 — the panel body is p-panelgap (4px) and a card label's text sits
          12px inside it, so 16px lines the title up with the data below. */}
      <div className="flex h-9 items-center justify-between px-4">
        <div className="min-w-0">
          <SheetTitle className="flex min-w-0 items-center text-sm font-semibold text-neutral-900">
            {breadcrumb && breadcrumb.length > 0 ? (
              breadcrumb.map((seg, i) => {
                const last = i === breadcrumb.length - 1;
                return (
                  <span key={i} className="flex min-w-0 items-center">
                    {i > 0 && <ChevronRight className={BREADCRUMB_SEP} />}
                    {seg.onClick && !last ? (
                      <button
                        type="button"
                        onClick={seg.onClick}
                        className={BREADCRUMB_PARENT}
                      >
                        {seg.label}
                      </button>
                    ) : (
                      <span className={cn(last ? "truncate text-neutral-900" : BREADCRUMB_PARENT)}>
                        {seg.label}
                      </span>
                    )}
                  </span>
                );
              })
            ) : (
              <span className="truncate">{title}</span>
            )}
            {range != null && range !== "" && (
              <span className="ml-2 shrink-0 text-xs font-normal text-neutral-400">{range}</span>
            )}
          </SheetTitle>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {actions}
          {status ? <span className="mr-1 text-xs text-neutral-400">{status}</span> : null}
          {onDelete && (
            <Button variant="ghost" size="icon-sm" onClick={onDelete} title={deleteTitle}
              className={cn(PANEL_HEADER_BTN, "text-neutral-500 hover:text-red-600")}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      {tabs && tabs.length > 0 && (
        <nav className="flex overflow-x-auto border-b border-neutral-200 px-4">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <div key={t.id} className={cn("shrink-0 border-b-2 px-3", active ? "border-neutral-900" : "border-transparent")}>
                <button
                  type="button"
                  onClick={() => onTabChange?.(t.id)}
                  className={cn(
                    "py-2 text-sm whitespace-nowrap transition-colors",
                    active ? "font-medium text-neutral-900" : "text-neutral-500 hover:text-neutral-800",
                  )}
                >
                  {t.label}
                  {t.badge != null && <span className="ml-1.5 text-xs text-neutral-400">{t.badge}</span>}
                </button>
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
