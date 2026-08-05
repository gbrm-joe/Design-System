// ---------------------------------------------------------------------------
// design.ts — the single source of truth for element styling across the GBRM
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
/** Nav items — ONE size for every navigation list, main sidebar and panel
 *  side navs alike: 13px text, slim py-1 rows, 4px (GAP) between items.
 *  Colours come from the surface; geometry never varies. Sub side navs inside
 *  detail records are collapsible, like the main nav. */
export const NAV_ITEM = "rounded py-1 text-[13px] leading-tight transition-colors";
/** Nav item icons — one size everywhere (12px), set here not per-icon. */
export const NAV_ICON = "h-3 w-3 shrink-0";
/** Collapse control — every side nav (main sidebar and panel sub navs) pins
 *  its Collapse at the VERY bottom, below the scrollable list, as a full-bleed
 *  border-t h-9 row (the sub-nav group-header height), so the toggles on both
 *  navs sit level. In the main nav the signed-in user panel sits directly
 *  ABOVE it — the collapse is always the last thing in the column. Geometry
 *  lives here; colours come from the surface. */
export const NAV_COLLAPSE =
  "flex h-9 w-full shrink-0 items-center gap-2 px-4 text-[13px] transition-colors";
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

// ── Exemptions (deliberate, not drift) ─────────────────────────────────────
// - Auth screens (login / forgot / reset password) — outside the app chrome.
// - The print report (rpt-* classes) — a different medium.
// - Devtools overlays (src/devtools).
// - The Model grid footer tiles — grey like the grid's calculated rows; white
//   is reserved for input cells there (see property-panel).
// Dialog conventions: DialogTitle is text-lg (baked into ui/dialog.tsx — no
// per-site size classes); the shadcn Button appears ONLY in Dialog/Sheet
// footers. Transparent in-cell form controls live in ui/field-controls.ts
// (fieldInput/fieldSelect) — the FormField cell is the border, so those
// controls are borderless by design.
