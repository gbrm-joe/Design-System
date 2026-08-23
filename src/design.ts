// ---------------------------------------------------------------------------
// design.ts — the single source of truth for element styling across the
// manager apps, shipped to each as the @gbrm/design package.
//
// Every styleable primitive is defined ONCE here as a class-string constant.
// Call sites import and compose these; they do not write control styling
// longhand. The style-guide catalogue renders everything in this file for
// review — if an element on a screen doesn't match it, the screen is wrong.
//
// THE CORE RULE (Joe, 2026-08-04): anything you can click or edit sits on a
// WHITE background with a border, on grey chrome, so it stands out.
// Interactive = white. Static chrome = grey.
//
// See DESIGN_SYSTEM.md in this repo for the rulebook.
// ---------------------------------------------------------------------------

// ── Scale ──────────────────────────────────────────────────────────────────
// The numbers live in css/theme.css (--spacing-panelgap, --breakpoint-desk).
// One gap, one control height, one bar height — no ad-hoc sizes.

/** The ONE gap between controls, cards and stacked sections: 4px. */
export const GAP = "gap-panelgap";
/** The ONE height for controls on a toolbar/chrome row: 28px. */
export const CONTROL_H = "h-7";
/** The ONE height for chrome bars — table toolbar, column header row, panel
 *  sub-header: 36px. An h-7 control inside gets an even 4px inset. */
export const BAR_H = "h-9";
/** The ONE height for the app's top band: the sidebar's app-name header AND
 *  every page-title band share it, so the page title centres level with the
 *  app name and the content below starts exactly on the sidebar header's
 *  bottom border line. */
export const HEADER_H = "h-12";
/** The ONE horizontal inset for a HEADER_H band: 16px. The arithmetic IS the
 *  rule — content below a band is inset by the one gap (4px, L5) and a card's
 *  own text sits 12px inside that, so 16px puts a band's title on the exact
 *  vertical line as the first value beneath it. Every band uses it: the
 *  page-title band, the record header, PanelHeader.
 *
 *  Nothing said this before, so Project Manager gave its page title the 4px
 *  page inset — the title jammed against the nav under 14px of air above and
 *  below, aligned with nothing (Joe, 2026-08-16). A band's height and its
 *  inset are one decision; they now live in one place. */
export const HEADER_PAD = "px-4";
/** Nav items — ONE size for every navigation list, main sidebar and panel
 *  side navs alike: 13px text, a FIXED h-6 row, 4px (GAP) between items.
 *  Colours come from the surface; geometry never varies. Sub side navs inside
 *  detail records are collapsible, like the main nav.
 *
 *  The height is FIXED, not derived from padding, and that is the point: a
 *  collapsed row holds only a 12px icon, so a py-1 row shrank to 20px while
 *  its expanded twin sat at 24px. Rows then failed to line up between the two
 *  states and the error accumulated down the column, so collapsing the nav
 *  visibly shifted everything below it (Joe, 2026-08-06). Collapsing changes
 *  the nav's WIDTH. Nothing moves vertically. */
export const NAV_ITEM =
  "flex h-6 items-center rounded text-[13px] leading-tight transition-colors";
/** Nav item icons — one size everywhere (12px), set here not per-icon. */
export const NAV_ICON = "h-3 w-3 shrink-0";
/** The nav's own horizontal padding — the ONE gap (L5), so an active row's
 *  rounded pill has 4px of breathing room and never collides with the edge. */
export const NAV_PAD = "px-panelgap";
/** The ONE nav indent (L8). Measured FROM THE NAV'S EDGE: a group header sits
 *  at 12px, its items at 24px, a nested item at 36px — items are always
 *  INDENTED under their header, never flush with it. (The class values below
 *  are the ROW's own padding; NAV_PAD's 4px makes up the difference.)
 *  Two apps hand-rolled this and landed on 24px vs 12px with no indent at all
 *  (Joe, 2026-08-06), which is why the geometry now lives in a token and a
 *  component rather than in each app's sidebar. */
