# Design System

The shared rulebook across THREE media: the **manager apps**, **print**
(documents and reports generated from app data) and the **website** (the
public marketing front end). One family; each medium translates the core rule
to its own surface. The single source of truth for element styling is
**`src/design.ts`** in this repo — class-string primitives every call site
composes, shipped to each app as the **`@gbrm/design`** package. `npm run check:design` (the packaged drift guard) fails an app's
build on hand-rolled control styling. The catalogue (`catalogue/` in this
repo — `npm run dev`) renders every primitive, every shared component and
every layout rule from the working copy of `src/` and is the reference
rendering; if a screen doesn't match it, the screen is wrong. Its Application
section has three pages — **Tokens**, **Components**, **Layout**. History and rationale live in Property Manager's
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
| `HEADER_PAD` | 16 px (`px-4`) | The ONE band inset. Content below a band is inset by the one gap (4px) and a card's text sits 12px inside that, so 16px puts the band's title on the same vertical line as the first value beneath it. Page-title band, record header, `PanelHeader` — all of them, and a record's side nav answers to it too (L8). **The nav's app-name band is the one exception at 12px**: it aligns to the nav's own column (L8's group headers), not to content it doesn't sit above |
| `NAV_ITEM` | 13 px text, FIXED `h-6` rows, `GAP` apart | The ONE nav item size — main sidebar and panel side navs alike. The height is fixed, not padding-derived, so a collapsed icon-only row is the same height as its expanded twin (L8); active = a step of contrast, never white; sub side navs collapse like the main nav (toggle pinned bottom) |
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
**One exception, and only one**: the main nav is the darkest surface in the
app, so it has no darker to go to — a darker overlay on near-black is
invisible. There the active row LIFTS (`BRAND_ACTIVE`, ≈`zinc-800` on a
`zinc-950` nav). The principle underneath is a step of CONTRAST from the
surface: darker on a light nav, lighter on a dark one. **And the idle/active
GAP is the rule that matters** — an idle item is clearly muted
(`BRAND_IDLE`) against the active row's white. Project Manager's idle items
were `zinc-200`, near enough to its active row that nothing read as selected;
that is why these are tokens now and not per-app numbers.
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
| `SKELETON` | The ONE loading placeholder — a grey bar in the shape of the value that is coming. Never a spinner on a blank page |
| `CARD_HEADER` | Grey uppercase title strip across a card top |
| `SECTION_LABEL` | Uppercase `text-xs` heading inside a card/table; `PANEL_GROUP_LABEL` composes it. `text-[11px]` is retired |
| `TOOLTIP` | The one dark bubble |
| `CHECKBOX` | The one checkbox — 14px, one accent (neutral-800) |
| `PAGE_HEADER` + `PAGE_TITLE` | THE page-title band (L2) and its one line of title — every page opens with this; never hand-rolled |
| `HEADER_PAD` | The ONE inset for any `HEADER_H` band — 16px |
| `PANEL_TITLE` | Detail-panel title text |
| `BREADCRUMB_PARENT` / `BREADCRUMB_SEP` | The one breadcrumb style: muted clickable parent, ChevronRight separator, dark title |

The shadcn `Button` appears **only in Dialog/Sheet footers** (Save/Cancel/
destructive confirms). The shadcn `Input` and `Select` are styled to match
FIELD, so dialog fields look like every other field. `DialogTitle` is
`text-lg` by default — call sites never set a size.

## Composed patterns

**These ship as components (v0.4.0), not just as rules.** Import them from
`@gbrm/design` — `EntityTable`, `MainNav`, `PanelShell`, `PanelHeader`,
`PanelNav`/`PanelLayout`, `PanelStackRenderer`, `Sheet`, `FormField`,
`ColourBadge`, `Button`, `Dialog`.
Tokens make an element the right colour and size; these make a screen the right
SHAPE, which no class string can enforce. Re-implementing any of them in an app
is drift, even if every token inside is correct.

- **Tables** — every list of records renders through `EntityTable`; never
  hand-roll a `<table>`, and never keep a local table component beside it. Its
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
- **The main nav** — every app's sidebar IS `MainNav` (v0.6.0). Apps pass
  groups, items and their router's link element; they pass no spacing. It owns
  the app-name band, L8's indent, the Soon treatment, the wordmark, the user
  panel, the collapse row and the live `--sidebar-w`. Its states are
  translucent white overlays (`BRAND_ACTIVE` / `BRAND_IDLE` / `BRAND_MUTED` /
  `BRAND_BORDER`), not a fixed zinc — the nav wears the unit's brand colour,
  and a hard-coded `zinc` only lands when that colour happens to be
  near-black. **The idle row is clearly muted against the active row's white**
  — that gap is what makes a selection legible, and it is the same gap in
  every app. A per-app `Sidebar` component is drift and fails the guard.
