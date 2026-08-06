// The catalogue — renders every token in ../../src/design.ts from the WORKING
// COPY, so a token edit shows here live (npm run dev) before it is tagged and
// released. The page itself follows the system: grey chrome, white cards,
// h-12 header band, and a side nav (NAV_ITEM on SURFACE_CHROME, collapse
// pinned bottom) switching between the three media: Application, Print,
// Website. If an app screen doesn't match this page, the screen is wrong.
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
import AppSystem from "./pages/app-system";
import PrintSystem from "./pages/print-system";
import WebsiteSystem from "./pages/website-system";

const SYSTEMS = [
  { key: "app", label: "Application", Icon: LayoutIcon, Page: AppSystem },
  { key: "print", label: "Print", Icon: PrinterIcon, Page: PrintSystem },
  { key: "website", label: "Website", Icon: GlobeIcon, Page: WebsiteSystem },
] as const;

type SystemKey = (typeof SYSTEMS)[number]["key"];

export default function App() {
  const [active, setActive] = useState<SystemKey>("app");
  const [collapsed, setCollapsed] = useState(false);
  const { Page } = SYSTEMS.find((s) => s.key === active)!;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* The one top band: h-12, neutral-200, one centred text-sm line. */}
      <header className={`${SURFACE_HEADER} sticky top-0 z-10 flex ${HEADER_H} items-center justify-between border-b border-neutral-300 px-4`}>
        <div className="flex items-center gap-2 leading-none">
          <span className="text-sm font-semibold">Design System</span>
          <span className="text-sm text-neutral-500">— catalogue</span>
        </div>
        <span className="text-xs text-neutral-500">renders the working copy of src/design.ts</span>
      </header>

      <div className="flex">
        {/* Side nav — NAV_ITEM on SURFACE_CHROME, active a shade darker
            (neutral-200), collapse pinned at the very bottom (NAV_COLLAPSE). */}
        <aside
          className={`${SURFACE_CHROME} sticky top-12 flex h-[calc(100vh-3rem)] shrink-0 flex-col border-r border-neutral-200 ${collapsed ? "w-12" : "w-52"}`}
        >
          <nav className={`flex flex-1 flex-col ${GAP} overflow-y-auto p-2`}>
            {SYSTEMS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                aria-label={label}
                className={`${NAV_ITEM} flex items-center gap-2 px-2 text-left ${
                  active === key
                    ? "bg-neutral-200 font-medium text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-200/60"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={NAV_ICON} />
                {!collapsed && label}
              </button>
            ))}
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