export const NAV_GROUP_INSET = "px-2";
export const NAV_ITEM_INSET = "pl-5 pr-3";
export const NAV_ITEM_INSET_NESTED = "pl-8 pr-3";
/** A nav group header. Geometry only; the colour comes from the surface —
 *  BRAND_MUTED on the main nav, neutral on a panel's. h-9 matches the
 *  sub-header bar so a main-nav group label and a panel's line up. */
export const NAV_GROUP_LABEL =
  `flex h-9 shrink-0 items-center text-xs font-semibold uppercase tracking-wide ${NAV_GROUP_INSET}`;
/** What a group header becomes when the nav is COLLAPSED: the label can't be
 *  read at 48px, so it turns into a rule — but it keeps the label's h-9, so
 *  every row below it stays exactly where it was. A short divider here is why
 *  the collapsed rail used to drift out of step with the expanded one. */
export const NAV_GROUP_RULE = "flex h-9 shrink-0 items-center px-2";
/** The signed-in user row above the collapse control. Fixed height, because
 *  expanded it holds two lines of text and collapsed it holds only the
 *  avatar — without this the footer sits at two different heights. */
export const NAV_USER =
  "flex h-10 w-full items-center gap-2 rounded transition-colors";

// The main nav wears the unit's BRAND colour (--sidebar-bg), which can be any
// hue, so its states can't be a fixed zinc — a hard-coded bg-zinc-800 only
// lands correctly when the brand happens to be near-black. They are
// translucent white overlays instead, which hold on every brand colour.
//
// NOTE the direction. Elsewhere a selected state is a shade DARKER than its
// surface (neutral-200 on the neutral-100 panel nav). The main nav is the
// darkest surface in the app, so there is no darker to go to: on near-black,
// a darker overlay is invisible. It lifts instead. Both apps had already
// worked this out independently — each used zinc-800 on a zinc-950 nav, a
// LIGHTER active row — so the values below reproduce that, generalised to any
// hue. The principle is a step of CONTRAST from the surface: darker on a
// light nav, lighter on a dark one.
//
// The idle/active GAP is the point. Property Manager had it right (zinc-400
// idle against a near-white active); Project Manager's idle was zinc-200,
// almost as bright as its active row, so nothing read as selected (Joe,
// 2026-08-06). These values are Property Manager's, as overlays.
// The SAME three states, on the light navs (the panel side nav). Only the
// direction flips — this surface is light, so the active row goes a shade
// DARKER. The relationship is identical to the brand nav's and it is written
// once, here, rather than as a class string inside each nav: idle is clearly
// muted, active is the strongest thing in the column, muted (Soon) is
// quieter than idle.
/** Active row on a light nav — a shade darker than the nav, never white. */
export const NAV_ACTIVE = "bg-neutral-200 font-medium text-neutral-900";
/** Idle row on a light nav, and its hover. */
export const NAV_IDLE =
  "text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900";
/** Not-yet-built rows on a light nav — quieter again than idle. */
export const NAV_MUTED = "text-neutral-400";
/** A trailing count in a nav row (Leases 7). Deliberately NOT COUNT_PILL: a
 *  filled pill inside a nav row reads as a second control, and at the pill's
 *  own grey it looks exactly like the ACTIVE row's background — so an idle
 *  row appeared to be selected (Joe, 2026-08-06). In a nav the count is plain
 *  muted numerals; the pill form is for table cells and lists, where there is
 *  no row-level state to compete with. */
export const NAV_COUNT =
  "shrink-0 text-[10px] font-semibold leading-none tabular-nums text-neutral-400";

/** Active main-nav row — a step lighter, ≈zinc-800 on a near-black nav. */
export const BRAND_ACTIVE = "bg-white/12 font-medium text-white";
/** Idle main-nav row and its hover. The text is CLEARLY muted against the
 *  active row's white — that gap is what makes a selection legible. */
export const BRAND_IDLE = "text-white/60 hover:bg-white/6 hover:text-white";
/** Muted lettering on the brand surface — group labels, Soon, the user's
 *  sub-line. Quieter again than an idle row: ≈zinc-500. */
