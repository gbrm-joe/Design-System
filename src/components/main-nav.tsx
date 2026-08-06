"use client";

import { useEffect } from "react";
import type { ComponentType, ElementType, ReactNode } from "react";
import { PanelLeftClose } from "lucide-react";
import { cn } from "../utils";
import {
  BRAND_ACTIVE,
  BRAND_BORDER,
  BRAND_IDLE,
  BRAND_MUTED,
  HEADER_H,
  NAV_COLLAPSE,
  NAV_GROUP_LABEL,
  NAV_GROUP_RULE,
  NAV_ICON,
  NAV_ITEM,
  NAV_ITEM_INSET,
  NAV_ITEM_INSET_NESTED,
  NAV_PAD,
  NAV_USER,
  SURFACE_NAV,
  TOOLTIP,
} from "../design";

// ---------------------------------------------------------------------------
// MainNav — the app's main sidebar. The LAST piece of chrome each app was
// still hand-rolling, and it had drifted badly: Property Manager's items sat
// 24px from the edge under a header at 20px, Project Manager's sat at 12px
// under a header at 12px — no indent at all — with 16px vs 8px between groups
// and 64px vs 48px collapsed rails. Both passed the drift guard, because
// tokens govern colour and size and nothing governed this SHAPE (Joe,
// 2026-08-06). It is fixed here now: L8 geometry, one collapsed width, the
// one 4px gap throughout.
//
// The item STATES had drifted too, and more visibly: Property Manager's idle
// items were zinc-400 against a near-white active row — a clear gap, so the
// selection read at a glance. Project Manager's were zinc-200, almost as
// bright as its active row, so nothing looked selected. They are BRAND_*
// tokens now: translucent white overlays that hold on any brand hue, carrying
// Property Manager's contrast.
//
// Apps supply items and their router's link element. They supply no spacing.
// ---------------------------------------------------------------------------

export interface MainNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  /** Not yet built — shown muted and inert, and sunk to the foot of its
   *  group so the working pages stay at the top. */
  soon?: boolean;
  /** Nested one level under the item above it. */
  indent?: boolean;
}

export interface MainNavGroup {
  /** Omitted on the first group — a header above the top item is noise. */
  label?: string;
  items: MainNavItem[];
}

export interface MainNavUser {
  name: string;
  /** The line under the name: the whitelabel unit, falling back to the role. */
  subLine?: string;
}

/** The signed-in user block. Exported so an app can hand it to its own
 *  dropdown as the trigger without re-drawing the shape. */
export function MainNavUserButton({
  user,
  collapsed,
}: {
  user?: MainNavUser;
  collapsed?: boolean;
}) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";
  return (
    <div
      className={cn(
        NAV_USER,
        "cursor-pointer hover:bg-white/6",
        // px-2 inside the p-panelgap wrapper = L8's 12px from the nav's edge.
        collapsed ? "justify-center px-0" : "px-2",
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/25 text-xs font-semibold text-white">
        {initials}
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-xs font-medium text-white/90">
            {user?.name ?? "Not signed in"}
          </p>
          <p className={`truncate text-xs ${BRAND_MUTED}`}>
            {user?.subLine ?? "—"}
          </p>
        </div>
      )}
    </div>
  );
}

/** Collapsed rows name themselves on hover — the one tooltip in the nav. */
function HoverLabel({ label }: { label: string }) {
  return (
    <span
      className={cn(
        TOOLTIP,
        "pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap group-hover/nav:block",
      )}
    >
      {label}
    </span>
  );
}

