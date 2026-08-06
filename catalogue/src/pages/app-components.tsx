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
  NAV_PAD,
  NAV_GROUP_LABEL,
  NAV_GROUP_RULE,
  NAV_USER,
  NAV_ITEM_INSET,
  NAV_ITEM_INSET_NESTED,
  NAV_ACTIVE,
  NAV_IDLE,
  NAV_MUTED,
  NAV_COUNT,
  SURFACE_NAV,
  BRAND_ACTIVE,
  BRAND_IDLE,
  BRAND_MUTED,
  BRAND_BORDER,
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
} from "../../../src/design";
import { BADGE_TONE_CLASS } from "../../../src/badge-colours";
import { fieldInput } from "../../../src/components/field-controls";
import {
  Section,
  Anatomy,
  GroupedBarChart,
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

/** MainNav → one row. L8: 24px in, 36px nested, measured from the nav's edge.
 *  States are translucent overlays, so they hold on any brand colour. */
function MainNavRow({ label, active, soon, indent }: { label: string; active?: boolean; soon?: boolean; indent?: boolean }) {
  return (
    <div
      className={`${NAV_ITEM} shrink-0 gap-2 ${indent ? NAV_ITEM_INSET_NESTED : NAV_ITEM_INSET} ${
        soon ? `cursor-not-allowed ${BRAND_MUTED}` : active ? BRAND_ACTIVE : BRAND_IDLE
      }`}
    >
      <span className={`${NAV_ICON} rounded-sm bg-current opacity-60`} />
      <span className="flex-1 truncate">{label}</span>
      {soon && <span className={`shrink-0 text-xs uppercase tracking-wide ${BRAND_MUTED}`}>Soon</span>}
    </div>
  );
}

/** MainNav, expanded — w-52. App band, groups, wordmark, user, collapse. */
function MainNavSpecimen() {
  return (
    <div className={`flex h-[30rem] w-52 shrink-0 flex-col ${SURFACE_NAV}`}>
      <div className={`flex ${HEADER_H} shrink-0 items-center gap-2.5 border-b ${BRAND_BORDER} px-3`}>
        <div className="h-7 w-7 shrink-0 rounded-md bg-black/25" />
        <span className="truncate text-sm leading-none font-semibold tracking-tight text-white">Property Manager</span>
      </div>
      <nav className={`flex min-h-0 flex-1 flex-col gap-panelgap overflow-y-auto py-panelgap ${NAV_PAD}`}>
        <MainNavRow label="Dashboard" active />
        <MainNavRow label="Portfolios" />
        <MainNavRow label="Properties" />
        <p className={`${NAV_GROUP_LABEL} ${BRAND_MUTED}`}>CRM</p>
        <MainNavRow label="Organisations" />
        <MainNavRow label="Contacts" />
        <MainNavRow label="Key contacts" indent />
        <p className={`${NAV_GROUP_LABEL} ${BRAND_MUTED}`}>Admin</p>
        <MainNavRow label="Settings" />
        <MainNavRow label="Audit log" soon />
      </nav>
      <div className={`shrink-0 border-t ${BRAND_BORDER} p-panelgap`}>
        <div className={`${NAV_USER} px-2`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-xs font-semibold text-white">JM</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/90">Joe Millson</p>
            <p className={`truncate text-xs ${BRAND_MUTED}`}>GBRM</p>
          </div>
        </div>
      </div>
      <button className={`${NAV_COLLAPSE} shrink-0 border-t ${BRAND_BORDER} ${BRAND_IDLE}`}>
        <PanelLeftClose className={NAV_ICON} /> Collapse
      </button>
    </div>
  );
}

/** MainNav, collapsed — the one w-12 rail. */
function MainNavCollapsedSpecimen() {
  return (
    <div className={`flex h-[30rem] w-12 shrink-0 flex-col ${SURFACE_NAV}`}>
      <div className={`flex ${HEADER_H} shrink-0 items-center justify-center border-b ${BRAND_BORDER}`}>
        <div className="h-7 w-7 shrink-0 rounded-md bg-black/25" />
      </div>
      <nav className={`flex min-h-0 flex-1 flex-col gap-panelgap overflow-y-auto py-panelgap ${NAV_PAD}`}>
        {/* Row for row, this column matches the expanded nav beside it —
            same h-6 items, and the group rules take the h-9 the labels had. */}
        {[true, false, false].map((a, i) => (
          <div key={i} className={`${NAV_ITEM} shrink-0 justify-center px-0 ${a ? BRAND_ACTIVE : BRAND_IDLE}`}>
            <span className={`${NAV_ICON} rounded-sm bg-current opacity-60`} />
          </div>
        ))}
        <div className={NAV_GROUP_RULE}>
          <span className={`w-full border-t ${BRAND_BORDER}`} />
        </div>
        {[false, false, false].map((_, i) => (
          <div key={i} className={`${NAV_ITEM} shrink-0 justify-center px-0 ${BRAND_IDLE}`}>
            <span className={`${NAV_ICON} rounded-sm bg-current opacity-60`} />
          </div>
        ))}
        <div className={NAV_GROUP_RULE}>
          <span className={`w-full border-t ${BRAND_BORDER}`} />
        </div>
        {[false, false].map((_, i) => (
          <div key={i} className={`${NAV_ITEM} shrink-0 justify-center px-0 ${BRAND_IDLE}`}>
            <span className={`${NAV_ICON} rounded-sm bg-current opacity-60`} />
          </div>
        ))}
      </nav>
      <div className={`shrink-0 border-t ${BRAND_BORDER} p-panelgap`}>
        <div className={`${NAV_USER} justify-center px-0`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-xs font-semibold text-white">JM</div>
        </div>
      </div>
      <button className={`${NAV_COLLAPSE} shrink-0 justify-center border-t !px-0 ${BRAND_BORDER} ${BRAND_IDLE}`}>
        <PanelLeftOpen className={NAV_ICON} />
      </button>
    </div>
  );
}

/** PanelNav → NavGroupLabel. h-9, full-bleed borders (-mx-panelgap cancels
 *  NAV_PAD). Lands on L8's 12px, the same line as the main nav's. */
function NavGroupLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <p className={`-mx-panelgap ${NAV_GROUP_LABEL} border-neutral-200 text-black ${first ? "-mt-2 border-b" : "border-y"}`}>
      {label}
    </p>
  );
}

/** PanelNav → PanelNavRow. L8: 24px in, 36px nested. */
function NavRow({ label, active, soon, badge, indent }: { label: string; active?: boolean; soon?: boolean; badge?: number; indent?: boolean }) {
  return (
    <button
      className={`${NAV_ITEM} w-full shrink-0 justify-between text-left ${indent ? NAV_ITEM_INSET_NESTED : NAV_ITEM_INSET} ${
        active ? NAV_ACTIVE : soon ? NAV_MUTED : NAV_IDLE
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="ml-2 shrink-0">
        {soon ? (
          <span className={`${TAG} bg-neutral-200 text-neutral-400`}>Soon</span>
        ) : badge !== undefined ? (
          <span className={`${NAV_COUNT} ${active ? "text-neutral-500" : ""}`}>{badge}</span>
        ) : null}
      </span>
    </button>
  );
}

/** PanelNav, expanded — w-48, collapse pinned at the very bottom. */
function PanelNavSpecimen() {
  return (
    <div className={`flex w-48 shrink-0 flex-col border-r border-neutral-200 ${SURFACE_CHROME}`}>
      <nav className={`flex min-h-0 flex-1 flex-col ${GAP} overflow-y-auto py-2 ${NAV_PAD}`}>
        <NavGroupLabel label="Record" first />
        <NavRow label="Building info" active />
        <NavRow label="Tenure" />
        <NavGroupLabel label="Income" />
        <NavRow label="Leases" badge={7} />
        <NavRow label="Rent reviews" indent badge={2} />
        <NavRow label="Valuations" soon />
      </nav>
      <button className={`${NAV_COLLAPSE} shrink-0 border-t border-neutral-200 ${NAV_IDLE}`}>
        <PanelLeftClose className={NAV_ICON} /> Collapse
      </button>
    </div>
  );
}

/** PanelNav, collapsed — the same h-9 toggle under the same border-t, so it
 *  sits at exactly the height it does when expanded. */
function PanelNavCollapsedSpecimen() {
  return (
    <div className={`flex w-9 shrink-0 flex-col border-r border-neutral-200 ${SURFACE_CHROME}`}>
      <div className="min-h-0 flex-1" />
      <button className={`${NAV_COLLAPSE} shrink-0 justify-center border-t border-neutral-200 !px-0 ${NAV_IDLE}`} title="Expand navigation">
        <PanelLeftOpen className={NAV_ICON} />
      </button>
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
        <input className={`${fieldInput} tabular-nums`} defaultValue="£1,234,000" />
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
          <GroupedBarChart
            height={150}
            max={640}
            ticks={[0, 200, 400, 600]}
            fmt={(v) => `£${v}k`}
            series={["Passing rent", "ERV"]}
            data={[
              { label: "Ground", a: 480, b: 540 },
              { label: "First", a: 320, b: 330 },
              { label: "Second", a: 260, b: 300 },
              { label: "Third", a: 174, b: 190 },
            ]}
          />
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
        <span className="font-mono text-[11px]">Button</span> and <span className="font-mono text-[11px]">Dialog</span>.{" "}
        <span className="font-mono text-[11px]">MainNav</span> joined them in v0.6.0. Re-implementing
        any of them in an app is drift, even if every token inside is correct.
      </CoreRule>

      <Section
        stack
        title="MainNav — the app sidebar"
        note="The last chrome each app was still hand-rolling, and it had drifted: Property Manager's items sat 24px from the edge under a header at 20px, Project Manager's sat at 12px with no indent at all, with 16px vs 8px between groups and 64px vs 48px collapsed rails. Both passed the drift guard, because nothing governed the shape. Apps now pass groups, items and their router's link element — and no spacing at all."
      >
        <Anatomy
          name="MainNav — expanded (w-52) and collapsed (w-12)"
          rule="L8: the group header sits 12px from the nav's edge, its items 24px, a nested item 36px — items are always INDENTED under their header. Groups are separated by their h-9 header and the ONE 4px gap, never a bigger margin. Soon items sink to the foot of their group. The user panel is always directly above the collapse row, and the collapse row is always last. Collapsing changes the WIDTH only: hold a ruler across the two columns below and every row lines up, because each has a fixed height rather than one derived from its contents — a group label's h-9 becomes a divider of the same h-9, not a thin rule."
        >
          <div className={`flex ${GAP} overflow-hidden rounded-lg border border-neutral-300`}>
            <MainNavSpecimen />
            <MainNavCollapsedSpecimen />
            <div className="flex flex-1 items-center p-4 text-xs text-neutral-600">
              <span>
                MainNav publishes the live width (13rem expanded, 3rem collapsed) as the CSS variable the panels read,
                so a detail panel sits flush against the nav in either state. An app that forgot to do this left its
                panels overlapping the nav — which is the other half of why the sidebar is now a component and not a
                per-app file.
              </span>
            </div>
          </div>
        </Anatomy>

        <Anatomy
          name="BRAND_ACTIVE / BRAND_IDLE / BRAND_MUTED / BRAND_BORDER"
          rule="The GAP between idle and active is the rule. Property Manager had it right — muted grey idle against a white active row, so the selection reads at a glance. Project Manager's idle was near-white, almost as bright as its active row, so nothing looked selected. These are tokens now, translucent white overlays carrying Property Manager's contrast onto any brand hue: a fixed zinc only lands when the brand happens to be near-black. Note the direction — the main nav is the darkest surface in the app, so its active row LIFTS rather than darkening; everywhere else a selected state goes a shade darker."
        >
          <div className="flex flex-col gap-3">
            <Verdict ok>a clear gap — the active row is white and lifted, idle is muted, on any brand colour</Verdict>
            <div className={`flex ${GAP}`}>
              {["#09090b", "#134e4a", "#3f1d38"].map((bg) => (
                <div key={bg} className="flex flex-1 flex-col gap-panelgap rounded py-panelgap" style={{ backgroundColor: bg }}>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} ${BRAND_ACTIVE}`}>Properties — active</div>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} ${BRAND_IDLE}`}>Portfolios — idle</div>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} ${BRAND_IDLE}`}>Contacts — idle</div>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} ${BRAND_MUTED}`}>Group label — muted</div>
                </div>
              ))}
            </div>

            <Verdict ok={false}>idle almost as bright as active — nothing reads as selected</Verdict>
            <div className={`flex ${GAP}`}>
              {["#09090b", "#134e4a", "#3f1d38"].map((bg) => (
                <div key={bg} className="flex flex-1 flex-col gap-panelgap rounded py-panelgap opacity-90" style={{ backgroundColor: bg }}>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} bg-white/12 font-medium text-white`}>Properties — active</div>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} text-zinc-200`}>Portfolios — idle</div>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} text-zinc-200`}>Contacts — idle</div>
                  <div className={`${NAV_ITEM} ${NAV_ITEM_INSET} text-zinc-500`}>Group label — muted</div>
                </div>
              ))}
            </div>
          </div>
        </Anatomy>
      </Section>

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
        <Anatomy name="PanelNav — expanded (w-48) and collapsed (w-9)" rule="Group labels are h-9 so they line up with the sub-header bar beside them. The first group drops its top border — the record header's rule already serves. Collapsed, the toggle is the SAME full-bleed h-9 row under the SAME border-t, so it sits at exactly the height it does expanded. Same three state tokens as the main nav (NAV_ACTIVE / NAV_IDLE / NAV_MUTED) — only the direction flips, because this surface is light, so the active row goes a shade darker instead of lifting. A trailing count is plain muted numerals (NAV_COUNT), never a filled pill: at pill grey it looked exactly like the active row's background, so an idle row read as selected.">
          <div className="flex h-72 items-stretch gap-6">
            <PanelNavSpecimen />
            <PanelNavCollapsedSpecimen />
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
            <FormFieldSpecimen label="Passing rent"><input className={`${fieldInput} tabular-nums`} defaultValue="£1,234,000" /></FormFieldSpecimen>
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
                    { label: "Property", sorted: true },
                    { label: "Portfolio" },
                    { label: "Status", dot: true },
                    { label: "Passing rent" },
                  ].map((c) => (
                    <th key={c.label} className="relative h-9 cursor-grab px-3 text-left">
                      <div className="flex items-center">
                        <span className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs font-semibold tracking-wide text-neutral-600 uppercase hover:bg-neutral-200/60 hover:text-neutral-900">
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
                    <td className="px-3 py-1.5 tabular-nums">{rent}</td>
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
