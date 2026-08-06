// The catalogue — renders the WORKING COPY of ../../src (tokens and the shared
// components), so an edit shows here live (npm run dev) before it is tagged and
// released. The page itself follows the system: grey chrome, white cards,
// h-12 header band, and a side nav (NAV_ITEM on SURFACE_CHROME, collapse
// pinned bottom) switching between the three media: Application, Print,
// Website. Application carries a sub-nav —
// indented one level, the same nesting PanelNav uses inside a record:
// Tokens, Components, Layout, Conventions.
// If an app screen doesn't match this page, the screen is wrong.
import { useState } from "react";
import {
  GAP,
  HEADER_H,
  NAV_ITEM,
  NAV_ICON,
  NAV_COLLAPSE,
  SURFACE_HEADER,
  SURFACE_CHROME,
} from "../../src/design";
import { LayoutIcon, PrinterIcon, GlobeIcon, ChevronLeft, ChevronRight } from "./ui";
import AppTokens from "./pages/app-tokens";
import AppComponents from "./pages/app-components";
import AppLayout from "./pages/app-layout";
import AppConventions from "./pages/app-conventions";
import PrintSystem from "./pages/print-system";
import WebsiteSystem from "./pages/website-system";

// One flat list of pages; `parent` renders an item as a sub-nav child of the
// system above it (indented, exactly like PanelNav's nested items).
const PAGES = [
  { key: "app", label: "Application", Icon: LayoutIcon, Page: AppTokens },
  { key: "app/tokens", parent: "app", label: "Tokens", Page: AppTokens },
  { key: "app/components", parent: "app", label: "Components", Page: AppComponents },
  { key: "app/layout", parent: "app", label: "Layout", Page: AppLayout },
  { key: "app/conventions", parent: "app", label: "Conventions", Page: AppConventions },
  { key: "print", label: "Print", Icon: PrinterIcon, Page: PrintSystem },
  { key: "website", label: "Website", Icon: GlobeIcon, Page: WebsiteSystem },
] as const;

type PageKey = (typeof PAGES)[number]["key"];

export default function App() {
  const [active, setActive] = useState<PageKey>("app/tokens");
  const [collapsed, setCollapsed] = useState(false);
  const { Page } = PAGES.find((p) => p.key === active)!;
  // A system's row reads as active while any of its sub-pages is open.
  const inApp = active.startsWith("app");

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* The one top band: h-12, neutral-200, one centred text-sm line. */}
      <header className={`${SURFACE_HEADER} sticky top-0 z-10 flex ${HEADER_H} items-center justify-between border-b border-neutral-300 px-4`}>
        <div className="flex items-center gap-2 leading-none">
          <span className="text-sm font-semibold">Design System</span>
          <span className="text-sm text-neutral-500">— catalogue</span>
        </div>
        <span className="text-xs text-neutral-500">renders the working copy of src/</span>
      </header>

      <div className="flex">
        {/* Side nav — NAV_ITEM on SURFACE_CHROME, active a shade darker
            (neutral-200), sub-pages indented one level, collapse pinned at the
            very bottom (NAV_COLLAPSE). */}
        <aside
          className={`${SURFACE_CHROME} sticky top-12 flex h-[calc(100vh-3rem)] shrink-0 flex-col border-r border-neutral-200 ${collapsed ? "w-12" : "w-52"}`}
        >
          <nav className={`flex flex-1 flex-col ${GAP} overflow-y-auto p-2`}>
            {PAGES.map((p) => {
              // Collapsed, only the three system icons show — sub-pages have
              // no icon of their own and would read as unlabelled rows.
              if (collapsed && "parent" in p) return null;
              const Icon = "Icon" in p ? p.Icon : null;
              // ONE darker row at a time: when a sub-page is open the section
              // above it goes dark TEXT, not a second dark background — two
              // shaded rows would read as two selections.
              const isSection = !("parent" in p);
              const selected = active === p.key || (collapsed && p.key === "app" && inApp);
              const sectionOpen = isSection && p.key === "app" && inApp;
              return (
                <button
                  key={p.key}
                  onClick={() => setActive(p.key === "app" ? "app/tokens" : p.key)}
                  aria-label={p.label}
                  className={`${NAV_ITEM} flex items-center gap-2 text-left ${isSection ? "px-2" : "pr-3 pl-8"} ${
                    selected
                      ? "bg-neutral-200 font-medium text-neutral-900"
                      : sectionOpen
                        ? "font-medium text-neutral-900 hover:bg-neutral-200/60"
                        : "text-neutral-600 hover:bg-neutral-200/60"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {Icon && <Icon className={NAV_ICON} />}
                  {!collapsed && p.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            className={`${NAV_COLLAPSE} border-t border-neutral-200 text-neutral-500 hover:bg-neutral-200/60 ${collapsed ? "justify-center !px-0" : ""}`}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            {!collapsed && "Collapse"}
          </button>
        </aside>

        <main className="mx-auto flex w-full max-w-5xl flex-col gap-panelgap p-panelgap pb-16">
          <Page />
        </main>
      </div>
    </div>
  );
}