export const BRAND_MUTED = "text-white/45";
/** Dividers on the brand surface (header band, user panel, collapse row). */
export const BRAND_BORDER = "border-white/15";
/** Collapse control — every side nav (main sidebar and panel sub navs) pins
 *  its Collapse at the VERY bottom, below the scrollable list, as a full-bleed
 *  border-t h-9 row (the sub-nav group-header height), so the toggles on both
 *  navs sit level. In the main nav the signed-in user panel sits directly
 *  ABOVE it — the collapse is always the last thing in the column. Geometry
 *  lives here; colours come from the surface. */
export const NAV_COLLAPSE =
  "flex h-9 w-full shrink-0 items-center gap-2 px-3 text-[13px] transition-colors";
// Text: data and labels are text-xs (12px). text-sm is chrome (titles, nav)
// only. text-lg is page titles only. Enforced by the primitives below.

// ── Buttons ────────────────────────────────────────────────────────────────
// Four button styles exist. There is no fifth. The shadcn <Button> appears
// only in Dialog/Sheet footers (Save/Cancel), never on a toolbar row.
//
// RULE: every interactive control — button, field, select, segmented toggle —
// carries the SAME border, border-neutral-300. Never border-neutral-200 on a
// control (it disappears against neutral-200 chrome) and never borderless.

/** The standard button: white, bordered, h-7. */
export const BTN =
  "flex h-7 items-center gap-1.5 rounded border border-neutral-300 bg-white px-2.5 text-xs font-medium whitespace-nowrap text-neutral-600 transition-colors hover:border-neutral-400";

/** The lead action (Add …/New …) — always first on its bar. DECIDED (Joe,
 *  2026-08-04): white like every button — no dark fill; prominence comes from
 *  position (always first) and the Plus icon. Kept as its own name so the
 *  lead action stays semantically marked. */
export const BTN_PRIMARY = BTN;

/** Destructive action — selection-bar Delete and confirm contexts only. */
export const BTN_DANGER =
  "flex h-7 items-center gap-1.5 rounded border border-red-600 bg-red-600 px-2.5 text-xs font-medium text-white hover:bg-red-500";

/** A toolbar toggle in its ON state (Views with a view applied, Show sample
 *  on): the SAME white surface — the dark border marks the state, because dark
 *  fills are not a button style. Pair with BTN: `active ? BTN_ACTIVE : BTN`. */
export const BTN_ACTIVE =
  "flex h-7 items-center gap-1.5 rounded border border-neutral-900 bg-white px-2.5 text-xs font-medium whitespace-nowrap text-neutral-900 transition-colors";

/** Square icon button (column nav, panel chevrons at toolbar scale). */
export const BTN_ICON =
  "flex h-7 w-7 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-100";

/** Header-band square button (Delete — the only header square; see the
 *  no-close/prev/next decision below) — BTN_ICON geometry plus a shadow to
 *  lift it off the grey band. Rendered through the shadcn Button (variant
 *  ghost, size icon-sm), so only the box styling lives here. */
export const PANEL_HEADER_BTN = "size-7 border border-neutral-300 bg-white shadow-sm";

// DECIDED (Joe, 2026-08-04): no close/prev/next buttons in any header —
// cross-record navigation lives in the table; Escape / backdrop / breadcrumb
// close. The retired size-9 PANEL_NAV_BTN is gone with them; Delete (the one
// remaining header square) uses PANEL_HEADER_BTN.

/** Ghost square icon button — dismiss/clear affordances inside a bar. */
export const BTN_ICON_GHOST =
  "flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800";

// ── Fields ─────────────────────────────────────────────────────────────────
// Editable values: white, bordered, text-xs. DECIDED (Joe, 2026-08-04): one
// height everywhere — h-7, same as every other control. (Forms still written
// longhand at h-8 move over in the plan-03 sweep.)

/** Form field (text/number/currency/date/select). */
export const FIELD =
  "h-7 w-full rounded border border-neutral-300 bg-white px-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none";

/** Toolbar search field — pl-8 leaves room for the leading Search icon. */
export const FIELD_SEARCH =
  "h-7 w-full rounded border border-neutral-300 bg-white pl-8 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none";