export function MainNav({
  appName,
  appIcon: AppIcon,
  appIconUrl,
  wordmarkUrl,
  groups,
  activePath,
  collapsed,
  onToggleCollapsed,
  linkAs,
  user,
  renderUser,
}: {
  appName: string;
  /** The default square mark. `appIconUrl` (branding) wins when set. */
  appIcon: ComponentType<{ className?: string }>;
  appIconUrl?: string | null;
  /** The business wordmark, sat above the user panel. Hidden when unset. */
  wordmarkUrl?: string | null;
  groups: MainNavGroup[];
  /** The current route. Active matching happens here, not per app. */
  activePath: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** The router's link element — `Link` from next/link. Defaults to `a`. */
  linkAs?: ElementType;
  user?: MainNavUser;
  /** Wrap the user button in the app's own dropdown (Sign out lives there). */
  renderUser?: (trigger: ReactNode) => ReactNode;
}) {
  const Link: ElementType = linkAs ?? "a";
  const userButton = <MainNavUserButton user={user} collapsed={collapsed} />;

  // Publish the LIVE width so a detail panel and its backdrop sit flush
  // against the nav in either state (L7). Owned here, not per app — an app
  // that forgot this left its panels overlapping the nav.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      collapsed ? "3rem" : "13rem",
    );
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col transition-[width]",
        // L7 — w-52 expanded, one collapsed rail at w-12.
        collapsed ? "w-12" : "w-52",
        SURFACE_NAV,
      )}
    >
      {/* App header — shares HEADER_H with every page-title band, so the app
          name and the page title sit on one line across the screen. */}
      <div
        className={cn(
          `flex ${HEADER_H} shrink-0 items-center gap-2.5 border-b ${BRAND_BORDER}`,
          collapsed ? "justify-center px-0" : "pl-3 pr-3",
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/25">
          {appIconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={appIconUrl} alt={appName} className="h-full w-full object-contain" />
          ) : (
            <AppIcon className="h-4 w-4 text-white" />
          )}
        </div>
        {!collapsed && (
          <span className="min-w-0 truncate text-sm font-semibold leading-none tracking-tight text-white">
            {appName}
          </span>
        )}
      </div>

      {/* The list. ONE gap between everything (L5) — groups are separated by
          their h-9 header, never by a bigger margin. */}
      <nav className={`flex min-h-0 flex-1 flex-col gap-panelgap overflow-y-auto py-panelgap ${NAV_PAD}`}>
        {groups.map((group, gi) => {
          // Soon items sink to the foot of their group; the sort is stable, so
          // an item rejoins its place the moment it stops being Soon.
          const items = [...group.items].sort(
            (a, b) => Number(a.soon ?? false) - Number(b.soon ?? false),
          );
          return (
            <div key={group.label ?? gi} className="contents">
              {group.label &&
                (collapsed ? (
                  // Same h-9 as the label it replaces, so nothing below moves.
                  <div className={NAV_GROUP_RULE} aria-label={group.label}>
                    <span className={`w-full border-t ${BRAND_BORDER}`} />
                  </div>
                ) : (
                  <p className={`${NAV_GROUP_LABEL} ${BRAND_MUTED}`}>{group.label}</p>
                ))}
              {items.map((item) => {
                const active =
                  !item.soon &&
                  (activePath === item.href ||
                    activePath.startsWith(item.href + "/"));
                const inner = (
                  <>
                    <item.icon className={NAV_ICON} />
                    {collapsed ? (
                      <HoverLabel label={item.label} />
                    ) : (
                      <>
                        {/* C6 — a nav row is ONE line: truncate, never wrap. */}
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.soon && (
                          <span className={`shrink-0 text-xs uppercase tracking-wide ${BRAND_MUTED}`}>
                            Soon
                          </span>
                        )}
                      </>
                    )}
                  </>
                );
                const shape = cn(
                  `group/nav relative flex shrink-0 items-center gap-2 ${NAV_ITEM}`,
                  // L8 — the indent. Items sit one step in from their group
                  // header; a nested item takes one step more.
                  collapsed
                    ? "justify-center px-0"
                    : item.indent
                      ? NAV_ITEM_INSET_NESTED
                      : NAV_ITEM_INSET,
                );

                if (item.soon) {
                  return (
                    <div
                      key={item.href}
                      title="Not yet available"
                      className={cn(shape, `cursor-not-allowed ${BRAND_MUTED}`)}
                    >
                      {inner}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(shape, active ? BRAND_ACTIVE : BRAND_IDLE)}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Business wordmark — above the user panel, hidden when unset. */}
      {wordmarkUrl && (
        <div
          className={cn(
            // Same py in both states, and the mark keeps its h-7 — otherwise
            // the footer sits 4px higher when collapsed.
            `flex shrink-0 items-center border-t py-2 ${BRAND_BORDER}`,
            collapsed ? "justify-center px-0" : "px-3",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wordmarkUrl}
            alt={appName}
            className={cn("h-7 object-contain", collapsed ? "w-7" : "w-full object-left")}
          />
        </div>
      )}

      {/* Signed-in user — directly ABOVE the collapse control, always. */}
      <div className={`shrink-0 border-t ${BRAND_BORDER} p-panelgap`}>
        {renderUser ? renderUser(userButton) : userButton}
      </div>

      {/* Collapse — the last thing in the column, level with PanelNav's. */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        className={cn(
          NAV_COLLAPSE,
          `group/nav relative shrink-0 border-t ${BRAND_BORDER} ${BRAND_IDLE}`,
          collapsed && "justify-center !px-0",
        )}
      >
        <PanelLeftClose className={cn(NAV_ICON, collapsed && "rotate-180")} />
        {collapsed ? <HoverLabel label="Expand" /> : "Collapse"}
      </button>
    </aside>
  );
}
