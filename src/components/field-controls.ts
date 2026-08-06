/**
 * Shared className strings for transparent form controls that sit inside a
 * `FormField` cell — the cell border is the field boundary, so the control
 * itself has no border or background. Use these instead of bordered `Input`
 * boxes (DESIGN_SYSTEM.md → Editing Pattern).
 */

/** Transparent text input. */
export const fieldInput =
  "w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-300 outline-none";

/** Transparent select. */
export const fieldSelect =
  "w-full cursor-pointer bg-transparent text-xs text-neutral-900 outline-none";

/** Transparent textarea. */
export const fieldTextarea =
  "w-full resize-none bg-transparent text-xs text-neutral-900 placeholder:text-neutral-300 outline-none";

/** Transparent input for a FIGURE — tabular, LEFT-aligned like every other
 *  value. DECIDED (Joe, 2026-08-06): nothing is ever right-aligned, in a form
 *  or a table (DESIGN_SYSTEM.md → Conventions, C1). `tabular-nums` is what
 *  keeps a column of figures legible; the alignment never was. */
export const fieldInputNumeric =
  "w-full bg-transparent text-xs tabular-nums text-neutral-900 outline-none";
