// The Application system → Components. The v0.4.0 shared components rendered
// from the WORKING COPY of the tokens, so a token edit shows here live.
//
// The components themselves import next/lucide/base-ui, which the catalogue
// deliberately does not depend on (CLAUDE.md: dependency-free beyond
// Vite/React/Tailwind). So this page REPRODUCES each component's markup
// verbatim against the same tokens — it is the reference rendering, and if a
// component's shape ever diverges from what is drawn here, one of the two is
// wrong. Every class string below is copied from src/components/.
import {
  GAP,
  NAV_ITEM,
  NAV_ICON,
  NAV_COLLAPSE,
  HEADER_H,
  BTN,
  BTN_ACTIVE,
  BTN_PRIMARY,
  BTN_DANGER,
  BTN_ICON_GHOST,
  PANEL_HEADER_BTN,
  FIELD_SEARCH,
  FIELD_ROW,
  FIELD_ROW_LABEL,
  FIELD_ROW_VALUE,
  CHIP,
  TAG,
  BADGE,
  COUNT_PILL,
  CHECKBOX,
  SURFACE_HEADER,
  SURFACE_CHROME,
  SURFACE_BAR,
  SURFACE_CARD,
  CARD_HEADER,
  SURFACE_MENU,
  MENU_ITEM,
  TILE,
  PANEL_GROUP_LABEL,
  BREADCRUMB_PARENT,
  BREADCRUMB_SEP,
  CHART_SERIES,
  CHART_GRID,
  CHART_AXIS,
  CHART_INK,
  CHART_LEGEND,
  CHART_LEGEND_SWATCH,
} from "../../../src/design";
import { BADGE_TONE_CLASS } from "../../../src/badge-colours";
import { fieldInput } from "../../../src/components/field-controls";
import {
  Section,
  Anatomy,
  Verdict,
  CoreRule,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trash,
  X,
  Info,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from "../ui";

// ── The pieces, each copied from its component ─────────────────────────────

/** PanelNav → NavGroupLabel. h-9, full-bleed borders (-mx-2 cancels the p-2). */
function NavGroupLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <p className={`-mx-2 flex h-9 shrink-0 items-center border-neutral-200 px-4 text-xs font-semibold tracking-wide text-black uppercase ${first ? "-mt-2 border-b" : "border-y"}`}>
      {label}
    </p>
  );
}

