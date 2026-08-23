---
name: design-install
description: Install the shared @gbrm/design Design System into this app for the first time — pin the release, add the peer deps, wire the theme and the guard, install the skills, replace the app's local sidebar/table/panel/field copies with the shipped components, fix every guard failure, verify and commit. Trigger whenever the user types /design-install or says "install the design system", "set up the design system here", or "adopt the design system in this app". For an app that ALREADY has it, use /design-update instead.
---

# /design-install — put the Design System into this app

The Design System lives in `gbrm-joe/Design-System` and is consumed as
`@gbrm/design`, pinned to a git tag. This skill does the whole first install and
then the real work: replacing what the app hand-rolled with what the package
ships.

Invoking this skill is the user's approval to edit app code to comply. It is
**not** approval to change the Design System itself.

## First, check you are in the right place

- If `package.json` already has a `@gbrm/design` dependency, **stop** — this app
  is already installed. Run `/design-update` instead.
- If this IS the Design System repo (its `package.json` is `@gbrm/design`),
  **stop** — the skill installs INTO a consuming app.

## Never do this

- **Never edit the Design System repo or `node_modules/@gbrm/design`** to make
  this app's screen work. A design change is made upstream, tagged, adopted.
- **Never silence the guard.** `.design-check-ignore` is only for screens the
  rulebook genuinely exempts (auth, the legacy `rpt-*` report, devtools), and
  only with the user's explicit yes.
- **Never keep a local copy** of anything the package ships beside the import.
  Delete the local one in the same commit.
- **Never bulk-rewrite silently.** Report the scale after step 6 and get a yes
  before touching more than roughly a dozen files.

## Steps

### 1. Pin the newest release

    git ls-remote --tags https://github.com/gbrm-joe/Design-System

Take the highest `vX.Y.Z` and install it. The tag IS the version — no ranges,
no `latest`, because every upgrade must be a deliberate edit later.

    npm install github:gbrm-joe/Design-System#vX.Y.Z

### 2. Add the peer deps the components need

Check which are already there; install only what is missing:

    @base-ui/react lucide-react sonner @tanstack/react-virtual clsx
    tailwind-merge class-variance-authority

React 19, React DOM and Next 15+ are assumed present. Each dep must be
installed ONCE, at the app root. A second copy of `sonner` fails silently —
its toast queue is module state, so `toast()` and `<Toaster/>` end up in
different copies and toasts simply never appear.

### 3. Wire the theme into Tailwind (v4)

In the app's global stylesheet:

    @import "tailwindcss";
    @import "@gbrm/design/theme.css";
    @source "../../node_modules/@gbrm/design/dist";

Fix the relative path to `node_modules` for where that file actually sits.
**The `@source` line is not optional** — without it Tailwind never scans the
package and every class used only inside a token is missing from the build.

Report stylesheets also get `@import "@gbrm/design/print.css";`.

### 4. Set the brand colour

The nav wears the unit's brand colour, per app, on the root:

    :root { --sidebar-bg: #09090b; }

Never hand-pick the nav's active/idle colours to suit it — they are
translucent overlays and hold on any hue by design.

### 5. Add the scripts, install the skills

In `package.json`:

    "check:design": "sh node_modules/@gbrm/design/scripts/check-design.sh",
    "install:skills": "sh node_modules/@gbrm/design/scripts/install-skills.sh"

Then `npm run install:skills`. Claude Code only finds skills at the app root,
so this copies the packaged ones (including `/design-update`) into
`.claude/skills/`. That copy is package-owned — never edited in the app.

Wire `check:design` into CI or a pre-commit hook if the app has one.

### 6. Replace the app's local copies with the shipped components

This is the actual job. Import from `@gbrm/design` and DELETE the local
version as each goes:

1. The sidebar → `MainNav` (the app passes groups, items and its router link
   element — and no spacing at all; `MainNav` owns the indents, Soon items,
   collapse row and the live `--sidebar-w`).
2. Every list of records → `EntityTable`. Never a hand-rolled `<table>`.
3. Detail panels → `Sheet` + `PanelHeader` + `PanelNav`/`PanelLayout`, inside
   `PanelStackProvider` with one `PanelStackRenderer` and one `<Toaster/>` at
   the shell.
4. Form rows → `FormField`; badges → `ColourBadge`; dialogs → `Dialog`.
5. Everything else → compose the tokens.

Two shell traps: a `z-50` wrapper round the app puts it above the panel stack
(z-40+) so records open invisibly, and an app that renders its own sidebar
never publishes `--sidebar-w`, so panels overlap the nav.

A gradual migration may keep one `src/lib/design.ts` re-exporting the package —
the guard exempts that file so call sites can move over without a flag day.

### 7. Run the guard, fix every hit

    npm run check:design

Fix each failure by composing the token, never by rewriting the styling
longhand a different way. Repeat until clean.

Then tell the user its two limits plainly, because a green tick over-reads
easily: it scans `src/` only (an app whose code sits in `app/` at the root
passes without checking anything), and it reads class strings, so it cannot
see shape.

### 8. Read the rulebook for what the guard cannot see

`node_modules/@gbrm/design/DESIGN_SYSTEM.md` — the numbered layout rules
(L1–L8) and conventions (C1–C8). Check the app's screens against them by hand:
one column of fields in a panel, the h-12 title band inset by `HEADER_PAD`,
two stacked h-9 bars on a table, the one 4px gap, nothing right-aligned, em
dashes for zero and absent, `DD MMM YYYY`, red negatives with a real minus.

### 9. Verify

    npm run check:design
    npx tsc --noEmit
    npm run build

Plus the app's tests if it has any. An install that breaks the build is not
done.

### 10. Commit and report

One branch, one commit, naming the version adopted. Then report in plain
English: what visibly changed on screen, what to check in the browser, and
anything deliberately left alone (with why). If the app kept an exemption or
a local component, say so explicitly — that is the thing that rots.