// ── Segmented control ──────────────────────────────────────────────────────
// A white bordered box of exclusive options (the Model grain toggle:
// Year / Quarter / Month). h-7 like every control.

/** The segmented container — options sit inside with a 2px inset. */
export const SEGMENTED =
  "flex h-7 items-center gap-1 rounded border border-neutral-300 bg-white p-0.5";
/** One option, off. h-full: the option fills the box's height so the inset
 *  above the pill equals the p-0.5 inset beside it — no py, or the pill
 *  floats with a bigger top gap than side gap. rounded-xs (2px): the pill sits
 *  2px inside the box's 4px corner, so inner radius = outer − inset to keep
 *  the corners concentric. */
export const SEGMENTED_BTN =
  "flex h-full items-center rounded-xs px-2 text-xs font-medium transition-colors text-neutral-500 hover:bg-neutral-100";
/** One option, on. DECIDED (Joe, 2026-08-04): the ACTIVE rule is the nav rule
 *  — a shade darker than its surface, never white, never a dark fill. On the
 *  white segmented box that is bg-neutral-200. */
export const SEGMENTED_BTN_ACTIVE =
  "flex h-full items-center rounded-xs px-2 text-xs font-medium transition-colors bg-neutral-200 text-neutral-900";

// ── Field rows (the FormField anatomy) ─────────────────────────────────────
// THE label/value row every panel form is built from: grey uppercase label
// cell on the left, white value cell on the right, hairline neutral-100
// dividers (the row sits INSIDE a card — the card border is the outer edge,
// so the internal lines stay lighter than control borders). The value cell
// holds a TRANSPARENT control; the cell IS the field boundary.
// Always render through components/ui/form-field.tsx — never hand-roll a row.

/** The row: label cell + value cell, hairline divider to the next row. */
export const FIELD_ROW = "flex items-stretch border-b border-neutral-100 last:border-b-0";
/** The label cell (width set per panel, w-40 default). */
export const FIELD_ROW_LABEL =
  "flex shrink-0 items-center gap-1 border-r border-neutral-100 bg-neutral-50 px-3 py-2 text-xs font-medium uppercase tracking-wide whitespace-nowrap text-neutral-400";
/** The white value cell. */
export const FIELD_ROW_VALUE = "flex flex-1 items-center bg-white px-2 py-1.5";

// ── Chips and tags ─────────────────────────────────────────────────────────

/** Static read-only pill on a bar (scenario chip, grouped-by): grey tint. */
export const CHIP =
  "flex h-7 items-center gap-1.5 rounded border border-neutral-300 bg-neutral-100 px-2 text-xs text-neutral-700";

/** Tiny uppercase status tag (EXISTING, PROPOSED, SOON, Snapshot…).
 *  Compose as `${TAG} ${TAG_COLOR.emerald}` — colour carries the meaning. */
export const TAG = "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase";
export const TAG_COLOR = {
  neutral: "bg-neutral-100 text-neutral-500",
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  red: "bg-red-100 text-red-700",
  green: "bg-green-100 text-green-700",
} as const;

/** TAG carrying a figure (comparable score, EPC number): fixed min width,
 *  centred, tabular. Compose with TAG_COLOR like TAG. */
export const TAG_NUMERIC =
  "inline-block min-w-[2rem] rounded px-1.5 py-0.5 text-center text-[10px] font-semibold tabular-nums";

/** Tiny rounded-full count pill inside a button (Views 3, Columns 8). */
export const COUNT_PILL =
  "rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-neutral-500";

/** Rounded-full status/category pill in table cells and lists — normal case,
 *  text-xs, pale fill. Tones live in lib/badge-colours.ts; render ONLY through
 *  the shared ColourBadge. TAG is the tiny uppercase marker; BADGE is the
 *  full-word pill — the two are distinct on purpose. */
export const BADGE =
  "inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-xs font-medium";

// ── Surfaces ───────────────────────────────────────────────────────────────
// The ladder darkens UP the hierarchy: the brand-coloured main nav is
// darkest, then header bands, then panel chrome/body, then bars, and the
// white card — where data lives — is the lightest. "Chrome" = the app's frame
// (navigation, headers, bars); content is what you read and edit.
// Active side-nav items are a SHADE DARKER than their nav (bg-neutral-200 on
// the 100 nav) — never white; white is reserved for editable/clickable
// CONTROLS, not selection states.

