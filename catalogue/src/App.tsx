// The catalogue — renders every token in ../../src/design.ts from the WORKING
// COPY, so a token edit shows here live (npm run dev) before it is tagged and
// released. The page itself follows the system: grey chrome, white cards,
// h-12 header band. If an app screen doesn't match this page, the screen is
// wrong.
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
  SECTION_LABEL,
  TOOLTIP,
  CHECKBOX,
  PANEL_TITLE,
  BREADCRUMB_PARENT,
  BREADCRUMB_SEP,
  TILE,
} from "../../src/design";

// Tiny inline icons — the apps use lucide; the catalogue stays dependency-free.
const icon = "h-3.5 w-3.5";
const Plus = () => (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
const Search = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
);
const ChevronDown = () => (
  <svg className="h-3.5 w-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className ?? icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
);
const Trash = () => (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2m1 0-1 14H8L7 6" /></svg>
);
const X = () => (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);

/** One specimen: the rendered element with its token name underneath. */
function Spec({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start">{children}</div>
      <div className="font-mono text-[10px] text-neutral-400">{name}</div>
    </div>
  );
}

/** One catalogue section: white card, grey uppercase header strip. */
function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className={`${SURFACE_CARD} overflow-hidden`}>
      <div className={CARD_HEADER}>{title}</div>
      {note && <div className="border-b border-neutral-100 px-3 py-2 text-xs text-neutral-500">{note}</div>}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 p-4">{children}</div>
    </section>
  );
}

export default function App() {
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

      <main className="mx-auto flex max-w-5xl flex-col gap-panelgap p-panelgap pb-16">
        <div className="px-px py-2 text-xs text-neutral-600">
          <span className="font-semibold">The core rule:</span> anything you can click or edit sits on a white background
          with a border, on grey chrome. Interactive = white. Static chrome = grey. Active/selected = a shade darker than
          its surface, never white, never a dark fill.
        </div>

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
      </main>
    </div>
  );
}
