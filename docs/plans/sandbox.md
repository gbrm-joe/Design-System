# Plan — the Sandbox

**Status**: in progress. Started 2026-08-16.

## Why

Project Manager shipped a page title 4px from the sidebar — jammed against the
nav under 14px of air above and below, lined up with nothing. Every token in
that band was correct. Joe found it by using the app, not by reviewing the
catalogue, and asked the right question: why was there no view here that would
have shown it?

Because the catalogue had none. It has three kinds of page and not one of them
could have caught it:

- **Tokens** — each primitive alone, on a white page. A primitive in isolation
  cannot show a relationship between two bands.
- **Components** — each component as a specimen, hand-reproduced against the
  tokens, at whatever size the specimen happened to be.
- **Layout** — schematics. Labelled grey boxes at reduced scale: the nav drawn
  `w-32` for a `w-52` rule, the whole page 224px tall. A schematic shows the
  wrong blocks in the wrong order. It cannot show a 12px error, because none of
  its measurements are real.

So the catalogue could prove every rule it drew and still not tell you whether a
screen was right. The missing thing is a **real screen, at real size, built out
of the real shipped components, with data in it**.

## What it is

A working demo app inside the catalogue — nav, pages, tables, records, dialogs,
dummy data — that **imports the actual components from `src/`** rather than
reproducing them. That is the whole point: if the sandbox looks right, the thing
apps install IS right. A hand-copy can look perfect while the shipped component
is wrong, which is the same class of bug as the one that started this.

It is also the design surface: change a token in `src/design.ts`, refresh, and
see it land in a real screen rather than on a swatch.

## The dependency decision (Joe, 2026-08-16)

The catalogue was dependency-free beyond Vite/React/Tailwind, and it no longer
is. To import the real components it needs `lucide-react`, `@base-ui/react`,
`@tanstack/react-virtual`, `sonner`, `clsx`, `tailwind-merge` and
`class-variance-authority` — the package's own peer dependencies, at the
versions a manager app already runs.

`next` is NOT among them. Only `panel-stack-renderer.tsx` touches Next, and only
for `usePathname`; a Vite alias points `next/navigation` at a small shim so the
sandbox stands in for the router. If a component ever needs more of Next than a
shim can honestly fake, that is a signal the component is too coupled to the
framework — fix the component, not the shim.

The **Tokens, Components, Layout and Conventions pages stay reproduction-based
and dependency-free**. They document; the sandbox demonstrates. Where the two
disagree, the sandbox is right and the documentation page is stale.

## Shape

Full-screen takeover, not a page inside the catalogue. A sandbox rendered into
the catalogue's `max-w-5xl` column would sit *under* the catalogue's own h-12
header, so its nav would not reach the top of the screen and its title band
would not sit level with its app name — it would misrepresent L2 while claiming
to demonstrate it. The sandbox IS the app; it gets the viewport.

A small floating control panel (bottom right, over the app) carries:

- **← Catalogue** — back out.
- **Measures** — overlay alignment lines and inset labels over whatever is on
  screen, so a 12px error is visible rather than felt. This is the control that
  would have caught the original bug in one glance.
- **Brand colour** — repaint `--sidebar-bg`. The nav's states are translucent
  overlays and are supposed to hold on any brand; this is where that gets
  proven rather than asserted.
- **Collapse nav** — the two nav states side by side in time, so the row-by-row
  alignment rule (L8) is checkable.

## Stages

Each stage ends with `npm run dev` reviewed by eye and a commit. Ticked when
done.

- [x] **0 — the L2 fix that started it.** `HEADER_PAD` + `PAGE_HEADER` +
      `PAGE_TITLE` tokens, composed into the record header and `PanelHeader`;
      L2 states the 16px and its arithmetic; guard fails a tight h-12 band; the
      Layout page gains a true-scale right/wrong pair. *Done 2026-08-16.*
- [x] **1 — wiring.** Peer deps into the catalogue, the `next/navigation` shim,
      the full-screen route and the floating control panel. *Done 2026-08-16.*
- [x] **2 — the list page.** `MainNav` + `PAGE_HEADER` + `EntityTable` over 74
      dummy projects: toolbar in its fixed slot order, column headers, sort,
      multi-select, search, Views/Columns, virtualised rows, totals footer.
      Measured live: nav 208px (`w-52`), band 48px (`h-12`), title 16px in and
      on the same line as the first column. *Done 2026-08-16.*
- [x] **3 — the record.** A row opens the Sheet: header band with a working
      `Parent › Record` breadcrumb, `PanelNav` down the left, h-9 sub-header,
      form block one column left, KPI band and chart right. *Done 2026-08-16.*
- [x] **4 — the dashboard.** KPI tile band and two charts in cards, drawn at
      1:1. *Done 2026-08-16.*
