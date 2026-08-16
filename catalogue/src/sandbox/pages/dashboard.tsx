// The dashboard — a page like any other.
//
// The same h-12 PAGE_HEADER as every other page: never a hero title with a
// subtitle under it. KPI figures form ONE band of equal-width grey tiles (L6)
// — grey because they are read-only, never white cards, never icons, never a
// per-tile accent colour. Every chart sits in a white card under a CARD_HEADER
// strip, with the one gap between everything.
import {
  PAGE_HEADER,
  PAGE_TITLE,
  TILE,
  SECTION_LABEL,
  SURFACE_CARD,
  CARD_HEADER,
  GAP,
  DELTA_POS,
  DELTA_NEG,
} from "../../../../src";
import { PROJECTS, currency, DASH } from "../data";
import { ProfitChart } from "./chart";

const live = PROJECTS.filter((p) => p.status === "Won - In Progress");
const totalWip = live.reduce((s, p) => s + (p.wip ?? 0), 0);
const totalGp = live.reduce((s, p) => s + (p.grossProfit ?? 0), 0);
const lost = PROJECTS.filter((p) => p.status === "Lost").length;

export default function DashboardPage() {
  return (
    <>
      <div className={PAGE_HEADER}>
        <h1 className={PAGE_TITLE}>Dashboard</h1>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col ${GAP} overflow-y-auto p-panelgap`}>
        {/* L6 — ONE band, equal widths, optional. Figures never split across
            two rows of tiles. */}
        <div className={`flex ${GAP}`}>
          <Tile label="Live projects" value={String(live.length)} delta="+3 this month" />
          <Tile label="WIP" value={currency(totalWip)} delta="+12.4%" />
          <Tile label="Gross profit" value={currency(totalGp)} delta="−4.1%" negative />
          {/* C2 — a measured zero would be `0`; this is genuinely absent. */}
          <Tile label="Overdue invoices" value={DASH} />
          <Tile label="Lost this year" value={String(lost)} />
        </div>

        <div className={`flex ${GAP}`}>
          <div className={`${SURFACE_CARD} min-w-0 flex-1`}>
            <div className={CARD_HEADER}>Fees and costs by month</div>
            <div className="p-3">
              <ProfitChart seed={7} />
            </div>
          </div>
          <div className={`${SURFACE_CARD} min-w-0 flex-1`}>
            <div className={CARD_HEADER}>Pipeline by stage</div>
            <div className="p-3">
              <ProfitChart seed={19} />
            </div>
          </div>
        </div>

        <div className={SURFACE_CARD}>
          <div className={CARD_HEADER}>Largest live jobs</div>
          <div className="divide-y divide-neutral-100">
            {live.slice(0, 6).map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-1.5 text-xs">
                <span className="w-16 shrink-0 tabular-nums text-neutral-500">{p.jobRef}</span>
                {/* C6 — one line, truncate, never wrap. */}
                <span className="min-w-0 flex-1 truncate text-neutral-800">{p.name}</span>
                <span
                  className={`w-24 shrink-0 tabular-nums ${
                    (p.grossProfit ?? 0) < 0 ? DELTA_NEG : "text-neutral-700"
                  }`}
                >
                  {p.grossProfit === 0 ? DASH : currency(p.grossProfit)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Tile({
  label,
  value,
  delta,
  negative,
}: {
  label: string;
  value: string;
  delta?: string;
  negative?: boolean;
}) {
  return (
    <div className={`${TILE} min-w-0 flex-1`}>
      <p className={SECTION_LABEL}>{label}</p>
      <p className="truncate text-sm tabular-nums text-neutral-900">{value}</p>
      {/* Deltas follow the figure rule: positive is PLAIN INK, not green —
          this is data, not celebration. Negative is red with a real minus. */}
      {delta && <p className={negative ? DELTA_NEG : DELTA_POS}>{delta}</p>}
    </div>
  );
}
