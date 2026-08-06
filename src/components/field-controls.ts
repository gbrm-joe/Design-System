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

/** Transparent input for a FIGURE — right-aligned and tabular, per the rule
 *  that all figures are right-aligned tabular-nums. */
export const fieldInputNumeric =
  "w-full bg-transparent text-right text-xs tabular-nums text-neutral-900 outline-none";