- [x] **5 — the rest.** *Done 2026-08-17.* The New Project **dialog** (real
      `Dialog`, `FormField` rows in one column, the only shadcn `Button`s on
      screen) and **toasts** off Export, Create and the bulk delete. **Loading
      and empty** became a devtools switch — Data · Loading · Empty — rather
      than pages of their own, because that is what they are: states of one
      screen. Flip it and the chrome must not move. A **second table** (Tasks)
      carries what Projects couldn't: the toolbar's `filters` slot with a real
      toggle in it, a totals footer off an aggregated column, and a negative
      that is a count of days rather than money. **Soon** items were already in
      both navs and the **collapsed nav** in the control panel; both checked
      against the live screens rather than assumed.

      It needed a rule that did not exist. The system had no loading treatment
      at all, so drawing the state meant deciding one: `SKELETON` (design.ts),
      "Loading and empty" (DESIGN_SYSTEM.md → Composed patterns), the Tokens
      and Components pages, and `loading` / `emptyMessage` props on
      `EntityTable` so the two h-9 bars and the totals row hold their place
      while the body is bars. **That is a design call made to get the state
      drawn — Joe's to keep or overrule.**
- [ ] **6 — the measure overlay proper.** Every inset and gap the rules name,
      drawn over the live screen and labelled with its token.
- [ ] **7 — close out.** CLAUDE.md and README updated for the dependency
      change, `project_brief.md` history, version bump, tag.

## What it found on day one

It started earning its keep before it was finished. Four of these came from
simply building the pages; two were only visible once a real screen rendered.

**Fixed here:**

1. **The chart's y-axis clipped its own currency labels.** The gutter was
   hard-coded at 46px — wide enough for `40,000`, not for `£40,000` (48px at
   12px), so every £ sign was drawn off the left edge of the SVG and silently
   lost. Now measured from the widest label actually being drawn. The same
   mistake as the viewBox one the chart rules already warn about: assuming a
   size instead of measuring it.

**Needing Joe's decision — NOT fixed, because they are design calls:**

2. **The rulebook contradicts itself on how wide a detail panel is.** L3 and
   L7 both say `w-3/4`. The "Detail panels" bullet says "full width less the
   main nav". `PanelEntry.widthClass` documents its default as `w-3/4`, and
   `EntityTable` overrides it with full-width-less-nav — which is what
   actually renders. Three statements, two of them wrong, and no way to tell
   which from the documentation. One number, please.
3. **The two navs disagree about group headers.** `MainNavGroup.label` is
   optional — "a header above the top item is noise" — but `PanelNavGroup`
   requires it, so a record's first section has to invent a heading. L8 says
   both navs obey the same rules; here they don't.

**Small, safe to fix next session:**

4. ~~`PanelEntry.subtitle` is documented as "a breadcrumb-style subtitle shown
   ABOVE the title (text-xs)". It renders inline BEFORE the title at text-sm,
   as the clickable breadcrumb parent.~~ *Fixed 2026-08-17* — on `PanelEntry`
   and on `PanelConfig`, which repeated it. `title`'s comment claimed text-lg
   and was wrong the same way; it renders text-sm.
5. The 16px band inset lands 1px left of the first column's text, because the
   arithmetic (4px page inset + 12px cell padding) ignores the card's own 1px
   border. Sub-perceptual, and `px-[15px]` would be a worse rule than `px-4`.
   Noted so nobody "discovers" it later and thinks it is a bug.

## What stage 5 found (2026-08-17)

**Fixed here:**

6. **The catalogue and the repo each installed their own copy of the peer
   deps** (sonner 2.0.7 vs 2.0.8, base-ui, react-virtual). React was already
   deduped in `vite.config.ts` — because two Reacts threw loudly. These fail
   SILENTLY: sonner keeps its toast queue in module state, so a component's
   `toast.success` can land in one copy while the sandbox's `<Toaster/>`
   renders from the other, and the toast simply never appears. Anything with
   module state or context is now deduped, not just React.

**Needing Joe's decision — NOT fixed, because they are design calls:**

7. **The shipped `Button`'s DEFAULT variant is a dark fill** (`bg-primary`),
   which the rulebook bans outright in the apps. Dialog footers are the ONE
   place `Button` is allowed, so `<Button>Create</Button>` — the obvious way to
   write a confirm — ships the one shape the system forbids. `EntityTable`'s
   delete dialog only dodges it by being `destructive`. A plain, non-destructive
   confirm has no defined style at all: the sandbox uses `outline` + `ghost`.
   Either the default variant changes or the rulebook names the footer pair.
8. **`PanelHeader` ships a `tabs` prop that renders a horizontal tab strip** —
   the exact shape L3 bans inside a record ("a tab strip is a different
   navigation model and reads as a different application"). A component
   offering the banned shape is how it comes back.
9. **`CHART_HEIGHT` says one plot height (h-64, 256px); the catalogue's chart
   draws at 172px** and every chart in the sandbox inherits that. One of the
   two is wrong.
10. **C2 contradicts itself inside one paragraph.** "Zero and absent are an em
    dash. Never 0" — then "a dash says nothing here; a zero says measured, and
    it is zero — different facts." A task due TODAY is a measured zero. The
    sandbox follows the headline (dash), because the date beside it already
    says today, but the rule needs to say one thing.

## Dummy data

One small fixture module, shaped like a real manager app's domain (projects,
clients, staff, tasks) with enough rows to make virtualisation and truncation
real. It must include the awkward cases the conventions exist for: zero and
absent values, negative figures, long names that have to truncate, dates,
currency. A fixture of tidy short strings proves nothing.

## Rules the sandbox itself follows

It is a demo of the system, so it obeys the system — but it is NOT exempt
scaffolding: the control panel is the only thing on screen allowed to sit
outside the rules, because it is devtools, and devtools are already exempt.
Everything else composes `design.ts` and imports the shipped components.
