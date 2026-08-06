---
name: design-update
description: Pull the latest @gbrm/design version into this app and make the code comply — bump the pinned tag, read what changed in the rulebook, fix every design-guard failure, apply the new conventions, verify, and commit. Trigger whenever the user types /design-update or says "pull the latest design system", "update the design system", "bump the design system", or "adopt the new design tokens".
---

# /design-update — adopt the latest shared Design System

The Design System lives in its own repo (`gbrm-joe/Design-System`) and is pinned
here as a GitHub tag in `package.json`. This skill moves the app onto the newest
tag and then does the real work: making the app's code obey whatever the new
version now says.

This skill ships **inside** the package (`skills/design-update/SKILL.md`) and is
copied into this app by `scripts/install-skills.sh`. It is versioned with the
rules it enforces — the copy in `.claude/skills/` is package-owned, so edit it
upstream, never here.

Invoking this skill is the user's approval to edit app code to comply. It is
**not** approval to change the Design System itself.

## Never do this

- **Never edit the Design System repo or `node_modules/@gbrm/design`.** A design
  change is made upstream, tagged, and adopted here. If a new rule seems wrong,
  stop and say so — do not patch the token locally.
- **Never silence the guard.** Adding a pattern to `.design-check-ignore` hides
  drift rather than fixing it. Only propose it for a page the rulebook genuinely
  exempts (auth screens, for example), and only with the user's explicit yes.
- **Never bulk-refactor without warning.** If a rule change implies edits across
  more than roughly a dozen files, stop after step 5, report the scale in plain
  English, and get a yes before touching code.

## Steps

### 1. Check this app actually consumes the package

`package.json` must have a `@gbrm/design` dependency (a `github:gbrm-joe/Design-System#vX.Y.Z`
spec). If not, stop — this skill does not apply here. Note the pinned tag.

### 2. Snapshot the current rulebook

The package ships its own rulebook, so the pre-upgrade copy is already on disk.
Copy `node_modules/@gbrm/design/DESIGN_SYSTEM.md` into the scratchpad as
`DESIGN_SYSTEM.old.md`. This is what makes step 5 possible — do it *before*
installing anything.

### 3. Find the newest tag and bump

    git ls-remote --tags https://github.com/gbrm-joe/Design-System

Pick the highest semver tag. If it equals the pinned tag, report "already on
the latest" and stop — unless the user explicitly asked to re-run the compliance
pass anyway, in which case skip to step 6.

Otherwise edit the spec in `package.json` to the new tag and run `npm install`.
Confirm the install took: the version in `node_modules/@gbrm/design/package.json`
should have moved.

### 4. Re-install the skills — this file may have changed

The new version ships its own copy of this skill. Pull it in **now**, before
doing any of the work below, so the rest of the run follows the new
instructions:

    npm run install:skills

If the app has no `install:skills` script, add one:
`"install:skills": "sh node_modules/@gbrm/design/scripts/install-skills.sh"`.

The script prints whether anything changed. If it reports that `design-update`
was updated, **stop and re-read `.claude/skills/design-update/SKILL.md`** — the
instructions you are currently following are the old version. Continue from the
step you were on, in the new file, and tell the user the skill itself moved.

### 5. Read what changed — this is the work list

    diff <scratchpad>/DESIGN_SYSTEM.old.md node_modules/@gbrm/design/DESIGN_SYSTEM.md

Read the whole diff, not a skim. Sort what you find into three buckets:

- **Enforced** — a new or changed rule the design guard greps for. Step 6 finds
  these for you.
- **Not enforced** — new conventions, renamed or retired tokens, changed scale
  values, new layout rules. The guard cannot see most of these. You must search
  the app for them yourself.
- **Newly shipped components** — if the package now ships a component the app
  has its own local copy of, replace the local copy with the import and delete
  the orphan.

Also `git log` the Design System repo between the two tags if the sibling
checkout exists (`../Design System`) — commit messages often name the intent
behind a rule better than the doc does.

### 6. Run the guard and fix every hit

    npm run check:design

Every failure is fixed by **composing the token**, not by rewriting the styling
longhand a different way. Import from the app's `@/lib/design` (or directly from
`@gbrm/design` where that is the app's convention — match what neighbouring
files do). Re-run until it prints `✓ design guard clean`.

If the app has no `check:design` script, add one:
`"check:design": "sh node_modules/@gbrm/design/scripts/check-design.sh"`.

### 7. Apply the unenforced changes

Work the "not enforced" bucket from step 5 through the app by hand. Search for
each retired name, old value, or superseded pattern. Grep is the tool here — the
guard will not tell you when a spacing value or a layout convention has moved.

### 8. Reconcile the app's own design doc

If the app has its own `DESIGN_SYSTEM.md`, it should hold **only** app-specific
material — exemptions and app-only components. Delete anything the shared
rulebook now covers or contradicts. Two sources of truth is the failure mode
this whole setup exists to prevent.

### 9. Verify

Run whichever of these the app has, and get them all green:

    npm run check:design
    npx tsc --noEmit
    npm test
    npm run build

A design update that breaks the build is not done.

### 10. Commit

One commit, imperative summary, body naming the version move and the rule
changes adopted. Include the refreshed `.claude/skills/` copy if the app tracks
it in git. Example:

    chore: adopt @gbrm/design v0.5.0

    Layout rules promoted to L1–L7 and Conventions C1–C8 added; removes
    right-alignment across tables, forms and tiles.

Follow the repo's git convention for what happens next — push if the repo's
`CLAUDE.md` says to, otherwise leave it staged and say so.

### 11. Report

Written for someone who reads diffs but not code. Cover:

- Version moved from → to.
- **What visibly changes in the app**, in plain English. Not the token names —
  what the user will see differently on screen.
- What to check in the browser.
- Anything you deliberately left alone, and why.
- Whether this skill itself changed in the upgrade.
