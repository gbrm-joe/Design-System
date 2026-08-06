"use client";

import type { ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../utils";
import {
  BTN_ICON_GHOST,
  NAV_COLLAPSE,
  NAV_ICON,
  NAV_ITEM,
  SURFACE_CHROME,
  TAG,
} from "../design";

// ---------------------------------------------------------------------------
// PanelNav — the side navigation INSIDE a detail record.
//
// A record panel navigates down its own left column, exactly like the main
// sidebar: same NAV_ITEM geometry, same "active is a shade darker" rule, same
// Collapse pinned at the very bottom as a full-bleed h-9 row so both toggles
// sit level. There are NO horizontal tabs in a record — a tab strip is a
// different navigation model and reads as a different application.
//
// Promoted from Property Manager's property panel, where the pattern was
// settled, so every app's records navigate identically.
// ---------------------------------------------------------------------------

export interface PanelNavItem {
  id: string;
  label: string;
  /** Not yet built — shown muted with a Soon tag, still selectable-looking. */
  soon?: boolean;
  /** Trailing count. */
  badge?: number;
  /** Arbitrary trailing content; wins over `badge`. */
  trailing?: ReactNode;
  /** Nested one level under the item above it. */
  indent?: boolean;
}

export interface PanelNavGroup {
  label: string;
  items: PanelNavItem[];
}

function NavGroupLabel({ label, first }: { label: string; first?: boolean }) {
  // Full-bleed faint borders separate groups (-mx-2 cancels the nav's p-2).
  // h-9 matches the sub-header bar so their edges line up; the first group
  // drops its top border because the record header's rule already serves.
  return (
    <p
      className={cn(
        "-mx-2 flex h-9 shrink-0 items-center border-neutral-200 px-4 text-xs font-semibold uppercase tracking-wide text-black",
        first ? "-mt-2 border-b" : "border-y",
      )}
    >
      {label}
    </p>
  );
}

function PanelNavRow({
  item,
  active,
  onSelect,
}: {
  item: PanelNavItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        NAV_ITEM,
        "flex w-full shrink-0 items-center justify-between pr-3 text-left",
        item.indent ? "pl-8" : "pl-4",
        active
          ? "bg-neutral-200 font-medium text-neutral-900"
          : item.soon
            ? "text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-600"
            : "text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-800",
      )}
    >
      <span className="truncate">{item.label}</span>
      <span className="ml-2 shrink-0 text-xs tabular-nums">
        {item.soon ? (
          // TAG_COLOR.neutral would vanish on the neutral-100 nav — one shade darker.
          <span className={`${TAG} bg-neutral-200 text-neutral-400`}>Soon</span>
        ) : item.trailing !== undefined ? (
          item.trailing
        ) : item.badge !== undefined ? (
          <span
            className={cn(
              "rounded px-1 text-xs",
              active
                ? "bg-neutral-300 text-neutral-700"
                : "bg-neutral-200 text-neutral-500",
            )}
          >
            {item.badge}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function PanelNav({
  groups,
  activeId,
  onSelect,
  collapsed,
  onToggleCollapsed,
}: {
  groups: PanelNavGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  if (collapsed) {
    // Collapsed rail — the expand control sits at the BOTTOM, exactly where
    // Collapse lives when expanded, so the toggle never moves.
    return (
      <div
        className={`flex w-9 shrink-0 flex-col items-center justify-end border-r border-neutral-200 p-1 pb-2 ${SURFACE_CHROME}`}
      >
        <button
          type="button"
          onClick={onToggleCollapsed}
          title="Expand navigation"
          className={BTN_ICON_GHOST}
        >
          <PanelLeftOpen className={NAV_ICON} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex w-48 shrink-0 flex-col border-r border-neutral-200 ${SURFACE_CHROME}`}
    >
      <nav className="flex min-h-0 flex-1 flex-col gap-panelgap overflow-y-auto p-2">
        {groups.map((g, gi) => (
          <div key={g.label} className="contents">
            <NavGroupLabel label={g.label} first={gi === 0} />
            {g.items.map((item) => (
              <PanelNavRow
                key={item.id}
                item={item}
                active={activeId === item.id}
                onSelect={() => onSelect(item.id)}
              />
            ))}
          </div>
        ))}
      </nav>
      {/* Collapse — pinned at the very bottom, level with the main nav's. */}
      <div className="shrink-0 border-t border-neutral-200">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`${NAV_COLLAPSE} text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-800`}
        >
          <PanelLeftClose className={NAV_ICON} /> Collapse
        </button>
      </div>
    </div>
  );
}

/**
 * The record's sub-header: a fixed BAR_H bar on every section. All navigation
 * lives in the side nav — this bar carries context on the left and record
 * actions (Delete / Save / section controls) on the right. Its grey matches
 * the nav so the two read as one band of chrome.
 */
export function PanelSubHeader({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div
      className={`flex h-9 shrink-0 items-center justify-between gap-panelgap border-b border-neutral-200 px-panelgap ${SURFACE_CHROME}`}
    >
      {left ?? <span />}
      <div className="flex min-w-0 shrink-0 items-center gap-panelgap">
        {right}
      </div>
    </div>
  );
}

/**
 * The record's content pane: the panel body surface, inset by the one gap,
 * scrolling under a fixed sub-header. White cards sit inside it.
 */
export function PanelBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-100 p-panelgap">
      {children}
    </div>
  );
}

/**
 * The whole record layout: side nav + sub-header + body. A detail panel's
 * content renders through this — never a hand-rolled tab strip.
 */
export function PanelLayout({
  groups,
  activeId,
  onSelect,
  collapsed,
  onToggleCollapsed,
  subHeaderLeft,
  subHeaderRight,
  children,
}: {
  groups: PanelNavGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  subHeaderLeft?: ReactNode;
  subHeaderRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1">
        <PanelNav
          groups={groups}
          activeId={activeId}
          onSelect={onSelect}
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PanelSubHeader left={subHeaderLeft} right={subHeaderRight} />
          <PanelBody>{children}</PanelBody>
        </div>
      </div>
    </div>
  );
}
