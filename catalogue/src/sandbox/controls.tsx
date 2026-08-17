// The sandbox's devtools — the ONLY thing on screen exempt from the system's
// own rules (devtools overlays are already exempt; see DESIGN_SYSTEM.md →
// Exempt). Everything else in the sandbox composes design.ts.
//
// It floats over the app rather than taking a band of its own, because a
// control strip stealing 36px off the top would change the very geometry the
// sandbox exists to show.
import { Ruler, Palette, PanelLeftClose, PanelLeftOpen, ArrowLeft, Database } from "lucide-react";

/** Loading and empty are states of the same screen, not different screens —
 *  so they are a switch here rather than pages of their own. Flip through the
 *  three and the chrome must not move: the nav, the h-12 band and the table's
 *  two h-9 bars are identical in all three, and only the data area changes. */
export type DataState = "full" | "loading" | "empty";

export interface SandboxSettings {
  measures: boolean;
  navCollapsed: boolean;
  brand: string;
  data: DataState;
}

/** Brand colours to prove the nav's states hold on any hue. The nav's active
 *  and idle rows are translucent white overlays precisely so they survive
 *  this switch — flip through these and the selection must stay legible on
 *  every one. On a near-black nav that is easy; on the mid-blue it is the
 *  test that matters. */
export const BRANDS: { label: string; value: string }[] = [
  { label: "Near-black (default)", value: "#09090b" },
  { label: "Slate", value: "#1e293b" },
  { label: "Deep blue", value: "#1e3a8a" },
  { label: "Mid blue", value: "#2563eb" },
  { label: "Forest", value: "#14532d" },
  { label: "Claret", value: "#7f1d1d" },
];

/**
 * The measure overlay.
 *
 * This is the control that would have caught the bug that started all of
 * this: a page title 4px from the nav, under 14px of air, aligned with
 * nothing. Drawn, that is obvious in one glance; undrawn, it took using the
 * real app to notice.
 *
 * Two vertical lines down the content area — 4px (the page inset, L5) and
 * 16px (HEADER_PAD, L2). Anything that starts a band or a card should sit on
 * one of them. A third line marks the nav's own 12px column (L8), which the
 * app-name band and every group header share.
 */
export function MeasureOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {/* Nav column — L8's 12px, shared by the app-name band and group headers. */}
      <span className="absolute inset-y-0 left-3 border-l border-dashed border-amber-400/80" />
      <Tick className="left-3" label="12 · L8 nav column" tone="amber" />

      {/* Content area, measured from the live nav width so the lines follow
          the nav in either state. */}
      <span
        className="absolute inset-y-0 border-l border-dashed border-emerald-400/80"
        style={{ left: "calc(var(--sidebar-w, 13rem) + 4px)" }}
      />
      <Tick style={{ left: "calc(var(--sidebar-w, 13rem) + 4px)" }} label="4 · L5 page inset" tone="emerald" offset />

      <span
        className="absolute inset-y-0 border-l border-dashed border-blue-500/80"
        style={{ left: "calc(var(--sidebar-w, 13rem) + 16px)" }}
      />
      <Tick style={{ left: "calc(var(--sidebar-w, 13rem) + 16px)" }} label="16 · HEADER_PAD · the title lands here" tone="blue" />
    </div>
  );
}

function Tick({
  label,
  tone,
  className = "",
  style,
  offset,
}: {
  label: string;
  tone: "amber" | "emerald" | "blue";
  className?: string;
  style?: React.CSSProperties;
  offset?: boolean;
}) {
  const bg = { amber: "bg-amber-400", emerald: "bg-emerald-500", blue: "bg-blue-500" }[tone];
  return (
    <span
      className={`absolute ${offset ? "top-32" : "top-20"} ${className} ml-1 rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white ${bg}`}
      style={style}
    >
      {label}
    </span>
  );
}

export function SandboxControls({
  settings,
  onChange,
  onExit,
}: {
  settings: SandboxSettings;
  onChange: (next: Partial<SandboxSettings>) => void;
  onExit: () => void;
}) {
  return (
    <div className="fixed right-3 bottom-3 z-[70] flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-900/95 p-1 text-xs text-neutral-200 shadow-xl backdrop-blur">
      <button
        onClick={onExit}
        className="flex h-7 items-center gap-1.5 rounded px-2 hover:bg-neutral-800"
        title="Back to the catalogue"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Catalogue
      </button>

      <span className="h-5 w-px bg-neutral-700" />

      <button
        onClick={() => onChange({ measures: !settings.measures })}
        aria-pressed={settings.measures}
        className={`flex h-7 items-center gap-1.5 rounded px-2 ${
          settings.measures ? "bg-blue-600 text-white" : "hover:bg-neutral-800"
        }`}
        title="Draw the inset and alignment lines the rules name"
      >
        <Ruler className="h-3.5 w-3.5" />
        Measures
      </button>

      <button
        onClick={() => onChange({ navCollapsed: !settings.navCollapsed })}
        aria-pressed={settings.navCollapsed}
        className="flex h-7 items-center gap-1.5 rounded px-2 hover:bg-neutral-800"
        title="Collapsing changes the nav's WIDTH — nothing moves vertically (L8)"
      >
        {settings.navCollapsed ? (
          <PanelLeftOpen className="h-3.5 w-3.5" />
        ) : (
          <PanelLeftClose className="h-3.5 w-3.5" />
        )}
        Nav
      </button>

      <span className="h-5 w-px bg-neutral-700" />

      <label
        className="flex h-7 items-center gap-1.5 rounded px-2"
        title="Loading and empty are states of the same screen — the chrome must not move between them"
      >
        <Database className="h-3.5 w-3.5" />
        <select
          value={settings.data}
          onChange={(e) => onChange({ data: e.target.value as DataState })}
          className="h-6 rounded border border-neutral-700 bg-neutral-800 px-1 text-xs text-neutral-200 outline-none"
        >
          <option value="full">Data</option>
          <option value="loading">Loading</option>
          <option value="empty">Empty</option>
        </select>
      </label>

      <span className="h-5 w-px bg-neutral-700" />

      <label className="flex h-7 items-center gap-1.5 rounded px-2" title="The nav's states must hold on any brand hue">
        <Palette className="h-3.5 w-3.5" />
        <select
          value={settings.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          className="h-6 rounded border border-neutral-700 bg-neutral-800 px-1 text-xs text-neutral-200 outline-none"
        >
          {BRANDS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
