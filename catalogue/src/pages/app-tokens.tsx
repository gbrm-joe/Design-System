// The Application system → Tokens. Every token the manager apps compose.
// Its siblings under Application: Components (the v0.4.0 shared components)
// and Layout (where the blocks sit).
import {
  GAP,
  CONTROL_H,
  BAR_H,
  HEADER_H,
  NAV_ITEM,
  BTN,
  BTN_PRIMARY,
  BTN_ACTIVE,
  BTN_DANGER,
  BTN_ICON,
  BTN_ICON_GHOST,
  PANEL_HEADER_BTN,
  FIELD,
  FIELD_SEARCH,
  FIELD_TRIGGER,
  SEGMENTED,
  SEGMENTED_BTN,
  SEGMENTED_BTN_ACTIVE,
  FIELD_ROW,
  FIELD_ROW_LABEL,
  FIELD_ROW_VALUE,
  CHIP,
  TAG,
  TAG_COLOR,
  TAG_NUMERIC,
  COUNT_PILL,
  BADGE,
  SURFACE_NAV,
  SURFACE_HEADER,
  SURFACE_CHROME,
  SURFACE_BAR,
  SURFACE_CARD,
  SURFACE_CARD_MUTED,
  CARD_HEADER,
  SURFACE_MENU,
  MENU_ITEM,
  SURFACE_EMPTY,
  SKELETON,
  SECTION_LABEL,
  TOOLTIP,
  CHECKBOX,
  PANEL_TITLE,
  BREADCRUMB_PARENT,
  BREADCRUMB_SEP,
  TILE,
  CHART_SERIES,
  DELTA_POS,
  DELTA_NEG,
} from "../../../src/design";
import { Spec, Section, GroupedBarChart, CoreRule, Plus, Search, ChevronDown, ChevronRight, Trash, X } from "../ui";

