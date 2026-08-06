// The Application system → Layout. The rules that are NOT class strings.
//
// A token fixes an element's colour and size; a component fixes a screen's
// shape. Layout is the third thing: where the blocks SIT — how wide, in how
// many columns, in what order. It used to live as prose inside the Detail
// panels bullet, which is exactly why Project Manager shipped a two-column
// project form and nobody caught it. Every rule below is drawn, numbered and
// (where it can be) guarded by scripts/check-design.sh.
import {
  GAP,
  SURFACE_HEADER,
  SURFACE_CHROME,
  SURFACE_BAR,
  SURFACE_CARD,
  SURFACE_NAV,
  CARD_HEADER,
  TILE,
  TAG,
  TAG_COLOR,
  SECTION_LABEL,
} from "../../../src/design";
import { Section, Anatomy, Verdict, CoreRule } from "../ui";

/** A labelled schematic block — shape only, no content. */
function Box({ label, className = "", children }: { label?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`flex items-center justify-center text-center text-[10px] leading-tight text-neutral-500 ${className}`}>
      {children ?? label}
    </div>
  );
}

/** One numbered rule with its rendering underneath. */
function Rule({ n, title, children, note }: { n: number; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        {/* TAG, not a dark fill — the catalogue obeys the system it documents. */}
        <span className={`${TAG} shrink-0 ${TAG_COLOR.neutral} tabular-nums`}>L{n}</span>
        <span className="text-xs font-semibold text-neutral-900">{title}</span>
      </div>
      {note && <p className="text-xs text-neutral-600">{note}</p>}
      {children}
    </div>
  );
}

