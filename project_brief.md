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
- Shared React components (`src/components/`) — promoted in v0.4.0 once two
  apps needed the identical thing: `EntityTable`, the panel stack, `Sheet`,
  `FormField`, `ColourBadge`, `Button`, `Dialog`. Tokens fix an element's
  colour and size; these fix a screen's shape, which no class string can
  enforce
- Layout rules L1–L7 — where the blocks sit; numbered, drawn in the catalogue
  and partly guarded (v0.5.0)
- Conventions C1–C8 — how a value is written in any medium (v0.5.0)
- Theme scale variables — panelgap, desk breakpoint, sidebar width
  (`css/theme.css`)
- Graphics and dashboard standards — validated chart palette, chart chrome,
  delta rules, dashboard layout rules
- Print standards — `PRINT_*` tokens for A4 documents and reports off app
  data, plus page setup (`css/print.css`)
- Website standards — `WEB_*` tokens for the marketing front end
- The rulebook (`DESIGN_SYSTEM.md`) and the drift guard
  (`scripts/check-design.sh`)
- The `/design-update` skill (`skills/design-update/`) — how an app adopts a
  new version; shipped here so it is versioned with the rules it enforces,
  and installed into an app by `scripts/install-skills.sh` (v0.7.0)

**Deliberately out:**

- Any component only ONE app needs — the promotion bar is unchanged: it moves
  here once a second app needs the identical thing, and not before
- Fonts and brand colours — per app
- The catalogue (`catalogue/`) ships in the repo but not in the package

## Consumers

| App | Status |
|---|---|
| Property Manager | Live — first adopter; the system was built there. Still holds local copies of the v0.4.0 components; deleting them in favour of the package is a separate job |
| Project Manager | Live on v0.4.0 |
| Survey Manager | **Do not touch** (Joe, 2026-08-05) until told otherwise |
| People / OKR / Data / Development Manager | Not yet connected |

## How change flows

Change lands here on a branch → reviewed in the catalogue → merged → version
bumped and tagged → each app upgrades by bumping its pin, deliberately, on
its own schedule, by running the packaged `/design-update` skill. Nothing
changes silently across live apps.

## History

Carved out of Property Manager on 2026-08-05. v0.1.0: tokens, theme, rulebook,
guard. v0.2.0: renamed to plain "Design System"; graphics and dashboards
section (chart palette, chart chrome, dashboard layout rules). v0.3.0:
broadened to three media — Print (`PRINT_*` tokens, `print.css`) and Website
(`WEB_*` tokens); catalogue gained its side nav. v0.4.0: the shared components
moved into the package. v0.5.0: the catalogue gained its Application sub-nav
(Tokens · Components · Layout) so the components have a reference rendering,
and layout was promoted from prose to numbered rules L1–L7 — L1 (fields in ONE
left column) now fails the drift guard. Conventions became C1–C8 with a page of
their own, opening with the decision that NOTHING is ever right-aligned (Joe,
2026-08-06): `EntityTable`'s `align` option was removed and `text-right` is now
guarded. v0.6.0: `MainNav` ships from the package and L8 governs both navs.
v0.7.0: packaging only — the `/design-update` skill moved out of Joe's personal
Claude config and into the package, so the instructions for adopting a version
are versioned with the rules they enforce; `scripts/install-skills.sh` copies it
into a consuming app, and the skill re-runs that install after every bump so it
updates itself.
