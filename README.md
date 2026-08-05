# Design System

The shared design system for our manager apps (Property, Survey, Project,
People, OKR, Data, Development). One set of tokens, one rulebook, one drift
guard — installed into each app as a versioned package.

**The design language in one line:** anything you can click or edit sits on a
white background with a border, on grey chrome. Interactive = white. Static
chrome = grey. Full rules in `DESIGN_SYSTEM.md`.

## What's in the package

| Piece | File | What it is |
|---|---|---|
| Tokens | `src/design.ts` | Every styleable primitive as a named class-string constant (BTN, FIELD, TAG, SURFACE_*, …). Apps import and compose these; nobody writes control styling longhand. |
| Theme variables | `css/theme.css` | The Tailwind v4 scale the tokens depend on (panelgap, desk breakpoint, sidebar width). |
| Rulebook | `DESIGN_SYSTEM.md` | The written rules — scale, surfaces, when each primitive applies. |
| Drift guard | `scripts/check-design.sh` | Fails an app's build when control styling is hand-rolled instead of composed from the tokens. |

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

4. **Import tokens, delete local copies:**

   ```ts
   import { BTN, FIELD, SURFACE_CARD } from "@gbrm/design";
   ```

## The catalogue

`catalogue/` is a small standalone site rendering every token from the
**working copy** of `src/design.ts` — edit a token, refresh, see it. It is the
reference rendering: if an app screen doesn't match the catalogue, the screen
is wrong. Review every design change here before tagging a release.

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
   reviewing the diff. Nothing changes silently across live apps.

## Not in the package (yet)

- **Shared components** (EntityTable, FormField, Sheet, panels) stay in each
  app. A component is promoted here only once two apps need the identical
  thing.
- **The catalogue site** — lives in `catalogue/` (see below), not in the
  installed package.
- **Fonts and brand colours** — per-app, in each app's own globals.