- **Detail panels** — full width less the main nav, baked into `Sheet`; body
  `SURFACE_PANEL` with white cards; the outer record band is `HEADER_H` on
  `SURFACE_HEADER` closed with `border-neutral-300`, and the backdrop stops at
  the main nav (`left-[var(--sidebar-w)]`) so the nav stays live behind an open
  panel; header via `PanelHeader`; field rows via the shared
  `FormField` (grey `bg-neutral-50` label cell + white value cell). Never
  hand-roll a panel header or a local FormField. **A record opened from a
  table always breadcrumbs back to it** — `Parent › Record` in the panel
  header, the parent segment clickable (it closes the panel, returning to the
  table); a bare title with no way back is wrong. **One breadcrumb style
  everywhere**: muted clickable parent, ChevronRight separator, dark title —
  never a slash or a back-arrow. The body's layout is **L1** and **L3** below —
  fields left in ONE column, charts and KPIs right.
- **Model sub-header** — scenario picker + grain toggle + collapse/nav
  controls, all h-7 in the h-9 chrome bar.
- **Loading and empty are states of the same screen, not different screens.**
  The chrome never waits for data: the nav, the h-12 title band and a table's
  two h-9 bars render immediately in all three states, and only the data area
  changes. **Loading is `SKELETON` bars drawn in the shape that is coming** —
  the same row heights, in the same columns — never a spinner over a blank
  content area, which hides the shape and makes the page jump when it clears.
  **Empty is `SURFACE_EMPTY`**, saying what is missing and carrying the action
  that fixes it; an empty table keeps its toolbar, because the way out of empty
  is usually a button on it. *Why it needed saying*: nothing did, so the system
  had no loading treatment at all — the sandbox had to invent one to draw the
  state, which is how the gap surfaced (2026-08-17).

## Layout — L1 to L7

Tokens govern colour and size; components govern shape; **layout governs where
the blocks sit** — how wide, in how many columns, in what order. A screen can
pass the drift guard with every token correct and still be laid out wrong, so
these are numbered rules, not prose: cite them in review ("that's L1"). They
are rendered in the catalogue under **Application › Layout**, and the ones a
machine can see are checked by `scripts/check-design.sh`.

**L1 — a detail panel's fields sit in ONE column, on the LEFT, ~a third of the
width. One column, never two.** The FormFields form one compact block with no
sub-headers inside it; the remaining two thirds carry the charts and KPIs the
record exists to show. A second column of fields halves the label width,
doubles the eye's travel down the form and leaves nowhere for the figures.
Full width with nothing beside it is equally wrong. If a record needs
sections, they are side-nav entries (L3), not headings inside the block.
*Guarded*: a `grid-cols-2/3/4` (or a `md:`/`lg:` variant) in a file that
renders `FormField` fails the check.

**L2 — a page is: main nav · h-12 title band · content inset by the ONE gap.**
Content starts on the band's border line, never floating below it with a
margin. A dashboard is a page like any other — the same h-12 band, never a
hero title with a subtitle under it. **The band is `PAGE_HEADER` — import it;
its inset is `HEADER_PAD` (16px), not the 4px page inset.** The band is 48px
tall around a 20px line, so it carries ~14px of air above and below the title;
at 4px in, the title reads as jammed against the nav and lines up with nothing
below it. 16px is not a taste call — it is 4px of page inset plus the 12px a
card's own text sits in, so the page title lands on the same vertical line as
the first column header in the table beneath it. Actions sit at the right end
of the same band. *Guarded*: an `h-12` band carrying `px-panelgap`/`px-1`/
`px-2`/`px-3` fails the check.
*Why it needed saying*: nothing did, so Project Manager used the page inset and
shipped a title 4px from the sidebar. Every token in that band was correct
(Joe, 2026-08-16).

**L3 — a record is: h-12 header band · side nav left · h-9 sub-header · body.**
Records navigate DOWN their own left column (`PanelNav`), exactly like the main
sidebar. **Horizontal tabs in a record are banned** — a tab strip is a
different navigation model and reads as a different application. The panel is
`PANEL_W` — **full width less the main nav** — and its backdrop starts at
`left-[var(--sidebar-w)]`, so the main nav stays live behind an open record. A
panel that stops short of the nav leaves a dead strip of the page showing down
its left edge, which reads as a drawer that failed to open (Joe, 2026-08-27).