/** Main navigation — the signed-in unit's brand colour (settings → branding),
 *  falling back to near-black. The darkest surface in the app. */
export const SURFACE_NAV = "bg-[var(--sidebar-bg,#09090b)]";
/** Top header bands — the record header and Sheet panel header. One step
 *  darker than the side nav beneath them. */
export const SURFACE_HEADER = "bg-neutral-200";

/** THE page-title band (L2). Every page in every app opens with this and
 *  nothing else: one h-12 grey band, one centred text-sm line, closed with a
 *  bottom border, inset by HEADER_PAD — title (or breadcrumb) left, page
 *  actions right. Composed here rather than left to each app, because the band
 *  is the one piece of page chrome no shipped component owned: an app could
 *  import MainNav, EntityTable and the panel stack, pass every token check,
 *  and still put its page title 4px from the nav. */
export const PAGE_HEADER =
  "flex h-12 shrink-0 items-center justify-between gap-2 border-b border-neutral-300 bg-neutral-200 px-4";
/** The page title itself — ONE line, text-sm, level with the app name in the
 *  nav band beside it. Never a hero size, never with a subtitle under it. */
export const PAGE_TITLE = "min-w-0 truncate text-sm font-semibold leading-none text-neutral-900";
/** Panel chrome: the panel's side nav and sub-header — one step lighter than
 *  the header band above. Its dividers use border-neutral-200. */
export const SURFACE_CHROME = "bg-neutral-100";
/** Detail-panel body. Same grey as the chrome beside it — the border-r
 *  separates them; the ladder's steps are nav → header → chrome/body. */
export const SURFACE_PANEL = "bg-neutral-100";
/** In-table bars: toolbar bar, column header row. */
export const SURFACE_BAR = "bg-neutral-50";
/** The white card — data lives here. The bottom of the ladder. */
export const SURFACE_CARD = "rounded-lg border border-neutral-200 bg-white";

/** Grey section card — a card that FRAMES content (a table, a form block)
 *  rather than being the data surface itself; its white rows/cells sit inside.
 *  overflow-hidden so inner bars meet the rounded corner cleanly. */
export const SURFACE_CARD_MUTED =
  "overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50";

/** Card header strip — the grey uppercase title band across the top of a
 *  card (Report sections, financing tables). */
export const CARD_HEADER =
  "border-b border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-600";

/** Dropdown/popover surface (Views, Columns, autocomplete, add-menus).
 *  Position (absolute/top/width) stays at the call site. */
export const SURFACE_MENU =
  "z-30 rounded border border-neutral-200 bg-white py-1 shadow-lg";

/** One row in a dropdown menu. */
export const MENU_ITEM =
  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-neutral-50";

/** Select-style trigger — a FIELD-shaped button that opens a SURFACE_MENU of
 *  MENU_ITEMs (the scenario switcher). RULE: a native <select> only where the
 *  options are plain text; the moment an option carries styling (a pill, an
 *  icon) use this trigger + SURFACE_MENU — the OS menu can't be styled and
 *  never matches the field's radius. Trailing chevron: ChevronDown h-3.5
 *  text-neutral-400. */
export const FIELD_TRIGGER =
  "flex h-7 w-full items-center gap-1.5 rounded border border-neutral-300 bg-white px-1.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none";

/** Dashed empty-state box ("No leases yet"). Padding stays local — hero empty
 *  states breathe (py-12), in-card ones don't (py-6). */
export const SURFACE_EMPTY =
  "rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center text-xs text-neutral-400";

/** The ONE loading placeholder — a grey bar standing in for a value that has
 *  not arrived. Size it at the call site to the shape that is coming (a cell's
 *  width, a tile's value line, a chart's box) so nothing moves when the data
 *  lands. A spinner over a blank content area is not this: it hides the shape
 *  instead of showing it, and the page jumps when it clears (2026-08-17). */
export const SKELETON = "animate-pulse rounded bg-neutral-200";

