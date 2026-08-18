# Adopting the Design System in an app

Two jobs, in one place:

1. **[First install](#1-first-install)** — putting the Design System into an app
   that has never used it.
2. **[Updating](#2-updating-an-app-when-the-design-system-changes)** — moving a
   live app onto a newer version after the Design System itself has changed.

Both are done **in the app's repo, on a branch**. Nothing in this repo is edited
to make an app work, and no app ever patches a token locally — that is the one
rule the whole setup exists to hold.

---

## 1. First install

### Before you start

The app needs React 19, Next 15+, Tailwind **v4** and TypeScript. The package
ships components as well as tokens, so it expects the peer dependencies a
manager app already has.

Pick the version you are adopting — releases are git tags:

```sh
git ls-remote --tags https://github.com/gbrm-joe/Design-System
```

Take the highest `vX.Y.Z`. Everything below assumes you use that tag.

### Step 1 — install the package, pinned

```sh
npm install github:gbrm-joe/Design-System#vX.Y.Z   # the tag you picked above
```

The tag IS the version. There is no `latest` and no range: an upgrade is always
a deliberate edit to `package.json`.

### Step 2 — install the peer dependencies

```sh
npm install @base-ui/react lucide-react sonner @tanstack/react-virtual \
  clsx tailwind-merge class-variance-authority
```

Install each **once**, at the app root. Two copies of one of these is a silent
failure, not a loud one — `sonner` keeps its toast queue in module state, so a
second copy means toasts never appear and nothing errors.

### Step 3 — wire the theme into Tailwind

In the app's global stylesheet:

```css
@import "tailwindcss";
@import "@gbrm/design/theme.css";
@source "../../node_modules/@gbrm/design/dist";
```

The `@source` line makes Tailwind scan the package for class names. Without it,
every class that only appears inside a token is missing from the build and
screens come out unstyled in ways that look random. Adjust the relative path
from your stylesheet to `node_modules`.

Report stylesheets add `@import "@gbrm/design/print.css";` for A4 page setup.

### Step 4 — set the app's brand colour

The nav wears the unit's brand colour, and that stays per app. Set it on the
root in the app's own global stylesheet:

```css
:root {
  --sidebar-bg: #09090b; /* the unit's brand colour */
}
```

The nav's states are translucent white overlays, so they hold on any hue — do
not hand-pick active or idle colours to suit the brand.

### Step 5 — add the two scripts

In `package.json`:

```json
"check:design": "sh node_modules/@gbrm/design/scripts/check-design.sh",
"install:skills": "sh node_modules/@gbrm/design/scripts/install-skills.sh"
```

Then run the second one once:

```sh
npm run install:skills
```

That copies the packaged `/design-update` skill into the app's
`.claude/skills/`. Claude Code only finds skills at the app root, never inside
`node_modules`. The copy is package-owned and overwritten on every run — never
edit it in the app.

Wire `npm run check:design` into CI or a pre-commit hook. A guard nobody runs
is not a guard.

### Step 6 — build the app shell

Import the components; do not re-create them. The shell is:

```tsx
<PanelStackProvider>
  <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
    <MainNav
      appName="Project Manager"
      appIcon={FolderKanban}
      groups={GROUPS}          // groups, items, icons, `soon` flags — no spacing
      activePath={pathname}
      collapsed={collapsed}
      onToggleCollapsed={...}
      linkAs={Link}            // the app's router link
      user={{ name: "Joe Millson", subLine: "GBRM" }}
    />
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* every page opens with PAGE_HEADER, then content inset by the one gap */}
    </main>
  </div>
  <PanelStackRenderer />
  <Toaster position="bottom-center" />
</PanelStackProvider>
```

Three things go wrong here if you improvise:

- **The app passes no spacing to `MainNav`.** It owns the indents, the group
  headers, the Soon treatment, the collapse row and the live `--sidebar-w`.
- **Do not wrap the shell in a `z-50` container.** The panel stack sits at z-40
  and up and must paint over the app, or records open invisibly.
- **`<Toaster/>` is mounted once**, at the shell, not per page.

### Step 7 — replace the app's local copies

Anything the package ships must be imported, not kept alongside. Delete the
app's own version as you go:

```ts
import { EntityTable, MainNav, PanelHeader, FormField, BTN, FIELD } from "@gbrm/design";
```

A workable order, biggest structural win first:

1. The sidebar → `MainNav`.
2. Every list → `EntityTable` (never a hand-rolled `<table>`).
3. Detail panels → `Sheet` + `PanelHeader` + `PanelNav`/`PanelLayout`.
4. Form rows → `FormField`, badges → `ColourBadge`, dialogs → `Dialog`.
5. Everything else → compose the tokens from `design.ts`.

An app migrating gradually may keep a `src/lib/design.ts` that re-exports from
`@gbrm/design`; the guard exempts that one file so call sites can move over
without a flag day.

### Step 8 — run the guard and fix every hit

```sh
npm run check:design
```

Fix each failure by **composing the token**, never by rewriting the styling
longhand a different way. Only add a pattern to `.design-check-ignore` for a
screen the rulebook genuinely exempts (auth screens, the legacy `rpt-*`
report, devtools overlays) — silencing the guard anywhere else hides drift
instead of fixing it.

Two limits worth knowing before you trust a green tick:

- **It only scans `src/`.** An app whose code sits in `app/` or `components/`
  at the repo root passes instantly and means nothing by it. Move the code
  under `src/`, or say so when you hit this and the guard gets fixed here.
- **It reads class strings, so it cannot see shape.** A screen can pass with
  every token correct and still be laid out wrongly. Check the numbered layout
  rules (L1–L8) and the conventions (C1–C8) in `DESIGN_SYSTEM.md` by eye.

### Step 9 — verify

```sh
npm run check:design
npx tsc --noEmit
npm run build
```

Then look at the app beside the reference rendering. In this repo, `npm run
dev` gives you the catalogue; its **Sandbox** is a whole working app built from
the same components. If your screen does not match it, your screen is wrong.

### Step 10 — commit

One branch, one PR, in the app's repo. Say which version you adopted and what
visibly changed on screen.

---

## 2. Updating an app when the Design System changes

A new version exists once it is merged here, `package.json` is bumped, and the
tag is pushed. Nothing reaches an app until that app bumps its own pin — which
is the point. Each app moves on its own schedule.

### The short version

In the app's repo, in Claude Code:

```
/design-update
```

That skill ships inside the package, so it is versioned with the rules it
enforces. Invoking it is your approval for it to edit app code to comply.

It will:

1. Check the app really consumes `@gbrm/design`, and note the pinned tag.
2. Snapshot the current rulebook **before** installing anything.
3. Find the newest tag, bump `package.json`, `npm install`.
4. Re-run `npm run install:skills` — the new version ships a new copy of the
   skill itself, and it re-reads it if it changed.
5. Diff the old rulebook against the new one. That diff is the work list.
6. Run `npm run check:design` and fix every hit by composing tokens.
7. Apply the changes the guard **cannot** see — retired token names, moved
   values, new layout and convention rules — by grepping the app.
8. Delete anything in the app's own design doc that the shared rulebook now
   covers or contradicts.
9. Verify: guard, `tsc --noEmit`, tests, build.
10. Commit, then report what visibly changed and what to check in the browser.

If a rule change implies edits across more than about a dozen files, it stops
and asks first.

### Doing it by hand

Same job without the skill:

```sh
# 1. keep the old rulebook to diff against
cp node_modules/@gbrm/design/DESIGN_SYSTEM.md /tmp/DESIGN_SYSTEM.old.md

# 2. find the newest tag, edit the pin in package.json, install
git ls-remote --tags https://github.com/gbrm-joe/Design-System
npm install

# 3. refresh the packaged skill
npm run install:skills

# 4. read what actually changed — this is the work
diff /tmp/DESIGN_SYSTEM.old.md node_modules/@gbrm/design/DESIGN_SYSTEM.md

# 5. fix what the guard can see
npm run check:design

# 6. verify
npx tsc --noEmit && npm run build
```

Step 4 is the one people skip and the one that matters. The guard greps class
strings; it cannot tell you that a layout rule moved, that a token was retired,
or that a component you keep a local copy of now ships from the package.

### Never, in an app

- **Never edit `node_modules/@gbrm/design`**, and never edit this repo to make
  one app's screen work. Change it here, tag it, adopt it there.
- **Never silence the guard** to get a build green.
- **Never keep a local copy** of something the package ships — a per-app
  sidebar, table, panel header, form-field row or badge is drift by definition.

If a new rule looks wrong, stop and say so before writing code around it. The
rulebook is meant to be argued with; it is not meant to be quietly ignored.

---

## Troubleshooting

**Styles are missing or half-applied.** The `@source` line in step 3 is wrong
or absent, so Tailwind never scanned the package.

**Toasts do nothing, and nothing errors.** Two copies of `sonner` — the
component's `toast()` and your `<Toaster/>` are in different modules. Check for
a nested `node_modules`; the same trap applies to `@base-ui/react` and
`@tanstack/react-virtual`.

**A detail panel overlaps the nav.** `MainNav` publishes the live width as
`--sidebar-w`; if the app renders its own sidebar instead, nothing sets it.
Import `MainNav`.

**`/design-update` is not found.** Skills are only discovered at the app root:
run `npm run install:skills`, then restart the session.

**The guard passes instantly on a big app.** It scans `src/` only. If the app's
code lives elsewhere, it checked nothing.

**The guard passes but the screen still looks wrong.** Expected. Tokens govern
colour and size, components govern shape, layout (L1–L8) governs where the
blocks sit. Only the first is greppable — read the rulebook and compare against
the catalogue's Sandbox.
