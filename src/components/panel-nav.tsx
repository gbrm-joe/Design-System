"use client";

import type { ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../utils";
import {
  NAV_ACTIVE,
  NAV_COLLAPSE,
  NAV_COUNT,
  NAV_ICON,
  NAV_IDLE,
  NAV_ITEM,
  NAV_MUTED,
  PANEL_NAV_GROUP_LABEL,
  PANEL_NAV_ITEM_INSET,
  PANEL_NAV_ITEM_INSET_NESTED,
  NAV_PAD,
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
  // Full-bleed faint borders separate groups. h-9 matches the sub-header bar
  // so their edges line up; the first group drops its top border because the
  // record header's rule already serves. L8: the label lands on the SAME line
  // as the breadcrumb in the band above it — 16px, the panel's band inset.
  return (
    <p
      className={cn(
        PANEL_NAV_GROUP_LABEL,
        // -mx-panelgap cancels NAV_PAD so the rules run full-bleed, which is
        // why the label carries the whole 16px itself rather than 12 + NAV_PAD.
        "-mx-panelgap border-neutral-200 text-black",
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
        "flex w-full shrink-0 items-center justify-between text-left",
        // L8 — one step in from the group header; a nested item takes one more.
        item.indent ? PANEL_NAV_ITEM_INSET_NESTED : PANEL_NAV_ITEM_INSET,
        // The same three states as the main nav, from the same tokens — only
        // the direction flips, because this surface is light.
        active ? NAV_ACTIVE : item.soon ? NAV_MUTED : NAV_IDLE,
      )}
    >
      <span className="truncate">{item.label}</span>
      <span className="ml-2 shrink-0">
        {item.soon ? (
          // TAG_COLOR.neutral would vanish on the neutral-100 nav — one shade darker.
          <span className={`${TAG} bg-neutral-200 text-neutral-400`}>Soon</span>
        ) : item.trailing !== undefined ? (
          item.trailing
        ) : item.badge !== undefined ? (
          // Plain muted numerals, not a filled pill — see NAV_COUNT.
          <span className={cn(NAV_COUNT, active && "text-neutral-500")}>
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
    // Collapse lives when expanded, so the toggle never moves. It is the SAME
    // full-bleed h-9 row closed by the SAME border-t (L8): it used to be a
    // square icon button floated above the floor with no rule over it, so the
    // two states' toggles sat at different heights and only one had a line.
    return (
      <div
        className={`flex w-9 shrink-0 flex-col border-r border-neutral-200 ${SURFACE_CHROME}`}
      >
        <div className="min-h-0 flex-1" />
        <button
          type="button"
          onClick={onToggleCollapsed}
          title="Expand navigation"
          className={cn(
            NAV_COLLAPSE,
            "shrink-0 justify-center border-t border-neutral-200 !px-0",
            NAV_IDLE,
          )}
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
      {/* NAV_PAD is the only horizontal padding — 4px, so an active pill
          clears the edge. Everything else is L8's insets on the row itself. */}
      <nav className={`flex min-h-0 flex-1 flex-col gap-panelgap overflow-y-auto py-2 ${NAV_PAD}`}>
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
      {/* Collapse — pinned at the very bottom, level with the main nav's, and
          closed by the same border-t as the collapsed rail's. Full-bleed like
          the group headers, so it takes their 16px inset: everything down a
          panel's left edge sits on ONE line. */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        className={cn(NAV_COLLAPSE, "shrink-0 border-t border-neutral-200 px-4", NAV_IDLE)}
      >
        <PanelLeftClose className={NAV_ICON} /> Collapse
      </button>
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