/** Mini uppercase section heading INSIDE a card or table. DECIDED (Joe,
 *  2026-08-04): text-[11px] is retired — text-xs like every label; hierarchy
 *  comes from placement, not another size. */
export const SECTION_LABEL =
  "text-xs font-semibold uppercase tracking-wide text-neutral-500";

/** The dark hover/click tooltip bubble (field info tips, collapsed-nav
 *  labels). Position stays at the call site. */
export const TOOLTIP =
  "z-50 rounded-md bg-neutral-900 px-3 py-2 text-xs leading-snug font-normal text-white shadow-lg";

/** The one checkbox: 14px square, dark accent. DECIDED 2026-08-04: one accent
 *  (neutral-800) — three shades had crept in. */
export const CHECKBOX = "h-3.5 w-3.5 cursor-pointer rounded border-neutral-300 accent-neutral-800";

/** Detail/edit panel title (PanelHeader and the stacked-panel header). */
export const PANEL_TITLE = "text-sm font-semibold text-neutral-900";

// ── Breadcrumb ─────────────────────────────────────────────────────────────
// ONE breadcrumb style everywhere (Joe, 2026-08-04): muted clickable parent
// › ChevronRight › dark title. Never a slash or a back-arrow. The current
// (last) segment is the header title itself (PANEL_TITLE dark).

/** A parent segment — muted, clickable back. */
export const BREADCRUMB_PARENT =
  "shrink-0 font-normal text-neutral-400 transition-colors hover:text-neutral-700 hover:underline";
/** The separator — classes for a lucide <ChevronRight>. */
export const BREADCRUMB_SEP = "mx-0.5 h-3.5 w-3.5 shrink-0 text-neutral-300";

/** Group label between cards in a data panel (e.g. "Planning and
 *  Development"): pl-px lines the text up with the cards' left edge (their
 *  1px border), and mb-panelgap puts the standard GAP below — the parent
 *  stack's own GAP provides the same space above, so the label sits with
 *  EQUAL gaps to the cards on both sides. */
export const PANEL_GROUP_LABEL = `mb-panelgap pl-px ${SECTION_LABEL}`;

// ── KPI tiles ──────────────────────────────────────────────────────────────
// A headline figure on a white card: text-xs grey label over a text-sm
// tabular value. Tiles sit in a band of equal widths (flex-1) with GAP
// between; a band is OPTIONAL — only where a section has headline figures.

/** One KPI tile. Band: `<div className="flex gap-panelgap">` of flex-1 tiles.
 *  DECIDED (Joe, 2026-08-04): tiles are read-only, so they are GREY — white
 *  is for editable/clickable surfaces only. This is THE one KPI tile; the
 *  dashboard's card-based tile and any local variants compose it. */
export const TILE = "rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2";

// ── Charts and dashboards ──────────────────────────────────────────────────
// A dashboard is a page like any other: the standard h-12 title band (no hero
// titles), KPI figures as ONE band of grey TILEs, and every chart inside a
// SURFACE_CARD under a CARD_HEADER strip. Charts render as SVG, so series and
// chrome colours are hex, not classes.
//
// RULES (DESIGN_SYSTEM.md → Graphics and dashboards):
// - Series take CHART_SERIES colours in FIXED order — never cycled, never
//   re-assigned when a filter changes the series count. More than 4 series
//   fold into "Other" or split into small multiples.
// - ONE y-axis. Never a dual-axis chart — two measures of different scale get
//   two charts side by side.
// - Horizontal gridlines only (CHART_GRID); baseline CHART_AXIS; all chart
//   text 12px CHART_INK. Adjacent and stacked fills keep a 2px white gap —
//   it is also the palette's colour-vision relief.
// - Two or more series always get a legend (CHART_LEGEND); a single series is
//   named by the card header — no legend.
// - Deltas follow the figure rule: DELTA_POS is plain ink (green-for-positive
//   is banned), DELTA_NEG is red WITH a minus sign — never colour alone.

/** Categorical series colours, FIXED order (validated 2026-08-05 for
 *  colour-vision separation and ≥3:1 contrast on the white card; slots 1–3
 *  also validate all-pairs for scatter forms). Family: blue-600, orange-600,
 *  emerald-600, amber-600, violet-700, green-700. */
