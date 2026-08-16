# Design System

The shared design system for our manager apps (Property, Survey, Project,
People, OKR, Data, Development). One set of tokens, one rulebook, one drift
guard — installed into each app as a versioned package. It covers three
media: the **apps**, **print** (documents and reports off app data, `PRINT_*`
tokens + `print.css`) and the **website** (the marketing front end, `WEB_*`
tokens). The catalogue's sidebar switches between them.

**The design language in one line:** anything you can click or edit sits on a
white background with a border, on grey chrome. Interactive = white. Static
chrome = grey. Print and website translate the same language to their media.
Full rules in `DESIGN_SYSTEM.md`.

## What's in the package

| Piece | File | What it is |
|---|---|---|
| Tokens | `src/design.ts` | Every styleable primitive as a named class-string constant (BTN, FIELD, TAG, SURFACE_*, …). Apps import and compose these; nobody writes control styling longhand. |
| Components | `src/components/` | The shared structural components — `EntityTable`, the panel stack (`PanelShell`/`PanelHeader`/`PanelStackRenderer`), `Sheet`, `FormField`, `ColourBadge`, `Button`, `Dialog`. Tokens make an element the right *colour and size*; these make a screen the right *shape*. |
| Theme variables | `css/theme.css` | The Tailwind v4 scale the tokens depend on (panelgap, desk breakpoint, sidebar width). |
| Print page setup | `css/print.css` | A4 portrait, 15mm margins — imported by report stylesheets alongside the `PRINT_*` tokens. |
| Rulebook | `DESIGN_SYSTEM.md` | The written rules — scale, surfaces, layout (L1–L8), conventions (C1–C8), when each primitive applies. |
| Drift guard | `scripts/check-design.sh` | Fails an app's build when control styling is hand-rolled instead of composed from the tokens, or when a layout or convention rule it can see is broken. |
| Upgrade skill | `skills/design-update/` | The `/design-update` Claude Code skill — bumps an app's pinned tag, diffs the rulebook, fixes every guard failure and applies the rest by hand. Versioned with the rules it enforces; installed into an app by `scripts/install-skills.sh`. |

## Installing into an app

1. **Install a pinned release** (the tag is the version — upgrades are always
   deliberate):

   ```sh
   npm install github:gbrm-joe/Design-System#v0.1.0
   ```

2. **Wire the theme into Tailwind** — in the app's global stylesheet:

   ```css
   @import "tailwindcss";
   @import "@gbrm/design/theme.css";
   @source "../../node_modules/@gbrm/design/dist";
   ```

   The `@source` line makes Tailwind scan the package for class names —
   without it, classes used only via the tokens are silently missing. Adjust
   the relative path from the stylesheet to `node_modules`.

3. **Wire the drift guard** — in the app's `package.json` scripts:

   ```json
   "check:design": "sh node_modules/@gbrm/design/scripts/check-design.sh"
   ```

   Run it in CI / before commit. An app can exempt specific files by listing
   grep patterns, one per line, in a `.design-check-ignore` at its root.

4. **Wire the upgrade skill** — in the app's `package.json` scripts, then run
   it once:

   ```json
   "install:skills": "sh node_modules/@gbrm/design/scripts/install-skills.sh"
   ```

   Claude Code only discovers skills at the app root, never inside
   `node_modules`, so this copies the packaged skills into the app's
   `.claude/skills/`. The copy is package-owned and overwritten on every run —
   never edit it in the app. From then on the app upgrades with
   `/design-update`, which re-runs this install itself so the skill stays in
   step with the rules.

5. **Import tokens, delete local copies:**

   ```ts
   import { BTN, FIELD, SURFACE_CARD } from "@gbrm/design";
   ```

## The catalogue

`catalogue/` is a small standalone site rendering the **working copy** of
`src/` — edit a token or a component, refresh, see it. It is the reference
rendering: if an app screen doesn't match the catalogue, the screen is wrong.
Review every design change here before tagging a release.

Below the page list sits the **Sandbox** — a working demo app (nav, pages,
tables, records, dialogs, dummy data) built from the REAL components in
`src/`, at full size, on the whole viewport. The pages above document the
system; the sandbox is the only place you can see whether a screen is actually
right. It exists because none of the documentation pages could have caught a
page title sitting 4px from the sidebar: tokens are drawn alone, components as
specimens, and the Layout page is schematics at reduced scale — a schematic
cannot show a 12px error. Its devtools strip toggles a measure overlay (the
insets and alignment lines the rules name, drawn over the live screen), the
nav's collapsed state, and the brand colour.

Because it imports the real components it carries the package's peer
dependencies; the four documentation pages stay dependency-free and keep
reproducing components by hand. See `docs/plans/sandbox.md`.

Its sidebar switches media (Application · Print · Website); **Application** has
four pages:

| Page | What it shows |
|---|---|
| Tokens | Every class-string primitive, rendered. |
| Components | The v0.4.0 shared components as whole screens — the record panel, `PanelNav`/sub-header/body, the form block, `EntityTable`'s toolbar and column header, the `FormField` row, `ColourBadge` and `Dialog`. |
| Layout | The numbered layout rules L1–L8 — where the blocks sit — each drawn right and wrong. |
| Conventions | C1–C8 — how a value is written wherever it appears: alignment, em dashes, currency, dates, negatives, truncation, headings, reach. |

The Components page **reproduces** each component's markup against the same
tokens rather than importing it: the components pull in Next, lucide and
base-ui, and the catalogue stays dependency-free beyond Vite/React/Tailwind.
If a component's shape ever diverges from what the catalogue draws, one of the
two is wrong — fix it in the same PR.

```sh
cd catalogue && npm install && npm run dev
```

## Making a design change

1. Change lands **here**, on a branch, via PR — never as a local edit inside
   one app.
2. Bump `version` in `package.json`, merge, tag the release:

   ```sh
   git tag v0.2.0 && git push --tags
   ```

3. Each app upgrades on its own schedule by bumping its pinned tag and
   reviewing the diff — run `/design-update` in the app to do that properly.
   Nothing changes silently across live apps.

## Components — and why they are here now

Until v0.4.0 this package shipped tokens only, and shared components stayed in
each app. That was a mistake in practice: tokens fix an element's colour and
size, but they cannot fix a screen's **shape**. An app could pass the drift
guard with every token correctly applied and still have a detail panel with the
wrong header depth, the wrong body surface and close buttons the system bans —
because none of that is a class string, it is structure.

The promotion bar is unchanged: a component moves here only once **two apps
need the identical thing**. `EntityTable`, the panel stack, `Sheet`,
`FormField`, `ColourBadge`, `Button` and `Dialog` cleared it (Property Manager
and Project Manager both need them exactly as written), so they now ship from
one place instead of being copied and left to drift.

Apps consume them the same way as tokens:

```ts
import { EntityTable, PanelHeader, FormField, BTN } from "@gbrm/design";
```

The components depend on the app supplying React 19, Next, `@base-ui/react`,
`lucide-react`, `sonner`, `@tanstack/react-virtual`, `clsx`,
`tailwind-merge` and `class-variance-authority` — all listed as peer
dependencies, all already present in a manager app.

## Not in the package

- **The catalogue site** — lives in `catalogue/` (see below), not in the
  installed package.
- **Fonts and brand colours** — per-app, in each app's own globals.
- **Anything an app genuinely does alone** — its queries, its Server Actions,
  its domain components. A second app needing the same thing is what moves it.
