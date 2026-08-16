# Claude Rules — Design System

Read these at the start of EVERY session, in this order, then confirm in one
line that you have read them:

1. `README.md` — what this repo is and how apps consume it.
2. `DESIGN_SYSTEM.md` — the rulebook itself.
3. `project_brief.md` — purpose, scope, consumers, roadmap.

## What this repo is

The source of truth for styling across the manager apps, shipped as the
`@gbrm/design` package via pinned git tags. Nothing here reaches an app until
a release is tagged AND that app bumps its pin — never "hotfix" an app's
styling locally from here, and never edit an app from this repo.

## Ground rules

- Plain, concise UK English. Be blunt. No verbose replies.
- Every visual rule has THREE homes: the implementation (`src/design.ts` for a
  token, `src/components/` for a shape, `scripts/check-design.sh` where a
  machine can see it), the written rule (`DESIGN_SYSTEM.md`), and the
  rendering (`catalogue/`). A change touches all three or it is not done —
  a component with no catalogue page is half-shipped.
- Layout rules are NUMBERED (`DESIGN_SYSTEM.md` → Layout, L1–L8) and drawn on
  the catalogue's Layout page. Never bury a layout rule in a prose bullet:
  that is how Project Manager shipped a two-column project form.
- The displayed name is **"Design System"** — never "GBRM Design System".
  The package id `@gbrm/design` and the repo address never change (renaming
  them churns every app's pin).
- `CHART_SERIES` order is validated for colour-vision separation and contrast
  (2026-08-05). Never re-order it or swap a hue without re-running a
  colour-blindness validation and recording the result in the commit message.
- No shared React components in the package until two apps need the IDENTICAL
  thing. That bar was cleared in v0.4.0 by `EntityTable`, the panel stack,
  `Sheet`, `FormField`, `ColourBadge`, `Button` and `Dialog` — they now ship
  from `src/components/`. Anything else stays per-app until a second app needs
  it verbatim. Tokens govern colour and size; components govern SHAPE — an app
  can pass the drift guard and still be structurally wrong, which is exactly
  why the components moved here.
- The catalogue's DOCUMENTATION pages (Tokens, Components, Layout,
  Conventions) stay dependency-free beyond Vite/React/Tailwind: inline SVG
  icons, no chart or UI libraries. They reproduce the components against the
  tokens rather than importing them.
- The catalogue's SANDBOX does the opposite, deliberately (Joe, 2026-08-16):
  it imports the REAL components from `src/` and therefore carries the
  package's peer deps. That is the point — a reproduction can look perfect
  while the component apps install is wrong, which is how a page title shipped
  4px from the sidebar. **A change to a component is not reviewed until it has
  been looked at in the sandbox**, not just on the Components page. Where the
  two disagree, the sandbox is right and the documentation page is stale.
  Plan and findings: `docs/plans/sandbox.md`.
- TypeScript strict. Ask before adding any dependency.

## Workflow

- Branch per change: `feat/`, `fix/`, `chore/`, `ui/`. Small, reviewable PRs.
  Do not merge to `main` on your own initiative; once Joe explicitly says a
  branch is ready ("merge it", "this is good"), merging is approved.
- **Release**: bump `version` in `package.json` inside the PR; after merge,
  tag `vX.Y.Z` on `main` and push tags. Then each app upgrades by bumping its
  pin — a separate task, per app, in that app's repo.
- Review every change in the catalogue (`npm run dev`) before it merges.

## Running

- `npm run dev` — the catalogue, on localhost (renders the WORKING COPY of
  the tokens).
- `npm run build` — compiles the package (`dist/`).
