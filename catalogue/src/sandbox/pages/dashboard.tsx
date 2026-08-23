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
  SURFACE_EMPTY,
  SKELETON,
  CARD_HEADER,
  GAP,
  DELTA_POS,
  DELTA_NEG,
} from "../../../../src";
import { PROJECTS, currency, DASH } from "../data";
import { type DataState } from "../controls";
import { ProfitChart, PLOT_H } from "./chart";

const live = PROJECTS.filter((p) => p.status === "Won - In Progress");
const totalWip = live.reduce((s, p) => s + (p.wip ?? 0), 0);
const totalGp = live.reduce((s, p) => s + (p.grossProfit ?? 0), 0);
const lost = PROJECTS.filter((p) => p.status === "Lost").length;

export default function DashboardPage({ state }: { state: DataState }) {
  const loading = state === "loading";
  const empty = state === "empty";

  return (
    <>
      <div className={PAGE_HEADER}>
        <h1 className={PAGE_TITLE}>Dashboard</h1>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col ${GAP} overflow-y-auto p-panelgap`}>
        {/* L6 — ONE band, equal widths, optional. Figures never split across
            two rows of tiles. The band itself is chrome: it holds its place
            and its height while the figures load, so nothing below it moves
            when they arrive. */}
        <div className={`flex ${GAP}`}>
          <Tile label="Live projects" value={String(live.length)} delta="+3 this month" loading={loading} empty={empty} />
          <Tile label="WIP" value={currency(totalWip)} delta="+12.4%" loading={loading} empty={empty} />
          <Tile label="Gross profit" value={currency(totalGp)} delta="−4.1%" negative loading={loading} empty={empty} />
          {/* C2 — a measured zero would be `0`; this is genuinely absent. */}
          <Tile label="Overdue invoices" value={DASH} loading={loading} empty={empty} />
          <Tile label="Lost this year" value={String(lost)} loading={loading} empty={empty} />
        </div>

        <div className={`flex ${GAP}`}>
          <ChartCard title="Fees and costs by month" seed={7} loading={loading} empty={empty} />
          <ChartCard title="Pipeline by stage" seed={19} loading={loading} empty={empty} />
        </div>

        <div className={SURFACE_CARD}>
          <div className={CARD_HEADER}>Largest live jobs</div>
          {loading && (
            <div className="divide-y divide-neutral-100">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex h-[29px] items-center gap-3 px-3" aria-hidden>
                  <span className={`${SKELETON} h-2.5 w-16`} />
                  <span className={`${SKELETON} h-2.5 flex-1`} />
                  <span className={`${SKELETON} h-2.5 w-24`} />
                </div>
              ))}
            </div>
          )}
          {empty && (
            <div className="p-panelgap">
              <div className={`${SURFACE_EMPTY} py-6`}>No live jobs.</div>
            </div>
          )}
          <div className="divide-y divide-neutral-100">
            {(loading || empty ? [] : live.slice(0, 6)).map((p) => (
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
  loading,
  empty,
}: {
  label: string;
  value: string;
  delta?: string;
  negative?: boolean;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <div className={`${TILE} min-w-0 flex-1`}>
      {/* The LABEL is chrome — it is known before the figure is, so it never
          skeletons. Only the value does, at the size the value will be. */}
      <p className={SECTION_LABEL}>{label}</p>
      {loading ? (
        <p className="flex h-5 items-center">
          <span className={`${SKELETON} h-3 w-20`} />
        </p>
      ) : (
        // C2 — nothing measured yet is an em dash, not a zero.
        <p className="truncate text-sm tabular-nums text-neutral-900">{empty ? DASH : value}</p>
      )}
      {/* Deltas follow the figure rule: positive is PLAIN INK, not green —
          this is data, not celebration. Negative is red with a real minus. */}
      {delta && !loading && !empty && <p className={negative ? DELTA_NEG : DELTA_POS}>{delta}</p>}
      {delta && loading && (
        <p className="flex h-4 items-center">
          <span className={`${SKELETON} h-2.5 w-12`} />
        </p>
      )}
      {delta && empty && <p className={DELTA_POS}>{DASH}</p>}
    </div>
  );
}

/** A chart's card header is chrome and renders at once; the plot area holds
 *  its CHART_HEIGHT in every state, so the page never reflows around it. */
function ChartCard({
  title,
  seed,
  loading,
  empty,
}: {
  title: string;
  seed: number;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <div className={`${SURFACE_CARD} min-w-0 flex-1`}>
      <div className={CARD_HEADER}>{title}</div>
      <div className="p-3">
        {loading ? (
          <div aria-hidden>
            {/* The plot's real height, and a legend-shaped pair under it —
                the card must not resize when the bars arrive. */}
            <div className={`${SKELETON} w-full`} style={{ height: PLOT_H }} />
            <div className="mt-2 flex h-4 items-center gap-3">
              <span className={`${SKELETON} h-2.5 w-14`} />
              <span className={`${SKELETON} h-2.5 w-14`} />
            </div>
          </div>
        ) : empty ? (
          <div
            className={`${SURFACE_EMPTY} flex items-center justify-center`}
            style={{ height: PLOT_H + 24 }}
          >
            Nothing to plot for this period.
          </div>
        ) : (
          <ProfitChart seed={seed} />
        )}
      </div>
    </div>
  );
}
