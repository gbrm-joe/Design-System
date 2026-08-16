// Shared catalogue chrome: the specimen wrapper, the section card, the one
// chart and the inline icon set. The apps use lucide and a chart library; the
// catalogue stays dependency-free.
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  SURFACE_CARD,
  CARD_HEADER,
  CHART_SERIES,
  CHART_GRID,
  CHART_AXIS,
  CHART_INK,
  CHART_LEGEND,
  CHART_LEGEND_SWATCH,
} from "../../src/design";

export const icon = "h-3.5 w-3.5";

export const Plus = () => (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
export const Search = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
);
export const ChevronDown = () => (
  <svg className="h-3.5 w-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 6-6 6 6 6" /></svg>
);
export const Trash = () => (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2m1 0-1 14H8L7 6" /></svg>
);
export const X = () => (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const LayoutIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h6" /></svg>
);
export const PrinterIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="7" /></svg>
);
export const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
);
export const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 15 6-6 6 6" /></svg>
);
export const Info = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const Layers = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5M3 13l9 5 9-5" /></svg>
);
export const PanelLeftClose = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18m7-11-3 2 3 2" /></svg>
);
export const PanelLeftOpen = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18m4-11 3 2-3 2" /></svg>
);

export const Play = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 3 14 9-14 9V3z" /></svg>
);

/** One specimen: the rendered element with its token name underneath. */
export function Spec({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start">{children}</div>
      <div className="font-mono text-[10px] text-neutral-400">{name}</div>
    </div>
  );
}

/** One catalogue section: white card, grey uppercase header strip.
 *  `stack` swaps the wrapping specimen row for a full-width column — used by
 *  the Components and Layout pages, whose specimens are whole screens. */
export function Section({ title, note, stack, children }: { title: string; note?: string; stack?: boolean; children: React.ReactNode }) {
  return (
    <section className={`${SURFACE_CARD} overflow-hidden`}>
      <div className={CARD_HEADER}>{title}</div>
      {note && <div className="border-b border-neutral-100 px-3 py-2 text-xs text-neutral-500">{note}</div>}
      <div className={stack ? "flex flex-col gap-5 p-4" : "flex flex-wrap items-end gap-x-6 gap-y-4 p-4"}>{children}</div>
    </section>
  );
}

/** A full-width specimen: title, the rule in one line, then the rendering. */
export function Anatomy({ name, rule, children }: { name: string; rule?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[10px] text-neutral-400">{name}</div>
      {rule && <div className="text-xs text-neutral-600">{rule}</div>}
      {children}
    </div>
  );
}

/** Correct / wrong marker above a specimen. Green is banned for figures, not
 *  for a verdict — this is a label, not data. */
export function Verdict({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span className={ok ? "text-emerald-700" : "text-red-600"}>{ok ? "✓ Correct" : "✗ Wrong"}</span>
      <span className="text-neutral-500">— {children}</span>
    </div>
  );
}

/**
 * THE catalogue chart — a grouped bar chart drawn 1:1.
 *
 * The chart rules are in real pixels: text is 12px, gridlines are hairlines,
 * adjacent fills keep a 2px white gap. A `viewBox` stretched to fill its card
 * scales all three — the axis labels were rendering at 14 and 18px — so the
 * SVG is measured and drawn at its true width instead. Nothing here is a
 * chart library; it is the rules, rendered.
 */
export function GroupedBarChart({
  data,
  ticks,
  max,
  fmt,
  series,
  height = 172,
}: {
  data: Array<{ label: string; a: number; b: number }>;
  ticks: number[];
  max: number;
  fmt: (v: number) => string;
  series: [string, string];
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Geometry in real pixels. The y gutter is MEASURED from the widest label
  // actually being drawn, not assumed: it was hard-coded at 46px, which fits
  // "40,000" but not "£40,000" (48px at 12px), so every currency axis silently
  // lost its £ off the left edge — found in the sandbox, 2026-08-16. Same
  // principle as drawing the plot at 1:1: measure the real thing.
  const left = useMemo(() => {
    const c = document.createElement("canvas").getContext("2d");
    if (!c) return 46;
    c.font = "12px system-ui, -apple-system, sans-serif";
    const widest = Math.max(...ticks.map((v) => c.measureText(fmt(v)).width));
    return Math.ceil(widest) + 12; // 8px from the gridline, 4px of margin
  }, [ticks, fmt]);
  const top = 8;
  const bottom = height - 22; // the x-label line sits under the baseline
  const plotW = Math.max(0, w - left - 4);
  const groupW = plotW / Math.max(1, data.length);
  const barW = Math.max(6, Math.min(24, (groupW - 14) / 2));
  const y = (v: number) => bottom - (v / max) * (bottom - top);

  return (
    <div ref={ref} className="w-full">
      {w > 0 && (
        <svg width={w} height={height} className="block">
          {/* Horizontal gridlines only; the baseline is a shade darker. */}
          {ticks.map((v) => (
            <g key={v}>
              <line x1={left} x2={w - 4} y1={y(v)} y2={y(v)} stroke={v === 0 ? CHART_AXIS : CHART_GRID} strokeWidth="1" />
              <text x={left - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill={CHART_INK}>{fmt(v)}</text>
            </g>
          ))}
          {data.map((g, i) => {
            // The pair is centred in its group with a 2px white gap between.
            const cx = left + groupW * i + groupW / 2;
            const x0 = cx - barW - 1;
            return (
              <g key={g.label}>
                <rect x={x0} y={y(g.a)} width={barW} height={bottom - y(g.a)} rx="2" fill={CHART_SERIES[0]} />
                <rect x={x0 + barW + 2} y={y(g.b)} width={barW} height={bottom - y(g.b)} rx="2" fill={CHART_SERIES[1]} />
                <text x={cx} y={height - 6} textAnchor="middle" fontSize="12" fill={CHART_INK}>{g.label}</text>
              </g>
            );
          })}
        </svg>
      )}
      {/* Two or more series always get a legend; the swatch carries identity,
          never the text colour. */}
      <div className={`${CHART_LEGEND} mt-2`}>
        {series.map((name, i) => (
          <span key={name} className="flex items-center gap-1.5">
            <span className={CHART_LEGEND_SWATCH} style={{ background: CHART_SERIES[i] }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The lead-in line at the top of each system's page. */
export function CoreRule({ children }: { children: React.ReactNode }) {
  return <div className="px-px py-2 text-xs text-neutral-600">{children}</div>;
}