export const CHART_SERIES = [
  "#2563eb",
  "#ea580c",
  "#059669",
  "#d97706",
  "#6d28d9",
  "#15803d",
] as const;

/** Horizontal gridlines — hairline, neutral-200. */
export const CHART_GRID = "#e5e5e5";
/** Baseline/axis line — neutral-300. */
export const CHART_AXIS = "#d4d4d4";
/** Axis ticks and in-chart labels — neutral-500 ink, 12px like all data. */
export const CHART_INK = "#737373";
/** The ONE plot height inside a chart card. */
export const CHART_HEIGHT = "h-64";

/** Legend row under the plot: swatch + name per series, text-xs muted. */
export const CHART_LEGEND =
  "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500";
/** Legend swatch — 8px square, background from CHART_SERIES. */
export const CHART_LEGEND_SWATCH = "h-2 w-2 shrink-0 rounded-[2px]";

/** Positive change figure — plain ink. No green celebration. */
export const DELTA_POS = "text-xs tabular-nums text-neutral-600";
/** Negative change figure — red, and the figure carries a minus sign. */
export const DELTA_NEG = "text-xs tabular-nums text-red-600";

// ── Print — documents and reports ──────────────────────────────────────────
// The system's SECOND medium: A4 documents generated from app data (reports,
// schedules, statements). Page geometry lives in css/print.css (@page A4
// portrait, 15mm margins) — import "@gbrm/design/print.css" from the report's
// stylesheet.
//
// The core rule translated to paper: there is no interaction on paper, so
// ink-on-white with hairline structure replaces interactive-white-on-grey.
// RULES:
// - Fills never exceed neutral-100 — paper is white, toner is dear. Structure
//   comes from hairlines, not grey bands.
// - Type is measured in pt. THREE sizes, no exceptions: 9pt data/labels,
//   12pt section headings, 18pt document title (once, page one).
// - Colour only where it carries meaning: CHART_SERIES in charts (the palette
//   is validated on white) and red negatives. Never decorative.
// - Screen conventions ride along: em dash for zero/absent, DD MMM YYYY,
//   £1,234 with tabular-nums, negatives red with a REAL minus sign.
// - Every table/figure block avoids page-break inside (PRINT_AVOID_BREAK);
//   a table's totals row closes with a heavy rule.

/** The document root: white, dark ink, 9pt body. */
export const PRINT_PAGE = "bg-white text-[9pt] leading-relaxed text-neutral-900";
/** Document title — 18pt, once, at the top of page one. */
export const PRINT_TITLE = "text-[18pt] leading-tight font-semibold text-neutral-900";
/** The meta line under the title: source app · period · generated date. */
export const PRINT_META = "text-[9pt] text-neutral-500";
/** Section heading — 12pt, closed with a hairline rule. */
export const PRINT_SECTION =
  "border-b border-neutral-300 pb-1 text-[12pt] font-semibold text-neutral-900";
/** Uppercase field/column label — 9pt like all data, muted. */
export const PRINT_LABEL =
  "text-[9pt] font-medium uppercase tracking-wide text-neutral-500";
/** A headline-figure box: bordered, NO fill (the toner rule). */
export const PRINT_TILE = "rounded border border-neutral-300 px-3 py-2";
/** Data table — full width, collapsed hairlines. */
export const PRINT_TABLE = "w-full border-collapse text-[9pt]";
/** Column header cell: uppercase muted label over a mid-weight rule. */
export const PRINT_TH =
  "border-b border-neutral-400 px-2 py-1 text-left text-[9pt] font-semibold uppercase tracking-wide text-neutral-500";
/** Body cell: hairline row dividers only — no vertical rules, no zebra. */
export const PRINT_TD = "border-b border-neutral-200 px-2 py-1 align-top";
/** Totals row — closes the table with a heavy rule, bold figures. */
export const PRINT_ROW_TOTAL = "border-t-2 border-neutral-900 font-semibold";
/** Running footer: document title left, "Page X of Y" right. */
export const PRINT_FOOTER =
  "flex items-center justify-between border-t border-neutral-300 pt-2 text-[9pt] text-neutral-500";
