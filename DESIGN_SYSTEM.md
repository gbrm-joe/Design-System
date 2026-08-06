# Design System

The shared rulebook across THREE media: the **manager apps**, **print**
(documents and reports generated from app data) and the **website** (the
public marketing front end). One family; each medium translates the core rule
to its own surface. The single source of truth for element styling is
**`src/design.ts`** in this repo — class-string primitives every call site
composes, shipped to each app as the **`@gbrm/design`** package. `npm run check:design` (the packaged drift guard) fails an app's
build on hand-rolled control styling. The catalogue (`catalogue/` in this
repo — `npm run dev`) renders every primitive from the working copy of the
tokens and is the reference rendering; if a screen doesn't match it, the
screen is wrong. History and rationale live in Property Manager's
DECISIONS.md, where the system was first built; each app keeps its own
navigation/interaction spec.

## The core rule

**Anything you can click or edit sits on a white background with a border, on
grey chrome.** Interactive = white. Static chrome = grey. "Chrome" = the app's
frame — navigation, headers, sub-headers, toolbars — as opposed to content.

## Scale

| Token | Value | Meaning |
|---|---|---|
| `GAP` | 4 px (`gap-panelgap`) | The ONE gap — between controls, cards, stacked sections, nav items |
| `CONTROL_H` | 28 px (`h-7`) | The ONE control height — buttons, fields, chips, selects |
| `BAR_H` | 36 px (`h-9`) | The ONE bar height — table toolbar, column headers, sub-header |
| `HEADER_H` | 48 px (`h-12`) | The ONE top-band height — sidebar app header, page-title band, record header. One CENTRED `leading-none` line each; labels float above, breadcrumbs inline; titles are `text-sm`; the page/record title sits level with the app name and content starts on the band's border line |
| `NAV_ITEM` | 13 px text, `py-1` rows, `GAP` apart | The ONE nav item size — main sidebar and panel side navs alike; active = a shade darker, never white; sub side navs collapse like the main nav (toggle pinned bottom) |
| Text | `text-xs` data · `text-sm` chrome/titles · `text-lg` dialog titles | Three sizes, no exceptions; data is always `text-xs`; header titles are `text-sm` |
| Control border | `border-neutral-300` | The SAME on every interactive control — never lighter, never borderless |

## Surfaces — darker up the hierarchy