/** PanelNav → PanelNavRow. */
function NavRow({ label, active, soon, badge, indent }: { label: string; active?: boolean; soon?: boolean; badge?: number; indent?: boolean }) {
  return (
    <button
      className={`${NAV_ITEM} flex w-full shrink-0 items-center justify-between pr-3 text-left ${indent ? "pl-8" : "pl-4"} ${
        active
          ? "bg-neutral-200 font-medium text-neutral-900"
          : soon
            ? "text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-600"
            : "text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-800"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="ml-2 shrink-0 text-right text-xs tabular-nums">
        {soon ? (
          <span className={`${TAG} bg-neutral-200 text-neutral-400`}>Soon</span>
        ) : badge !== undefined ? (
          <span className={`rounded px-1 text-xs ${active ? "bg-neutral-300 text-neutral-700" : "bg-neutral-200 text-neutral-500"}`}>{badge}</span>
        ) : null}
      </span>
    </button>
  );
}

/** PanelNav, expanded — w-48, collapse pinned at the very bottom. */
function PanelNavSpecimen() {
  return (
    <div className={`flex w-48 shrink-0 flex-col border-r border-neutral-200 ${SURFACE_CHROME}`}>
      <nav className={`flex min-h-0 flex-1 flex-col ${GAP} overflow-y-auto p-2`}>
        <NavGroupLabel label="Record" first />
        <NavRow label="Building info" active />
        <NavRow label="Tenure" />
        <NavGroupLabel label="Income" />
        <NavRow label="Leases" badge={7} />
        <NavRow label="Rent reviews" indent badge={2} />
        <NavRow label="Valuations" soon />
      </nav>
      <div className="shrink-0 border-t border-neutral-200">
        <button className={`${NAV_COLLAPSE} text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-800`}>
          <PanelLeftClose className={NAV_ICON} /> Collapse
        </button>
      </div>
    </div>
  );
}

/** PanelSubHeader — the one h-9 bar; context left, record actions right. */
function PanelSubHeaderSpecimen() {
  return (
    <div className={`flex h-9 shrink-0 items-center justify-between gap-panelgap border-b border-neutral-200 px-panelgap ${SURFACE_CHROME}`}>
      <span className={CHIP}>Scenario: Existing</span>
      <div className="flex min-w-0 shrink-0 items-center gap-panelgap">
        <span className="text-xs text-neutral-400">Saved</span>
        <button className={BTN}>Save</button>
        <button className={`flex items-center justify-center rounded text-neutral-500 ${PANEL_HEADER_BTN}`} aria-label="Delete record">
          <Trash />
        </button>
      </div>
    </div>
  );
}

/** FormField — label cell + white value cell holding a TRANSPARENT control. */
function FormFieldSpecimen({ label, children, info, invalid, labelWidth = "w-40" }: { label: string; children: React.ReactNode; info?: boolean; invalid?: boolean; labelWidth?: string }) {
  return (
    <div className={`${FIELD_ROW} ${invalid ? "border-red-200 ring-1 ring-inset ring-red-300" : ""}`}>
      <span className={`${labelWidth} ${FIELD_ROW_LABEL} ${invalid ? "border-red-200 bg-red-50 text-red-600" : ""}`}>
        <span className="truncate">{label}{invalid && " *"}</span>
        {info && <Info className="h-3 w-3 shrink-0 text-neutral-400" />}
      </span>
      <div className={FIELD_ROW_VALUE}>{children}</div>
    </div>
  );
}

/** The form block — ONE column, on the LEFT, ~a third of the width. */
function FormBlock({ labelWidth = "w-40" }: { labelWidth?: string }) {
  return (
    <div className={`${SURFACE_CARD} overflow-hidden`}>
      <FormFieldSpecimen label="Address" labelWidth={labelWidth}>
        <input className={fieldInput} defaultValue="12 King Street" />
      </FormFieldSpecimen>
      <FormFieldSpecimen label="Tenure" labelWidth={labelWidth} info>
        <input className={fieldInput} defaultValue="Freehold" />
      </FormFieldSpecimen>
      <FormFieldSpecimen label="Passing rent" labelWidth={labelWidth}>
        <input className={`${fieldInput} text-right tabular-nums`} defaultValue="£1,234,000" />
      </FormFieldSpecimen>
      <FormFieldSpecimen label="Next review" labelWidth={labelWidth}>
        <input className={fieldInput} defaultValue="25 Mar 2027" />
      </FormFieldSpecimen>
      <FormFieldSpecimen label="Use class" labelWidth={labelWidth} invalid>
        <input className={fieldInput} placeholder="Required" />
      </FormFieldSpecimen>
    </div>
  );
}

/** The right-hand side of a record: KPIs and charts, never a second form column. */
function ChartsSide() {
  return (
    <div className={`flex min-w-0 flex-1 flex-col ${GAP}`}>
      <div className={`flex ${GAP}`}>
        {[
          ["Passing rent", "£1.23m"],
          ["ERV", "£1.41m"],
          ["WAULT", "6.2 yrs"],
        ].map(([label, value]) => (
          <div key={label} className={`${TILE} flex-1`}>
            <div className="text-xs text-neutral-500">{label}</div>
            <div className="text-sm font-semibold tabular-nums">{value}</div>
          </div>
        ))}
      </div>
      <div className={`${SURFACE_CARD} overflow-hidden`}>
        <div className={CARD_HEADER}>Rent vs ERV by unit</div>
        <div className="p-3">
          <svg viewBox="0 0 340 150" className="w-full">
            {[0, 200, 400, 600].map((v) => (
              <g key={v}>
                <line x1="40" x2="334" y1={128 - (v / 640) * 112} y2={128 - (v / 640) * 112} stroke={v === 0 ? CHART_AXIS : CHART_GRID} strokeWidth="1" />
                <text x="36" y={131 - (v / 640) * 112} textAnchor="end" fontSize="10" fill={CHART_INK}>£{v}k</text>
              </g>
            ))}
            {[
              { label: "Ground", a: 480, b: 540 },
              { label: "First", a: 320, b: 330 },
              { label: "Second", a: 260, b: 300 },
              { label: "Third", a: 174, b: 190 },
            ].map((g, i) => {
              const x0 = 44 + i * 73 + 10;
              const h = (v: number) => (v / 640) * 112;
              return (
                <g key={g.label}>
                  <rect x={x0} y={128 - h(g.a)} width="22" height={h(g.a)} rx="2" fill={CHART_SERIES[0]} />
                  <rect x={x0 + 24} y={128 - h(g.b)} width="22" height={h(g.b)} rx="2" fill={CHART_SERIES[1]} />
                  <text x={x0 + 23} y="142" textAnchor="middle" fontSize="10" fill={CHART_INK}>{g.label}</text>
                </g>
              );
            })}
          </svg>
          <div className={`${CHART_LEGEND} mt-2`}>
            <span className="flex items-center gap-1.5"><span className={CHART_LEGEND_SWATCH} style={{ background: CHART_SERIES[0] }} />Passing rent</span>
            <span className="flex items-center gap-1.5"><span className={CHART_LEGEND_SWATCH} style={{ background: CHART_SERIES[1] }} />ERV</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── The page ───────────────────────────────────────────────────────────────

export default function AppComponents() {
  return (
    <>
      <CoreRule>
        <span className="font-semibold">Tokens make an element the right colour and size; components make a screen
        the right SHAPE.</span> These seven ship from <span className="font-mono text-[11px]">@gbrm/design</span> as of
        v0.4.0 — <span className="font-mono text-[11px]">EntityTable</span>, the panel stack
        (<span className="font-mono text-[11px]">PanelShell</span> / <span className="font-mono text-[11px]">PanelHeader</span> /{" "}
        <span className="font-mono text-[11px]">PanelLayout</span>), <span className="font-mono text-[11px]">Sheet</span>,{" "}
        <span className="font-mono text-[11px]">FormField</span>, <span className="font-mono text-[11px]">ColourBadge</span>,{" "}
        <span className="font-mono text-[11px]">Button</span> and <span className="font-mono text-[11px]">Dialog</span>. Re-implementing
        any of them in an app is drift, even if every token inside is correct.
      </CoreRule>

      <Section
        stack
        title="The record panel — the whole shape"
        note="A record is: a h-12 grey header band carrying the breadcrumb, then a side nav down the left, a h-9 sub-header, and the panel body. No horizontal tabs, no close/prev/next buttons. Panel width w-3/4; the backdrop stops at the main nav so the nav stays live behind an open record."
      >
        <Anatomy
          name="PanelStackRenderer + PanelLayout (PanelNav · PanelSubHeader · PanelBody)"
          rule="Read it top to bottom: header band (h-12, neutral-200, closed border-neutral-300) › side nav (neutral-100) + sub-header (h-9, neutral-100) › body (neutral-100, p-panelgap, white cards)."
        >
          <div className="overflow-hidden rounded-lg border border-neutral-300">
            {/* PanelStackRenderer's header band. */}
            <div className={`flex ${HEADER_H} shrink-0 items-center justify-between border-b border-neutral-300 ${SURFACE_HEADER} px-4`}>
              <div className="flex min-w-0 items-center">
                <button className={`max-w-48 truncate text-sm leading-none ${BREADCRUMB_PARENT}`}>Properties</button>
                <ChevronRight className={BREADCRUMB_SEP} />
                <h2 className="truncate text-sm leading-none font-semibold text-neutral-900">12 King Street</h2>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className={`${BADGE} ${BADGE_TONE_CLASS.emerald}`}>Let</span>
              </div>
            </div>
            {/* PanelLayout. */}
            <div className="flex h-[26rem] min-h-0">
              <PanelNavSpecimen />
              <div className="flex min-w-0 flex-1 flex-col">
                <PanelSubHeaderSpecimen />
                <div className="flex-1 overflow-y-auto bg-neutral-100 p-panelgap">
                  <div className={`flex ${GAP}`}>
                    <div className="w-1/3 shrink-0">
                      <FormBlock labelWidth="w-32" />
                    </div>
                    <ChartsSide />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Anatomy>
      </Section>

      <Section
        stack
        title="PanelLayout — side nav, sub-header, body"
        note="A record navigates DOWN its own left column, exactly like the main sidebar: same NAV_ITEM geometry, same 'active is a shade darker' rule, same Collapse pinned at the very bottom as a full-bleed h-9 row so both toggles sit level. There are NO horizontal tabs in a record."
      >
        <Anatomy name="PanelNav — expanded (w-48) and collapsed (w-9)" rule="Group labels are h-9 so they line up with the sub-header bar beside them. The first group drops its top border — the record header's rule already serves. Collapsed, the toggle stays at the bottom so it never moves.">
          <div className="flex h-72 items-stretch gap-6">
            <PanelNavSpecimen />
            <div className={`flex w-9 shrink-0 flex-col items-center justify-end border-r border-neutral-200 p-1 pb-2 ${SURFACE_CHROME}`}>
              <button className={BTN_ICON_GHOST} title="Expand navigation"><PanelLeftOpen className={NAV_ICON} /></button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col border border-neutral-200">
              <PanelSubHeaderSpecimen />
              <div className="flex-1 overflow-y-auto bg-neutral-100 p-panelgap">
                <div className={PANEL_GROUP_LABEL}>Planning and development</div>
                <div className={`${SURFACE_CARD} px-3 py-2 text-xs text-neutral-500`}>PanelBody — the panel surface, inset by the ONE gap, scrolling under a fixed sub-header. White cards sit inside it.</div>
              </div>
            </div>
          </div>
        </Anatomy>
      </Section>

      <Section
        stack
        title="The form block — ONE column, on the LEFT"
        note="A detail panel's FormFields sit in a single left column of roughly a third the width, as one compact block with no sub-headers. The right side carries charts and KPIs. One column, never two — a second column of fields halves the label width, doubles the eye's travel and leaves no room for the figures the record exists to show."
      >
        <Anatomy name="FormField block in PanelBody">
          <Verdict ok>one column, w-1/3, left; charts and KPIs take the rest</Verdict>
          <div className="flex gap-panelgap bg-neutral-100 p-panelgap">
            <div className="w-1/3 shrink-0"><FormBlock labelWidth="w-32" /></div>
            <ChartsSide />
          </div>
        </Anatomy>
        <Anatomy name="Banned — grid-cols-2 wrapping FormFields">
          <Verdict ok={false}>two columns of fields; nothing left for the figures. The drift guard fails this.</Verdict>
          <div className="bg-neutral-100 p-panelgap">
            <div className="grid grid-cols-2 gap-panelgap opacity-60">
              <div className={`${SURFACE_CARD} overflow-hidden`}>
                <FormFieldSpecimen label="Address" labelWidth="w-24"><input className={fieldInput} defaultValue="12 King Street" /></FormFieldSpecimen>
                <FormFieldSpecimen label="Tenure" labelWidth="w-24"><input className={fieldInput} defaultValue="Freehold" /></FormFieldSpecimen>
              </div>
              <div className={`${SURFACE_CARD} overflow-hidden`}>
                <FormFieldSpecimen label="Passing rent" labelWidth="w-24"><input className={fieldInput} defaultValue="£1,234,000" /></FormFieldSpecimen>
                <FormFieldSpecimen label="Next review" labelWidth="w-24"><input className={fieldInput} defaultValue="25 Mar 2027" /></FormFieldSpecimen>
              </div>
            </div>
          </div>
        </Anatomy>
      </Section>

      <Section
        stack
        title="FormField — the row anatomy"
        note="Grey uppercase label cell (fixed width, w-40 by default) + white value cell holding a TRANSPARENT control. The cell IS the field boundary — never a bordered input inside it. Info bubbles hang off the label; a missing required field turns the label cell red."
      >
        <Anatomy name="FIELD_ROW / FIELD_ROW_LABEL / FIELD_ROW_VALUE + fieldInput">
          <div className={`${SURFACE_CARD} max-w-md overflow-hidden`}>
            <FormFieldSpecimen label="Address"><input className={fieldInput} defaultValue="12 King Street" /></FormFieldSpecimen>
            <FormFieldSpecimen label="Tenure" info><input className={fieldInput} defaultValue="Freehold" /></FormFieldSpecimen>
            <FormFieldSpecimen label="Passing rent"><input className={`${fieldInput} text-right tabular-nums`} defaultValue="£1,234,000" /></FormFieldSpecimen>
            <FormFieldSpecimen label="Vacant"><input type="checkbox" className={CHECKBOX} /></FormFieldSpecimen>
            <FormFieldSpecimen label="Use class" invalid><input className={fieldInput} placeholder="Required" /></FormFieldSpecimen>
          </div>
        </Anatomy>
        <Anatomy name="Banned — a bordered FIELD inside the value cell">
          <Verdict ok={false}>a box inside a box; the cell already is the field</Verdict>
          <div className={`${SURFACE_CARD} max-w-md overflow-hidden opacity-60`}>
            <div className={FIELD_ROW}>
              <span className={`w-40 ${FIELD_ROW_LABEL}`}><span className="truncate">Address</span></span>
              <div className={FIELD_ROW_VALUE}>
                <input className="h-7 w-full rounded border border-neutral-300 bg-white px-2 text-xs" defaultValue="12 King Street" />
              </div>
            </div>
          </div>
        </Anatomy>
      </Section>

      <Section
        stack
        title="EntityTable — toolbar and column header"
        note="Every list of records renders through EntityTable; never hand-roll a table. Two stacked h-9 grey bars open the white card: the toolbar, then the column header row. The toolbar order is fixed on EVERY table and enforced by typed slots — add action first (top-left) → other actions → Views → Columns → grouped-by → filters/toggles → search alone at the right. A toggle NEVER sits between action buttons."
      >
        <Anatomy name="Toolbar bar (h-9, SURFACE_BAR) + column header row (h-9) + rows">
          <div className={`${SURFACE_CARD} overflow-hidden`}>
            <div className={`flex h-9 items-center gap-panelgap border-b border-neutral-200 ${SURFACE_BAR} px-panelgap`}>
              <button className={BTN_PRIMARY}><Plus />Add property</button>
              <button className={BTN}>Import</button>
              <button className={BTN_ACTIVE}>Views <span className={COUNT_PILL}>3</span></button>
              <button className={BTN}>Columns</button>
              <div className={`${CHIP} pr-1 pl-2.5`}>
                <Layers className="h-3 w-3" />
                <span>Grouped by <span className="font-medium text-neutral-900">Portfolio</span></span>
                <button className="inline-flex h-4 w-4 items-center justify-center rounded text-neutral-500 hover:bg-neutral-200" aria-label="Clear grouping"><X /></button>
              </div>
              <label className={`${BTN} cursor-pointer`}><input type="checkbox" className={CHECKBOX} defaultChecked />Show sample</label>
              <div className="relative ml-auto w-64">
                <Search className="absolute top-1.5 left-2.5 h-4 w-4 text-neutral-400" />
                <input className={FIELD_SEARCH} placeholder="Search properties…" />
              </div>
            </div>
            <table className="w-full table-fixed border-collapse text-xs">
              <thead className={SURFACE_BAR}>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="h-9 w-10 px-3 text-center"><input type="checkbox" className={`${CHECKBOX} align-middle`} /></th>
                  {[
                    { label: "Property", align: "left", sorted: "asc" },
                    { label: "Portfolio", align: "left" },
                    { label: "Status", align: "left", dot: true },
                    { label: "Passing rent", align: "right" },
                  ].map((c) => (
                    <th key={c.label} className={`relative h-9 cursor-grab px-3 ${c.align === "right" ? "text-right" : "text-left"}`}>
                      <div className={`flex items-center ${c.align === "right" ? "justify-end" : ""}`}>
                        <span className={`-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs font-semibold tracking-wide text-neutral-600 uppercase hover:bg-neutral-200/60 hover:text-neutral-900 ${c.align === "right" ? "flex-row-reverse" : ""}`}>
                          <span>{c.label}</span>
                          {c.sorted && <ChevronUp className="h-3 w-3" />}
                          {c.dot && <span className="h-1 w-1 rounded-full bg-neutral-900" />}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["12 King Street", "City Centre", "Let", "emerald", "£1,234,000"],
                  ["4 Mill Road", "Retail Park", "Under offer", "amber", "£412,500"],
                  ["Unit 7, Anchor Way", "Industrial", "Vacant", "neutral", "—"],
                ].map(([name, portfolio, status, tone, rent]) => (
                  <tr key={name} className="cursor-pointer border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-3 py-1.5 text-center"><input type="checkbox" className={`${CHECKBOX} align-middle`} /></td>
                    <td className="truncate px-3 py-1.5 font-medium">{name}</td>
                    <td className="truncate px-3 py-1.5 text-neutral-600">{portfolio}</td>
                    <td className="px-3 py-1.5"><span className={`${BADGE} ${BADGE_TONE_CLASS[tone as keyof typeof BADGE_TONE_CLASS]}`}>{status}</span></td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Anatomy>
        <Anatomy name="Selection — the SAME bar swaps in place, so the table never shifts">
          <div className={`${SURFACE_CARD} overflow-hidden`}>
            <div className={`flex h-9 items-center gap-panelgap border-b border-neutral-200 ${SURFACE_BAR} px-panelgap`}>
              <span className="px-1.5 text-xs font-medium tabular-nums text-neutral-700">2 properties selected</span>
              <button className={BTN}>Move to portfolio</button>
              <button className={BTN_DANGER}><Trash />Delete</button>
              <button className={BTN_ICON_GHOST} aria-label="Clear selection"><X /></button>
            </div>
          </div>
        </Anatomy>
        <Anatomy name="ColumnHeaderMenu — sort, filter and group all live in the column header, never in the toolbar">
          <div className={`${SURFACE_MENU} static w-56 text-neutral-700`}>
            <button className={MENU_ITEM}><ChevronUp className="h-3 w-3" /> Sort ascending</button>
            <button className={MENU_ITEM}><ChevronDown /> Sort descending</button>
            <button className={MENU_ITEM}><Layers className="h-3 w-3" /> Group by this column</button>
          </div>
        </Anatomy>
      </Section>

      <Section
        title="ColourBadge, Button, Dialog"
        note="ColourBadge is the ONE pill in a table cell — a tone from lib/badge-colours, never an ad-hoc class pair. The shadcn Button appears only in Dialog/Sheet footers; everywhere else it is BTN. DialogTitle is text-lg by default and call sites never set a size."
      >
        <div className="flex w-full flex-col gap-4">
          <Anatomy name="ColourBadge — the 11 tones">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(BADGE_TONE_CLASS) as Array<keyof typeof BADGE_TONE_CLASS>).map((tone) => (
                <span key={tone} className={`${BADGE} ${BADGE_TONE_CLASS[tone]}`}>{tone}</span>
              ))}
            </div>
          </Anatomy>
          <Anatomy name="Dialog — centred, text-lg title, footer holds the only shadcn Buttons" rule="Delete always confirms here. Escape closes the top-most layer.">
            <div className="w-96 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg leading-none font-medium">Delete 2 properties?</h2>
                <p className="text-xs text-neutral-500">This cannot be undone. Their leases and valuations are deleted with them.</p>
              </div>
              <div className="-mx-4 -mb-4 mt-4 flex justify-end gap-2 rounded-b-xl border-t border-neutral-200 bg-neutral-50 p-4">
                <button className="h-8 rounded-lg px-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Cancel</button>
                <button className="h-8 rounded-lg bg-red-50 px-2.5 text-sm font-medium text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </Anatomy>
        </div>
      </Section>
    </>
  );
}