/** Keep a block (table, chart card, figure band) on one page. */
export const PRINT_AVOID_BREAK = "break-inside-avoid";
/** Start a new page (a new top-level section). */
export const PRINT_PAGE_BREAK = "break-before-page";

// ── Website — the marketing front end ──────────────────────────────────────
// The system's THIRD medium: the public site for the apps. Same family,
// different posture — the page is for READING, not editing, so the ground is
// WHITE and grey bands (neutral-50, WEB_SECTION_ALT) alternate sections: the
// inverse of the app's grey-chrome/white-card stack. Cards and secondary
// buttons keep the app's bordered language.
//
// ONE deliberate inversion (2026-08-05): the website allows a single
// dark-fill button — WEB_BTN_CTA — because a marketing page has one job and
// its lead action must dominate. Dark fills remain BANNED in the apps.
// RULES:
// - FOUR text sizes: display (5xl), section title (3xl), body (base),
//   small (sm). Nothing between.
// - One CTA style per page view; every other action is WEB_BTN (white,
//   bordered). Never two dark buttons side by side.
// - Sections alternate white / neutral-50; a grey band carries border-y
//   hairlines. No other background colours.
// - Charts/figures shown on the site follow the app's chart rules verbatim.

/** Page-width container — one measure everywhere. */
export const WEB_CONTAINER = "mx-auto w-full max-w-5xl px-6";
/** Site header: white, hairline bottom, sticky. Inner row is h-16. */
export const WEB_NAV = "sticky top-0 z-40 border-b border-neutral-200 bg-white";
/** Header/footer text link. */
export const WEB_NAV_LINK =
  "text-sm text-neutral-600 transition-colors hover:text-neutral-900";
/** A page section — one vertical rhythm. */
export const WEB_SECTION = "py-20";
/** The alternating grey band section. */
export const WEB_SECTION_ALT = "border-y border-neutral-200 bg-neutral-50 py-20";
/** Hero headline — the one 5xl line. */
export const WEB_DISPLAY = "text-5xl font-semibold tracking-tight text-neutral-900";
/** Section headline. */
export const WEB_SECTION_TITLE =
  "text-3xl font-semibold tracking-tight text-neutral-900";
/** Small uppercase kicker above a headline. */
export const WEB_EYEBROW =
  "text-sm font-semibold uppercase tracking-wide text-neutral-500";
/** Body copy — muted ink, generous leading. */
export const WEB_BODY = "text-base leading-relaxed text-neutral-600";
/** Small print / captions. */
export const WEB_SMALL = "text-sm text-neutral-500";
/** THE call to action — the website's one permitted dark fill. */
export const WEB_BTN_CTA =
  "inline-flex h-10 items-center gap-2 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-700";
/** Every other website button: white, bordered — the app's language. */
export const WEB_BTN =
  "inline-flex h-10 items-center gap-2 rounded-md border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400";
/** Feature/pricing card — the app's white card, roomier padding. */
export const WEB_CARD = "rounded-lg border border-neutral-200 bg-white p-6";
/** Site footer — dark, mirroring the app's darkest surface. */
export const WEB_FOOTER = "bg-neutral-900 py-12 text-sm text-neutral-400";

// ── Exemptions (deliberate, not drift) ─────────────────────────────────────
// - Auth screens (login / forgot / reset password) — outside the app chrome.
// - The legacy print report (rpt-* classes) — pre-dates the PRINT_* tokens
//   above; migrates to them, per app, when each report is next touched.
// - Devtools overlays (src/devtools).
// - The Model grid footer tiles — grey like the grid's calculated rows; white
//   is reserved for input cells there (see property-panel).
// Dialog conventions: DialogTitle is text-lg (baked into ui/dialog.tsx — no
// per-site size classes); the shadcn Button appears ONLY in Dialog/Sheet
// footers. Transparent in-cell form controls live in ui/field-controls.ts
// (fieldInput/fieldSelect) — the FormField cell is the border, so those
// controls are borderless by design.