`SURFACE_NAV` (unit's brand colour, darkest) → `SURFACE_HEADER`
(`neutral-200`: record/Sheet header bands) → `SURFACE_CHROME` / `SURFACE_PANEL`
(`neutral-100`: panel side nav, sub-header and body — separated by borders) →
`SURFACE_BAR` (`neutral-50`: in-table bars) → `SURFACE_CARD` (white — data
lives here). Headers are never white (not editable). Active side-nav items are
a shade darker than their nav (`neutral-200`), never white — white is for
controls, not selection states. **The active rule generalises**: any selected
state (nav item, segmented option) is a shade darker than its surface.
**Header borders**: every header band closes with a bottom border (a
`neutral-200` band gets `border-neutral-300`; a `neutral-100` band gets
`border-neutral-200`). A header nested inside a record — the Sheet
`PanelHeader` — is `SURFACE_CHROME` (a step lighter than the record header
above it), never a second `neutral-200` band.

## Primitives (design.ts)

| Constant | Use |
|---|---|
| `BTN` | Standard button — white, bordered |
| `BTN_PRIMARY` | The lead add/new action — **white** (no dark buttons); first position + Plus icon carry the emphasis |
| `BTN_ACTIVE` | A toolbar toggle in its ON state — same white, **dark border** marks the state (never a dark fill) |
| `BTN_DANGER` | Red fill — selection-bar Delete and confirms only |
| `BTN_ICON` / `BTN_ICON_GHOST` | Square icon buttons (nav arrows / dismiss) |
| `PANEL_HEADER_BTN` | The ONE header square: Delete. **No close/prev/next buttons anywhere** — the table navigates between records; Escape / backdrop / breadcrumb close |
| `FIELD` / `FIELD_SEARCH` | Editable inputs and selects — h-7, `text-xs` |
| `FIELD_ROW` / `_LABEL` / `_VALUE` | The FormField anatomy — grey uppercase label cell + white value cell holding a **transparent** control (`fieldInput` from `ui/field-controls`); the cell IS the field boundary. Always render via the shared `FormField` |
| `SEGMENTED` (+`_BTN`/`_BTN_ACTIVE`) | The exclusive-option toggle (grain, draw order, radius). Active = a **shade darker** (`neutral-200`) — the nav-active rule; never a dark fill |
| `CHIP` | Read-only pill on a bar (grey tint) |
| `TAG` + `TAG_COLOR` | Tiny uppercase status tag; colour carries meaning (8 tones) |
| `TAG_NUMERIC` | TAG carrying a figure — min-width, centred, tabular |
| `BADGE` | Rounded-full full-word pill in table cells (tones in `lib/badge-colours`, rendered via `ColourBadge`). Distinct from TAG on purpose |
| `COUNT_PILL` | Tiny count inside a button (Views 3) |
| `TILE` | THE one KPI tile — **grey** (read-only; white is for editable/clickable only); `text-xs` label over `text-sm` tabular value. The dashboard's KpiCard composes it |
| `SURFACE_*` | The ladder above, plus: `SURFACE_CARD_MUTED` (grey frame card holding white rows), `SURFACE_MENU` + `MENU_ITEM` (dropdowns), `SURFACE_EMPTY` (dashed empty state) |
| `CARD_HEADER` | Grey uppercase title strip across a card top |
| `SECTION_LABEL` | Uppercase `text-xs` heading inside a card/table; `PANEL_GROUP_LABEL` composes it. `text-[11px]` is retired |
| `TOOLTIP` | The one dark bubble |
| `CHECKBOX` | The one checkbox — 14px, one accent (neutral-800) |
| `PANEL_TITLE` | Detail-panel title text |
| `BREADCRUMB_PARENT` / `BREADCRUMB_SEP` | The one breadcrumb style: muted clickable parent, ChevronRight separator, dark title |

The shadcn `Button` appears **only in Dialog/Sheet footers** (Save/Cancel/
destructive confirms). The shadcn `Input` and `Select` are styled to match
FIELD, so dialog fields look like every other field. `DialogTitle` is
`text-lg` by default — call sites never set a size.

## Composed patterns

- **Tables** — every list of records renders through `EntityTable`
  (`components/shared/entity-table.tsx`); never hand-roll a `<table>`. Its
  toolbar is table chrome: an h-9 bar above the h-9 column header row, one
  fixed order on every table — **add action first (top-left) → other actions →
  Views → Columns → filters/toggles → search alone at the right**. The order
  is enforced by typed slots: `toolbar` takes action BUTTONS only; toggles
  (e.g. Show sample) go in `filters`, styled as BTN-classed labels — a toggle
  never sits between action buttons. No opt-outs (search and Views/Columns
  always present). Multi-select swaps the bar in place to count / extra
  actions / Delete / clear.
- **KPI tiles** — a band of equal-width `TILE`s with `GAP`, only where a
  section has headline figures; a table does NOT imply a band.
- **Detail panels** — full width less the main nav, baked into `Sheet`; body
  `SURFACE_PANEL` with white cards; header via `PanelHeader`
  (`components/panels/panel-header.tsx`); field rows via the shared
  `FormField` (grey `bg-neutral-50` label cell + white value cell). Never
  hand-roll a panel header or a local FormField. **A record opened from a
  table always breadcrumbs back to it** — `Parent › Record` in the panel
  header, the parent segment clickable (it closes the panel, returning to the
  table); a bare title with no way back is wrong. **One breadcrumb style
  everywhere**: muted clickable parent, ChevronRight separator, dark title —
  never a slash or a back-arrow. Form block: single left
  column ~w-1/3, one compact block, no sub-headers; right side for
  charts/KPIs.
- **Model sub-header** — scenario picker + grain toggle + collapse/nav
  controls, all h-7 in the h-9 chrome bar.

## Graphics and dashboards

- **A dashboard is a page like any other.** The standard h-12 title band —
  never a hero title with a subtitle under it. KPI figures form ONE band of
  grey `TILE`s (read-only: never white cards, never icons, never per-tile
  accent colours). Every chart sits inside a `SURFACE_CARD` under a
  `CARD_HEADER` strip, `GAP` between everything.
- **Series colours** come from `CHART_SERIES` in FIXED order — the first
  series is always blue, the second always orange, and a filter that removes
  a series never repaints the survivors. More than 4 series fold into
  "Other" or split into small multiples. The order is validated for
  colour-vision separation and contrast on white; don't re-order it.
- **One y-axis.** Never a dual-axis chart. Two measures of different scale
  get two charts.
- **Chart chrome is recessive**: horizontal gridlines only (`CHART_GRID`
  hairline), baseline `CHART_AXIS`, all chart text 12 px `CHART_INK`. Text
  never wears a series colour — the swatch beside it carries identity.
  Adjacent and stacked fills keep a 2 px white gap.
- **Legend**: two or more series always get one (`CHART_LEGEND`, under the
  plot); a single series is named by the card header, no legend.
- **Deltas** (`+4.2%`) follow the figure rule: positive is plain ink
  (`DELTA_POS` — green-for-positive is banned), negative is `DELTA_NEG` red
  with a real minus sign. Never colour alone.
- One plot height: `CHART_HEIGHT`.

## Print — documents and reports

The second medium: A4 documents generated from app data (reports, schedules,
statements). Page geometry ships as `@gbrm/design/print.css` (A4 portrait,
15mm margins); element styling is the `PRINT_*` tokens.

- **The core rule translated**: paper has no interaction, so ink on white
  with hairline structure replaces interactive-white-on-grey. Fills never
  exceed `neutral-100` — structure comes from rules (lines), not grey bands.
  Headline figures sit in bordered, unfilled boxes (`PRINT_TILE`).
- **Three text sizes in pt, no exceptions**: 9pt data and labels
  (`PRINT_LABEL` is uppercase muted), 12pt section headings
  (`PRINT_SECTION`, closed with a hairline), 18pt document title
  (`PRINT_TITLE` — once, page one, with a `PRINT_META` line under it:
  source app · period · generated date).
- **Tables**: hairline row dividers only — no vertical rules, no zebra
  striping. Column headers are uppercase muted over a mid-weight rule
  (`PRINT_TH`); a totals row closes with a heavy rule and bold figures
  (`PRINT_ROW_TOTAL`).
- **Colour only where it carries meaning**: `CHART_SERIES` in charts (the
  palette is validated on white) and red negatives. Never decorative.
- **Page discipline**: every table, chart and figure band avoids breaking
  across pages (`PRINT_AVOID_BREAK`); top-level sections may force a new page
  (`PRINT_PAGE_BREAK`). The running footer (`PRINT_FOOTER`) is document title
  left, "Page X of Y" right.
- Screen conventions ride along: em dash for zero/absent, `DD MMM YYYY`,
  `£1,234` tabular, negatives red with a real minus sign.
- The legacy `rpt-*` report pre-dates these tokens; each report migrates when
  next touched.

## Website — the marketing front end

The third medium: the public site for the apps. Same family, different
posture — the page is for reading, not editing.

- **The ground is white** — the inverse of the app's grey-chrome stack. Grey
  bands (`WEB_SECTION_ALT`, `neutral-50` with hairline top/bottom borders)
  alternate with white sections for rhythm. No other background colours.
- **Four text sizes**: display (`WEB_DISPLAY`, 5xl), section title
  (`WEB_SECTION_TITLE`, 3xl), body (`WEB_BODY`, base), small (`WEB_SMALL`,
  sm). Nothing between. `WEB_EYEBROW` is the small uppercase kicker above a
  headline.
- **ONE deliberate inversion (2026-08-05)**: the website allows a single
  dark-fill button — `WEB_BTN_CTA` — because a marketing page has one job and
  its lead action must dominate. One CTA per page view; every other action is
  `WEB_BTN` (white, bordered — the app's language). Never two dark buttons
  side by side. Dark fills remain banned in the apps.
- **Structure**: one container measure (`WEB_CONTAINER`, max-w-5xl), one
  section rhythm (`WEB_SECTION`, py-20), white sticky header with a hairline
  (`WEB_NAV`), dark footer (`WEB_FOOTER` — mirroring the app's darkest
  surface). Cards are the app's white bordered card, roomier (`WEB_CARD`).
- Charts or figures shown on the site follow the app's chart rules verbatim.

## Banned

- Close / prev / next buttons in any header (Delete is the only header square).
- `text-[11px]` (retired 2026-08-04) — data/labels are `text-xs`.
- Hand-rolled control styling (any button/field class written longhand).
- Dark-fill buttons anywhere (`bg-neutral-900` fills).
- shadcn `Button` outside Dialog/Sheet footers.
- Ad-hoc gaps (`gap-1`/`gap-2`/`gap-3` between controls or cards) and ad-hoc
  control heights (`h-8` controls).
- `border-neutral-200` on an interactive control.
- A fourth text size; `text-sm` in tables/forms/data.
- Colour without meaning; green for positive figures (data, not celebration);
  negative = `text-red-600` with a minus sign (`−£1,234`).

## Conventions that ride along

- Zero/absent values display as an em dash, not `0` or `£0`.
- Currency `£1,234` formatted on blur; dates `DD MMM YYYY`; `tabular-nums`
  for figures.
- One `text-lg` heading per panel; hierarchy by weight, not size.
- Icon-only buttons need `aria-label`; delete asks for confirmation (centred
  Dialog); Escape closes the top-most layer.

## Exempt (deliberate, not drift)

Auth screens (login/forgot/reset), the legacy print report (`rpt-*` — until
it migrates to the `PRINT_*` tokens), devtools
overlays, and the Model grid's grey footer tiles (white is reserved for input
cells there). Everything else composes design.ts.

## Planned work

Plan 05: the Model grid gets its OWN portable design system (tokens, review
surface, guard) — covers the grid's dark toast and grid-only styles. Plan 06:
the comparables table rebuilds onto EntityTable. `shared/editable-cells`
in-cell editors keep their compact size — a decided exemption (guard excludes
the file).