export default function AppSystem() {
  return (
    <>
      <CoreRule>
        <span className="font-semibold">The core rule:</span> anything you can click or edit sits on a white background
        with a border, on grey chrome. Interactive = white. Static chrome = grey. Active/selected = a shade darker than
        its surface, never white, never a dark fill.
      </CoreRule>

      <Section
        title="Scale"
        note="One gap (4px), one control height (28px), one bar height (36px), one top band (48px). Three text sizes: text-xs data, text-sm chrome/titles, text-lg dialog titles."
      >
        <Spec name={`GAP = "${GAP}"`}>
          <div className={`flex ${GAP}`}>
            <div className="h-7 w-7 rounded bg-neutral-300" />
            <div className="h-7 w-7 rounded bg-neutral-300" />
            <div className="h-7 w-7 rounded bg-neutral-300" />
          </div>
        </Spec>
        <Spec name={`CONTROL_H = "${CONTROL_H}"`}>
          <div className="flex h-7 items-center rounded border border-neutral-300 bg-white px-2.5 text-xs">28px control</div>
        </Spec>
        <Spec name={`BAR_H = "${BAR_H}"`}>
          <div className={`flex ${BAR_H} items-center rounded border border-neutral-200 bg-neutral-50 px-2 text-xs text-neutral-500`}>36px bar — an h-7 control insets 4px</div>
        </Spec>
        <Spec name={`HEADER_H = "${HEADER_H}"`}>
          <div className={`flex ${HEADER_H} items-center rounded bg-neutral-200 px-3 text-sm font-semibold`}>48px top band</div>
        </Spec>
      </Section>

      <Section
        title="Buttons"
        note="Four styles, no fifth. Every control carries border-neutral-300. The lead action is white like every button — prominence is position (first) + the Plus icon. No dark fills, ever."
      >
        <Spec name="BTN_PRIMARY">
          <button className={BTN_PRIMARY}><Plus />Add property</button>
        </Spec>
        <Spec name="BTN">
          <button className={BTN}>Columns</button>
        </Spec>
        <Spec name="BTN_ACTIVE (toggle on)">
          <button className={BTN_ACTIVE}>Views <span className={COUNT_PILL}>3</span></button>
        </Spec>
        <Spec name="BTN_DANGER">
          <button className={BTN_DANGER}>Delete</button>
        </Spec>
        <Spec name="BTN_ICON">
          <button className={BTN_ICON} aria-label="Next"><ChevronRight /></button>
        </Spec>
        <Spec name="BTN_ICON_GHOST">
          <button className={BTN_ICON_GHOST} aria-label="Clear"><X /></button>
        </Spec>
        <Spec name="PANEL_HEADER_BTN (on the header band)">
          <div className="flex h-11 items-center rounded bg-neutral-200 px-3">
            <button className={`flex items-center justify-center rounded text-neutral-500 ${PANEL_HEADER_BTN}`} aria-label="Delete record"><Trash /></button>
          </div>
        </Spec>
      </Section>

      <Section
        title="Fields"
        note="Editable = white, bordered, h-7, text-xs. A native select only where options are plain text; styled options use FIELD_TRIGGER + SURFACE_MENU."
      >
        <Spec name="FIELD">
          <input className={`${FIELD} w-44`} placeholder="Passing rent pa" />
        </Spec>
        <Spec name="FIELD_SEARCH">
          <div className="relative w-52">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input className={FIELD_SEARCH} placeholder="Search properties…" />
          </div>
        </Spec>
        <Spec name="FIELD_TRIGGER">
          <button className={`${FIELD_TRIGGER} w-44 justify-between`}>Existing<ChevronDown /></button>
        </Spec>
        <Spec name="SEGMENTED / _BTN / _BTN_ACTIVE">
          <div className={SEGMENTED}>
            <button className={SEGMENTED_BTN}>Year</button>
            <button className={SEGMENTED_BTN_ACTIVE}>Quarter</button>
            <button className={SEGMENTED_BTN}>Month</button>
          </div>
        </Spec>
        <Spec name="CHECKBOX">
          <label className="flex h-7 items-center gap-2 text-xs"><input type="checkbox" defaultChecked className={CHECKBOX} />Show sample</label>
        </Spec>
        <Spec name="FIELD_ROW / _LABEL / _VALUE (the FormField anatomy)">
          <div className={`${SURFACE_CARD} w-80 overflow-hidden`}>
            <div className={FIELD_ROW}>
              <div className={`${FIELD_ROW_LABEL} w-32`}>Address</div>
              <div className={FIELD_ROW_VALUE}><span className="text-xs">12 King Street</span></div>
            </div>
            <div className={FIELD_ROW}>
              <div className={`${FIELD_ROW_LABEL} w-32`}>Passing rent</div>
              <div className={FIELD_ROW_VALUE}><span className="text-xs tabular-nums">£1,234,000</span></div>
            </div>
            <div className={FIELD_ROW}>
              <div className={`${FIELD_ROW_LABEL} w-32`}>Next review</div>
              <div className={FIELD_ROW_VALUE}><span className="text-xs">25 Mar 2027</span></div>
            </div>
          </div>
        </Spec>
      </Section>

      <Section
        title="Tags, chips and pills"
        note="TAG is the tiny uppercase marker (colour carries meaning); BADGE is the full-word rounded-full pill in table cells — distinct on purpose. Badge tones live per-app."
      >
        <Spec name="TAG + TAG_COLOR (8 tones)">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(TAG_COLOR) as Array<keyof typeof TAG_COLOR>).map((tone) => (
              <span key={tone} className={`${TAG} ${TAG_COLOR[tone]}`}>{tone}</span>
            ))}
          </div>
        </Spec>
        <Spec name="TAG_NUMERIC">
          <span className={`${TAG_NUMERIC} ${TAG_COLOR.emerald}`}>92</span>
        </Spec>
        <Spec name="CHIP">
          <span className={CHIP}>Scenario: Existing</span>
        </Spec>
        <Spec name="COUNT_PILL (inside a button)">
          <button className={BTN}>Views <span className={COUNT_PILL}>3</span></button>
        </Spec>
        <Spec name="BADGE (tones per-app)">
          <div className="flex gap-1.5">
            <span className={`${BADGE} bg-emerald-100 text-emerald-700`}>Let</span>
            <span className={`${BADGE} bg-amber-100 text-amber-700`}>Under offer</span>
            <span className={`${BADGE} bg-neutral-100 text-neutral-600`}>Vacant</span>
          </div>
        </Spec>
      </Section>

      <Section
        title="Surfaces — darker up the hierarchy"
        note="Nav (brand, darkest) → header band (neutral-200) → chrome/panel body (neutral-100) → in-table bar (neutral-50) → white card, where data lives. Headers are never white."
      >
        <Spec name="SURFACE_NAV → HEADER → CHROME → BAR → CARD">
          <div className="w-72 overflow-hidden rounded-lg border border-neutral-200">
            <div className={`${SURFACE_NAV} px-3 py-2 text-xs text-neutral-100`}>SURFACE_NAV — brand colour</div>
            <div className={`${SURFACE_HEADER} px-3 py-2 text-xs text-neutral-700`}>SURFACE_HEADER — neutral-200</div>
            <div className={`${SURFACE_CHROME} px-3 py-2 text-xs text-neutral-600`}>SURFACE_CHROME / _PANEL — neutral-100</div>
            <div className={`${SURFACE_BAR} px-3 py-2 text-xs text-neutral-500`}>SURFACE_BAR — neutral-50</div>
            <div className="bg-white px-3 py-2 text-xs">SURFACE_CARD — white, data lives here</div>
          </div>
        </Spec>
        <Spec name="SURFACE_CARD_MUTED + CARD_HEADER">
          <div className={`${SURFACE_CARD_MUTED} w-64`}>
            <div className={CARD_HEADER}>Financing</div>
            <div className="bg-white px-3 py-2 text-xs">White rows sit inside the grey frame.</div>
          </div>
        </Spec>
        <Spec name="SURFACE_MENU + MENU_ITEM">
          <div className={`${SURFACE_MENU} static w-44`}>
            <button className={MENU_ITEM}>Rename view</button>
            <button className={MENU_ITEM}>Duplicate</button>
            <button className={`${MENU_ITEM} text-red-600`}>Delete</button>
          </div>
        </Spec>
        <Spec name="SURFACE_EMPTY">
          <div className={`${SURFACE_EMPTY} w-64 py-6`}>No leases yet</div>
        </Spec>
        <Spec name="SKELETON — the loading state is the shape that is coming">
          {/* Drawn in the columns the rows will use, at the row height they
              will have, so nothing moves when the data lands. A spinner over a
              blank area would hide all of that. */}
          <div className={`${SURFACE_CARD} w-96 divide-y divide-neutral-100`}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex h-8 items-center gap-3 px-3">
                <span className={`${SKELETON} h-2.5 w-10`} />
                <span className={`${SKELETON} h-2.5 flex-1`} />
                <span className={`${SKELETON} h-2.5 w-16`} />
              </div>
            ))}
          </div>
        </Spec>
        <Spec name="TILE (read-only, so grey) — band of flex-1 with GAP">
          <div className={`flex w-96 ${GAP}`}>
            {[
              ["Passing rent", "£1,234,000"],
              ["ERV", "£1,410,500"],
              ["WAULT", "6.2 yrs"],
            ].map(([label, value]) => (
              <div key={label} className={`${TILE} flex-1`}>
                <div className="text-xs text-neutral-500">{label}</div>
                <div className="text-sm font-semibold tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </Spec>
        <Spec name="TOOLTIP">
          <div className={`${TOOLTIP} static max-w-56`}>ERV — estimated rental value at today's market rents.</div>
        </Spec>
      </Section>

      <Section
        title="Navigation and structure"
        note="One nav item size everywhere. Active = a shade darker than its surface, never white. One breadcrumb style: muted clickable parent › dark title — never a slash or back-arrow."
      >
        <Spec name="NAV_ITEM on SURFACE_CHROME (active = neutral-200)">
          <div className={`${SURFACE_CHROME} flex w-48 flex-col ${GAP} rounded-lg border border-neutral-200 p-2`}>
            <a className={`${NAV_ITEM} px-2 text-neutral-600 hover:bg-neutral-200/60`}>Building info</a>
            <a className={`${NAV_ITEM} bg-neutral-200 px-2 font-medium text-neutral-900`}>Leases</a>
            <a className={`${NAV_ITEM} px-2 text-neutral-600 hover:bg-neutral-200/60`}>Valuations</a>
          </div>
        </Spec>
        <Spec name="BREADCRUMB_PARENT / _SEP / PANEL_TITLE">
          <div className="flex items-center text-sm">
            <a className={BREADCRUMB_PARENT} href="#top">Properties</a>
            <ChevronRight className={BREADCRUMB_SEP} />
            <span className={PANEL_TITLE}>12 King Street</span>
          </div>
        </Spec>
        <Spec name="SECTION_LABEL">
          <div className={SECTION_LABEL}>Planning and development</div>
        </Spec>
      </Section>

      <Section
        title="Graphics and dashboards"
        note="A dashboard is a page like any other: h-12 band, KPI figures as ONE band of grey TILEs (no icons, no accent colours), every chart in a card under a CARD_HEADER. Series colours in FIXED order — the first series is always blue; a filter never repaints survivors. One y-axis, ever. Chart text never wears a series colour."
      >
        <Spec name="CHART_SERIES (fixed order, validated for colour-vision + contrast)">
          <div className="flex gap-1.5">
            {CHART_SERIES.map((hex, i) => (
              <div key={hex} className="flex flex-col items-center gap-1">
                <div className="h-7 w-10 rounded" style={{ background: hex }} />
                <div className="font-mono text-[10px] text-neutral-400">{i + 1}</div>
              </div>
            ))}
          </div>
        </Spec>
        <Spec name="Chart idiom — grid CHART_GRID, baseline CHART_AXIS, ink CHART_INK, 2px gaps, legend below">
          <div className={`${SURFACE_CARD} w-96 overflow-hidden`}>
            <div className={CARD_HEADER}>Passing rent vs ERV by portfolio</div>
            <div className="p-3">
              <GroupedBarChart
                max={32}
                ticks={[0, 10, 20, 30]}
                fmt={(v) => `£${v}m`}
                series={["Passing rent", "ERV"]}
                data={[
                  { label: "City Centre", a: 28.5, b: 31.0 },
                  { label: "Retail Park", a: 16.2, b: 17.5 },
                  { label: "Mixed-Use", a: 6.9, b: 8.1 },
                  { label: "Industrial", a: 12.0, b: 12.6 },
                ]}
              />
            </div>
          </div>
        </Spec>
        <Spec name="DELTA_POS / DELTA_NEG (no green; red carries a real minus)">
          <div className="flex items-center gap-4 rounded border border-neutral-200 bg-white px-3 py-2">
            <span className="text-xs text-neutral-500">Passing rent</span>
            <span className={DELTA_POS}>+4.2%</span>
            <span className="text-xs text-neutral-500">Capital value</span>
            <span className={DELTA_NEG}>−1.8%</span>
          </div>
        </Spec>
        <Spec name="Dashboard anatomy — h-12 band, TILE band, chart cards; GAP throughout">
          <div className="w-96 overflow-hidden rounded-lg border border-neutral-300">
            <div className="flex h-9 items-center border-b border-neutral-300 bg-neutral-200 px-2 text-xs font-semibold">Dashboard</div>
            <div className="flex flex-col gap-panelgap bg-neutral-100 p-panelgap">
              <div className="flex gap-panelgap">
                {[
                  ["Passing rent", "£3.20m"],
                  ["Net Initial Yield", "6.2%"],
                  ["WAULT", "5.4 yrs"],
                ].map(([label, value]) => (
                  <div key={label} className={`${TILE} flex-1 !px-2 !py-1.5`}>
                    <div className="text-xs text-neutral-500">{label}</div>
                    <div className="text-sm font-semibold tabular-nums">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-panelgap">
                {["Running yield profile", "Lease expiries"].map((title) => (
                  <div key={title} className={`${SURFACE_CARD} flex-1 overflow-hidden`}>
                    <div className={`${CARD_HEADER} !px-2 !py-1`}>{title}</div>
                    <div className="m-2 h-12 rounded bg-neutral-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Spec>
      </Section>
    </>
  );
}