**L4 — a table opens with two stacked h-9 bars.** The toolbar bar and the
column header row are the same height and the same grey, so they read as one
block of table chrome; nothing sits between them. The toolbar's slot order is
fixed on every table in every app (see Tables above).

**L5 — ONE gap, 4px, between everything, and as the page inset.**
`gap-panelgap` / `p-panelgap`. No `gap-1`/`gap-2`/`gap-3` between controls,
cards or sections, and no larger outer margin on a page.

**L6 — a KPI band is ONE band of equal widths, and it is optional.** `flex-1`
tiles with the one gap, all the same width, grey because they are read-only.
A table does not imply a band. Figures never split across two rows of tiles,
and no tile wears its own accent colour.

**L7 — the fixed widths.** Main nav `w-52` expanded / `w-12` collapsed
(`MainNav` publishes the live value as `--sidebar-w`, so a panel sits flush in
either state) · panel side nav `w-48` expanded / `w-9` collapsed · detail
panel `PANEL_W` (full width less the nav; the whole viewport below `desk:`) ·
form block `~w-1/3` (L1) · FormField label cell `w-40`
default, narrowed to `w-28` in a tight panel and never wider · table search
`w-64`, alone at the right end of the toolbar.

**L8 — a group header lines up with the band above it; items step 12px in.**
Measured from the nav's own edge. **The group header takes the inset of the
band directly above the nav**, because they share a left edge and the eye reads
them as one column:

| Nav | Band above it | Group header | Item | Nested item |
| --- | --- | --- | --- | --- |
| Main sidebar | app-name band, `pl-3` | 12px | 24px | 36px |
| A record's `PanelNav` | record header, `HEADER_PAD` | 16px | 28px | 40px |

The step between levels is 12px in both. Anything else full-bleed down that
edge — the group rules, the Collapse row — takes the group header's inset too,
so a panel's left edge is ONE line from the breadcrumb to the bottom. The nav's
only horizontal padding is the ONE gap (4px), enough for an active row's
rounded pill to clear the edge; every other inset is one number on the row
itself, never a nav pad plus a row pad added together. Groups are separated by
their `h-9` header and the one 4px gap — never by a bigger margin.

*Why it needed saying*: the panel's group header was full-bleed
(`-mx-panelgap` cancels the nav pad so its rules reach both edges) and nobody
added the 4px back, so it sat at 8px — left of the old rule's own number and
left of the breadcrumb above it (Joe, 2026-08-27).

**Both navs obey the same state rule, from the same tokens.** `NAV_ACTIVE` /
`NAV_IDLE` / `NAV_MUTED` on a light nav, `BRAND_ACTIVE` / `BRAND_IDLE` /
`BRAND_MUTED` on the brand nav. Only the direction flips (a light surface
darkens, the darkest surface lifts); the relationship is identical — idle is
clearly muted, active is the strongest thing in the column, Soon is quieter
again. Never write these as class strings inside a nav.

**A count in a nav row is plain muted numerals** (`NAV_COUNT`), never a filled
pill. `COUNT_PILL`'s grey is the same grey as an active row's background, so
an idle row wearing one read as selected, and at `text-xs` the number competed
with the label. The pill form belongs in table cells and lists, where there is
no row-level state to collide with.

**Collapsing a nav changes its WIDTH. Nothing moves vertically.** Every row
holds a fixed height that does not depend on what is inside it: `NAV_ITEM` is
`h-6` whether it carries a label or a bare 12px icon, the user row is
`NAV_USER` (`h-10`) whether it shows two lines or just an avatar, and a group
label's `h-9` is taken over by `NAV_GROUP_RULE` — a divider of the same
height — when the label becomes unreadable at 48px. Size a nav row from its
padding and the collapsed rail comes out shorter row by row, the error
accumulates down the column, and the whole footer lands somewhere else (Joe,
2026-08-06). The collapse toggle is the same full-bleed `h-9` row closed by the
same `border-t` in BOTH states of BOTH navs — never a bordered row in one and a
floating icon button in the other, which is what `PanelNav` had. Put the
expanded and collapsed navs side by side: every row must line up.

