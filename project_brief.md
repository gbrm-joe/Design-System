# Design System — Project Brief

## Purpose

One design language across the manager apps, rigid by construction rather
than by discipline: named tokens instead of hand-written styling, a written
rulebook, a live catalogue to review changes by eye, and a drift guard that
fails an app's build when a screen hand-rolls control styling.

The language in one line: **anything you can click or edit sits on a white
background with a border, on grey chrome. Interactive = white. Static chrome
= grey.**

## Scope

**In the package** (`@gbrm/design`, installed by apps via pinned tag):

- Class-string tokens for every styleable primitive (`src/design.ts`)
- Theme scale variables — panelgap, desk breakpoint, sidebar width
  (`css/theme.css`)
- Graphics and dashboard standards — validated chart palette, chart chrome,
  delta rules, dashboard layout rules
- Print standards — `PRINT_*` tokens for A4 documents and reports off app
  data, plus page setup (`css/print.css`)
- Website standards — `WEB_*` tokens for the marketing front end
- The rulebook (`DESIGN_SYSTEM.md`) and the drift guard
  (`scripts/check-design.sh`)

**Deliberately out:**

- Shared React components (tables, panels, form fields) — each app implements
  its own against the rulebook; a component is promoted here only once two
  apps need the identical thing
- Fonts and brand colours — per app
- The catalogue (`catalogue/`) ships in the repo but not in the package

## Consumers

| App | Status |
|---|---|
| Property Manager | Live — first adopter; the system was built there |
| Survey Manager | **Do not touch** (Joe, 2026-08-05) until told otherwise |
| Project / People / OKR / Data / Development Manager | Not yet connected |

## How change flows

Change lands here on a branch → reviewed in the catalogue → merged → version
bumped and tagged → each app upgrades by bumping its pin, deliberately, on
its own schedule. Nothing changes silently across live apps.

## History

Carved out of Property Manager on 2026-08-05. v0.1.0: tokens, theme, rulebook,
guard. v0.2.0: renamed to plain "Design System"; graphics and dashboards
section (chart palette, chart chrome, dashboard layout rules). v0.3.0:
broadened to three media — Print (`PRINT_*` tokens, `print.css`) and Website
(`WEB_*` tokens); catalogue gained its side nav.
