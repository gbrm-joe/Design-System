#!/bin/sh
# Design-drift guard — fails when control styling is hand-rolled instead of
# composed from the @gbrm/design tokens. Crude on purpose: drift should fail
# loudly. Run from an app root via its `check:design` script:
#   sh node_modules/@gbrm/design/scripts/check-design.sh
# An app may exempt files that legitimately declare control styling by listing
# grep patterns in a `.design-check-ignore` at its root — one per line, NO
# blank lines. See DESIGN_SYSTEM.md in the package.

fail=0

exempt() {
  if [ -f .design-check-ignore ]; then
    grep -v -f .design-check-ignore
  else
    cat
  fi
}

check() {
  label="$1"; shift
  # lib/design is always exempt: a migrating app's local shim re-exports the
  # tokens and legitimately contains the literals.
  hits=$(grep -rn "$@" src --include="*.tsx" --include="*.ts" | grep -v "lib/design.ts" | exempt)
  if [ -n "$hits" ]; then
    echo "✗ $label"
    echo "$hits"
    fail=1
  fi
}

# A LAYOUT check: flags `pattern` only in files that also contain `anchor`.
# Layout rules are about where blocks sit relative to each other, so a bare
# grep can't see them — the pair can. Same .design-check-ignore exemption.
check_pair() {
  label="$1"; anchor="$2"; pattern="$3"
  hits=$(grep -rlE "$anchor" src --include="*.tsx" 2>/dev/null | while IFS= read -r f; do
    grep -nE "$pattern" "$f" 2>/dev/null | sed "s|^|$f:|"
  done | grep -v "lib/design.ts" | exempt)
  if [ -n "$hits" ]; then
    echo "✗ $label"
    echo "$hits"
    fail=1
  fi
}

# Retired names and old control signatures.
check "TOOLBAR_BTN is retired — import BTN/BTN_PRIMARY from @/lib/design" "TOOLBAR_BTN"
check "h-8 toolbar-style button — use BTN (h-7) from @/lib/design" "h-8 items-center"
check "h-8 longhand field — use FIELD from @/lib/design" "h-8 w-full rounded border"
# Dark-fill button longhand (BTN_PRIMARY is white; dark fills are not a button style).
check "dark-fill button longhand — no dark buttons (Joe, 2026-08-04)" "border-neutral-900 bg-neutral-900"
# Duplicates of the BTN literal — import the constant instead.
check "BTN class string duplicated — import BTN from @/lib/design" "h-7 items-center gap-1.5 rounded border border-neutral-300 bg-white px-2.5 text-xs"
# Plan-04 tokens: longhand equivalents are drift.
check "dark-fill button — use BTN (no dark buttons)" "rounded bg-neutral-900 px"
check "SURFACE_CARD written longhand — import it" "rounded-lg border border-neutral-200 bg-white\""
check "SURFACE_CARD_MUTED written longhand — import it" "rounded-lg border border-neutral-200 bg-neutral-50\""
check "TAG written longhand — use TAG + TAG_COLOR" "px-1.5 py-0.5 text-\[10px\] font-semibold uppercase"
check "segmented control longhand — use SEGMENTED tokens" "items-center gap-1 rounded border border-neutral-300 bg-white p-0.5"
check "off-scale h-6 control — controls are h-7 (BTN/FIELD)" "h-6 rounded border\|h-6 w-full rounded border\|h-6 flex-1 rounded border"
check "DialogTitle size override — text-lg is the component default" "DialogTitle className=\"text-lg\""
check "checkbox accent drift — use CHECKBOX from @/lib/design" "accent-neutral-900\|accent-neutral-700"
check "FormField label cell longhand — use FIELD_ROW_LABEL" "bg-neutral-50 px-3 py-2 text-xs font-medium uppercase"
check "transparent field input re-declared — import fieldInput from ui/field-controls" "w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-300"

# ── Layout rules (DESIGN_SYSTEM.md → Layout, L1–L8) ────────────────────────
# L1 — a detail panel's fields sit in ONE column on the LEFT (~w-1/3); the
# right side carries charts and KPIs. A multi-column grid in a file that
# renders FormFields is the two-column form the rule exists to stop.
check_pair "L1 — FormFields in a multi-column grid: fields are ONE column, on the left (~w-1/3); charts/KPIs go right" \
  "<FormField" "grid-cols-[2-9]"

# C1 — everything is left-aligned (Joe, 2026-08-06). Figures keep tabular-nums;
# the alignment goes. Covers responsive variants (md:text-right) too.
check "C1 — text-right: nothing is ever right-aligned, in a table, a form, a tile or a report" "text-right"

# The package ships these; a local re-declaration is drift by definition
# (DESIGN_SYSTEM.md → Banned). Catches the record that grows its own tab
# strip or panel chrome instead of importing PanelLayout.
check "a shipped component re-declared locally — import it from @gbrm/design" -E \
  "(function|const) (EntityTable|MainNav|PanelHeader|PanelNav|PanelSubHeader|PanelBody|PanelLayout|PanelShell|PanelStackRenderer|FormField|ColourBadge)[ (<=]"

# L8 — the main nav is MainNav. A hand-rolled Sidebar is how the two apps ended
# up with different insets and no indent under their group headers, each still
# passing every token check (Joe, 2026-08-06).
check "L8 — hand-rolled main sidebar: import MainNav from @gbrm/design" -E \
  "(function|const) Sidebar[ (<=]"

if [ "$fail" -eq 0 ]; then
  echo "✓ design guard clean"
fi
exit "$fail"