*Why numbered*: Property Manager shipped items at 24px under a header at 20px,
Project Manager shipped both at 12px with no indent at all, and both passed the
drift guard because nothing governed the shape (Joe, 2026-08-06). *Guarded*: a
locally declared `Sidebar` component fails the check — import `MainNav`.

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
- **Draw the plot at 1:1** — 12 px means twelve real pixels. An SVG with a
  `viewBox` stretched to fill its card scales the text, the hairlines and the
  2 px gaps with it (the catalogue's own axis labels were rendering at 14 and
  18 px before this was caught). Measure the container and draw at its true
  width instead of scaling a fixed coordinate box.
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
- A local copy of anything the package ships — a per-app table, **sidebar**,
  panel header, panel stack, sheet, form-field row or badge. Import it or it
  is drift.
- **A page-title band inset by anything but `HEADER_PAD`** — 16px, so the title
  lines up with the data under it (L2). The 4px page inset is for content.
- **Nav items flush with their group header** — items are always indented
  under it (L8), and the nav's insets never vary between apps.
- **Two columns of FormFields** (`grid-cols-2` and friends) — L1.
- **A horizontal tab strip inside a record** — records navigate down the side
  nav (L3).
- **`text-right` anywhere** — everything is left-aligned (C1).
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

## Conventions — C1 to C8

How a VALUE is written, wherever it appears — a table cell, a form field, a
KPI tile, a printed report. Tokens govern colour and size, components govern
shape, layout governs where the blocks sit; conventions govern what the reader
actually sees in the cell. Numbered like the layout rules, and rendered in the
catalogue under **Application › Conventions**.

**C1 — everything is LEFT-aligned. Nothing is ever right-aligned** (Joe,
2026-08-06): not a figure, not a currency, not a total, not in a table, a
form, a tile or a report. Figures still carry `tabular-nums` — that is what
makes a column of them legible, and it always was. Right-aligning pushes a
value away from the label or heading that names it and leaves a ragged gap
down the middle of every row. *Guarded*: `text-right` in an app's source
fails the check. `EntityTable`'s `ColumnDef.align` was removed in v0.5.0.

**C2 — zero and absent are an em dash.** Never `0`, never `£0`, never an empty
cell. A dash says "nothing here"; a zero says "measured, and it is zero" —
different facts.

**C3 — currency is `£1,234`, formatted on blur.** Thousands separated, no
pence unless pence are the point. The field shows the raw number while you
type and formats when you leave it.

**C4 — dates are `DD MMM YYYY`.** `25 Mar 2027`. Never `25/03/2027` — an
all-numeric date is ambiguous the moment anyone outside the UK reads it.

**C5 — negatives are red with a REAL minus sign** (`−£1,234`, U+2212, not a
hyphen); positives are plain ink (`DELTA_POS`). Green for a positive figure is
banned — this is data, not celebration. Colour never carries meaning alone:
the minus sign does the work, the red reinforces it.

**C6 — a row is ONE line: truncate, never wrap.** Every table cell and nav
item truncates. A wrapping row breaks the h-9 rhythm and makes a list
impossible to scan.

**C7 — one `text-lg` heading per panel; hierarchy by weight, not size.**
`text-lg` is the dialog title and nothing else. A fourth text size is banned.

**C8 — icon-only buttons carry an `aria-label`; delete confirms in a centred
Dialog; Escape closes the top-most layer.**

All eight hold for Print — a report is a table. The website inherits C5 and
C8. The only medium-specific part is currency precision: a report may show
pence where a screen would not.

## Exempt (deliberate, not drift)

Auth screens (login/forgot/reset), the legacy print report (`rpt-*` — until
it migrates to the `PRINT_*` tokens), devtools
overlays, and the Model grid's grey footer tiles (white is reserved for input
cells there). Everything else composes design.ts.

## Adopting a new version

An app adopts a release by bumping its pinned tag and bringing its code up to
whatever the new version says — never by editing the package or patching a
token locally. That job is scripted: the package ships the **`/design-update`**
skill (`skills/design-update/SKILL.md`), which bumps the pin, diffs this
rulebook old against new, fixes every drift-guard failure, applies the rule
changes the guard cannot see, verifies and commits.

Claude Code only finds skills at the app root, so an app installs it once:

    "install:skills": "sh node_modules/@gbrm/design/scripts/install-skills.sh"

That copies the packaged skills into the app's `.claude/skills/`. The copy is
package-owned — it is overwritten on every run, and `/design-update` re-runs
the install straight after the version bump so the skill updates itself along
with the rules it enforces.

## Planned work

Plan 05: the Model grid gets its OWN portable design system (tokens, review
surface, guard) — covers the grid's dark toast and grid-only styles. Plan 06:
the comparables table rebuilds onto EntityTable. `shared/editable-cells`
in-cell editors keep their compact size — a decided exemption (guard excludes
the file).