export default function AppLayout() {
  return (
    <>
      <CoreRule>
        <span className="font-semibold">Layout is a rule, not a preference.</span> Tokens govern colour and size,
        components govern shape — these govern where the blocks sit. A screen can pass the drift guard with every
        token correct and still be laid out wrong, so the rules are numbered here and, where a machine can see them,
        checked by <span className="font-mono text-[11px]">scripts/check-design.sh</span>.
      </CoreRule>

      <Section
        stack
        title="L1 — the form block: ONE column, on the LEFT"
        note="The rule apps break most often. A detail panel's FormFields are one compact block in a single column of roughly a third the width, pinned left, with no sub-headers inside it. The remaining two thirds carry the charts and KPIs the record exists to show. One column, never two."
      >
        <Rule
          n={1}
          title="Fields left in one column (~w-1/3) · charts and KPIs right"
          note="A second column of fields halves the label width, doubles the eye's travel down the form, and leaves nowhere for the figures. Sub-headers inside the block are banned too — if a record needs sections, they are side-nav entries, not headings."
        >
          <div className="flex flex-col gap-3">
            <Verdict ok>one column, a third wide, on the left</Verdict>
            <div className={`flex ${GAP} bg-neutral-100 p-panelgap`}>
              <div className={`${SURFACE_CARD} w-1/3 shrink-0 divide-y divide-neutral-100`}>
                {["Address", "Tenure", "Passing rent", "Next review", "Use class"].map((l) => (
                  <div key={l} className="flex items-stretch">
                    <Box label={l} className="w-24 shrink-0 justify-start bg-neutral-50 px-2 py-2 text-neutral-400 uppercase" />
                    <Box className="flex-1 bg-white px-2 py-2" />
                  </div>
                ))}
              </div>
              <div className={`flex min-w-0 flex-1 flex-col ${GAP}`}>
                <div className={`flex ${GAP}`}>
                  {["KPI", "KPI", "KPI"].map((l, i) => <Box key={i} label={l} className={`${TILE} h-11 flex-1`} />)}
                </div>
                <Box label="Chart" className={`${SURFACE_CARD} h-32 flex-1`} />
              </div>
            </div>

            <Verdict ok={false}>grid-cols-2 wrapping FormFields — the guard fails this</Verdict>
            <div className="bg-neutral-100 p-panelgap opacity-60">
              <div className={`grid grid-cols-2 ${GAP}`}>
                {[0, 1].map((c) => (
                  <div key={c} className={`${SURFACE_CARD} divide-y divide-neutral-100`}>
                    {["Field", "Field", "Field"].map((l, i) => (
                      <div key={i} className="flex items-stretch">
                        <Box label={l} className="w-20 shrink-0 justify-start bg-neutral-50 px-2 py-2 text-neutral-400 uppercase" />
                        <Box className="flex-1 bg-white px-2 py-2" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Verdict ok={false}>one column, but full width — the figures have nowhere to go</Verdict>
            <div className="bg-neutral-100 p-panelgap opacity-60">
              <div className={`${SURFACE_CARD} divide-y divide-neutral-100`}>
                {["Address", "Tenure", "Passing rent"].map((l) => (
                  <div key={l} className="flex items-stretch">
                    <Box label={l} className="w-24 shrink-0 justify-start bg-neutral-50 px-2 py-2 text-neutral-400 uppercase" />
                    <Box className="flex-1 bg-white px-2 py-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Rule>
      </Section>

      <Section
        stack
        title="L2–L4 — the page and the record"
        note="Two skeletons, and every app screen is one of them. Bands stack in a fixed order and content always starts on a band's border line — never floating below it with a margin."
      >
        <Rule n={2} title="A page: main nav · h-12 title band · content inset by the ONE gap" note="A dashboard is a page like any other — the same h-12 band, never a hero title with a subtitle under it.">
          <div className="flex h-56 overflow-hidden rounded-lg border border-neutral-300">
            <Box label="Main nav w-52 · SURFACE_NAV" className={`${SURFACE_NAV} w-32 shrink-0 px-2 text-neutral-400`} />
            <div className="flex min-w-0 flex-1 flex-col">
              <Box label="h-12 title band · SURFACE_HEADER · one centred text-sm line, closed border-neutral-300" className={`${SURFACE_HEADER} h-12 shrink-0 border-b border-neutral-300 px-3`} />
              <div className={`flex flex-1 flex-col ${GAP} ${SURFACE_CHROME} p-panelgap`}>
                <div className={`flex ${GAP}`}>{[0, 1, 2, 3].map((i) => <Box key={i} label="TILE" className={`${TILE} h-10 flex-1`} />)}</div>
                <Box label="SURFACE_CARD — data lives here" className={`${SURFACE_CARD} flex-1`} />
              </div>
            </div>
          </div>
        </Rule>

        <Rule n={3} title="A record: h-12 header band · side nav left · h-9 sub-header · body" note="Records navigate DOWN a side nav. Horizontal tabs are banned — a tab strip is a different navigation model and reads as a different application. The panel is w-3/4 and the backdrop stops at the main nav, so the nav stays live behind an open record.">
          <div className="flex h-56 overflow-hidden rounded-lg border border-neutral-300">
            <Box label="Main nav (still live)" className={`${SURFACE_NAV} w-16 shrink-0 text-neutral-500`} />
            <div className="flex min-w-0 flex-1 flex-col border-l border-neutral-300">
              <Box label="h-12 record band · breadcrumb Parent › Record · Delete is the only header square" className={`${SURFACE_HEADER} h-12 shrink-0 border-b border-neutral-300 px-3`} />
              <div className="flex min-h-0 flex-1">
                <Box label="PanelNav w-48" className={`${SURFACE_CHROME} w-28 shrink-0 border-r border-neutral-200`} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Box label="h-9 sub-header — context left, record actions right" className={`${SURFACE_CHROME} h-9 shrink-0 border-b border-neutral-200 px-2`} />
                  <div className={`flex flex-1 ${GAP} bg-neutral-100 p-panelgap`}>
                    <Box label="Fields w-1/3" className={`${SURFACE_CARD} w-1/3 shrink-0`} />
                    <Box label="Charts and KPIs" className={`${SURFACE_CARD} flex-1`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Rule>

        <Rule n={4} title="A table: two stacked h-9 bars open the white card" note="The toolbar bar and the column header row are the same height and the same grey — they read as one block of table chrome. Nothing sits between them, and the toolbar's slot order is fixed on every table in every app.">
          <div className={`${SURFACE_CARD} overflow-hidden`}>
            <Box label="h-9 toolbar — Add · actions · Views · Columns · grouped-by · filters ··· search right" className={`${SURFACE_BAR} h-9 border-b border-neutral-200 px-2`} />
            <Box label="h-9 column header row" className={`${SURFACE_BAR} h-9 border-b border-neutral-200 px-2`} />
            {[0, 1, 2].map((i) => <Box key={i} label="row" className="h-7 border-b border-neutral-100 bg-white px-2" />)}
          </div>
        </Rule>
      </Section>

      <Section
        stack
        title="L5–L7 — spacing, bands and widths"
        note="Three numbers do all the spacing work. Anything else is drift."
      >
        <Rule n={5} title="ONE gap — 4px — between everything, and as the page inset" note="gap-panelgap / p-panelgap. No gap-1, gap-2 or gap-3 between controls, cards or sections; no larger outer margin on a page.">
          <div className={`flex ${GAP} ${SURFACE_CHROME} p-panelgap`}>
            {[0, 1, 2].map((i) => <Box key={i} label="4px apart, 4px from the edge" className={`${SURFACE_CARD} h-12 flex-1`} />)}
          </div>
        </Rule>

        <Rule n={6} title="A KPI band is ONE band of equal widths — and it is optional" note="flex-1 tiles with the one gap, all the same width, grey because they are read-only. A table does NOT imply a band, and figures never split across two rows of tiles or wear per-tile accent colours.">
          <div className="flex flex-col gap-3">
            <Verdict ok>one band, equal widths</Verdict>
            <div className={`flex ${GAP}`}>
              {["Passing rent", "ERV", "WAULT", "NIY"].map((l) => (
                <div key={l} className={`${TILE} flex-1`}>
                  <div className="text-xs text-neutral-500">{l}</div>
                  <div className="text-sm font-semibold tabular-nums">£1.23m</div>
                </div>
              ))}
            </div>
            <Verdict ok={false}>a second row, or tiles of different widths</Verdict>
            <div className={`flex flex-col ${GAP} opacity-60`}>
              <div className={`flex ${GAP}`}>
                <Box label="wide" className={`${TILE} h-10 w-2/3`} />
                <Box label="narrow" className={`${TILE} h-10 flex-1`} />
              </div>
              <div className={`flex ${GAP}`}>{[0, 1, 2].map((i) => <Box key={i} label="second row" className={`${TILE} h-10 flex-1`} />)}</div>
            </div>
          </div>
        </Rule>

        <Rule n={7} title="Fixed widths — the ones that must match across apps" note="Set here so two apps' screens line up when you flick between them.">
          <div className={`${SURFACE_CARD} overflow-hidden`}>
            <div className={CARD_HEADER}>Widths</div>
            <table className="w-full border-collapse text-xs">
              <tbody>
                {[
                  ["Main nav", "w-52 (13rem) — --sidebar-w matches it, so a panel sits flush against it"],
                  ["Panel side nav", "w-48 expanded, w-9 collapsed"],
                  ["Detail panel", "w-3/4; the backdrop starts at left-[var(--sidebar-w)]"],
                  ["Form block", "~w-1/3 of the panel body, pinned left (L1)"],
                  ["FormField label cell", "w-40 default; narrow to w-28 in a tight panel, never wider"],
                  ["Table search", "w-64, alone at the right end of the toolbar"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-neutral-100 last:border-b-0">
                    <td className="w-44 px-3 py-1.5 font-medium">{k}</td>
                    <td className="px-3 py-1.5 text-neutral-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Rule>
      </Section>

      <Section stack title="What the guard can and cannot see">
        <div className="flex flex-col gap-2">
          <div className={SECTION_LABEL}>Mechanically checked</div>
          <p className="text-xs text-neutral-600">
            L1's two-column form — a <span className="font-mono text-[11px]">grid-cols-2</span> (or 3/4, or an
            <span className="font-mono text-[11px]"> md:/lg:</span> variant) anywhere in a file that renders
            <span className="font-mono text-[11px]"> FormField</span> — now fails
            <span className="font-mono text-[11px]"> check-design.sh</span>. So does a local re-declaration of any
            component the package ships (<span className="font-mono text-[11px]">EntityTable</span>,{" "}
            <span className="font-mono text-[11px]">PanelNav</span>, <span className="font-mono text-[11px]">FormField</span> …),
            which is how an app grows its own panel chrome or tab strip in the first place.
          </p>
          <div className={`${SECTION_LABEL} mt-2`}>Reviewed by eye</div>
          <p className="text-xs text-neutral-600">
            Proportions (is the form block a third?), band order, and whether a KPI band belongs at all. That is what
            this page is for: open it beside the screen you are building.
          </p>
        </div>
      </Section>
    </>
  );
}
