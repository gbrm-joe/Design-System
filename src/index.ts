// ---------------------------------------------------------------------------
// @gbrm/design — the package entry point.
//
// TOKENS are the primary export and always have been: import them and compose.
// COMPONENTS joined in v0.4.0, under the rule set in CLAUDE.md — a component is
// promoted only once two apps need the IDENTICAL thing. The panel stack, the
// entity table, the sheet, the form-field row and the badge cleared that bar
// (Property Manager and Project Manager both need them exactly as written), so
// they now live here rather than being copied and left to drift.
//
// Apps import from "@gbrm/design" and never re-implement any of it.
// ---------------------------------------------------------------------------

export * from "./design";
export * from "./utils";
export * from "./badge-colours";
export * from "./action-result";

// ── Components ─────────────────────────────────────────────────────────────
export { Button, buttonVariants } from "./components/button";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";
export * from "./components/sheet";
export { ColourBadge } from "./components/colour-badge";
export * from "./components/field-controls";
export * from "./components/form-field";
export { EntityTable, ColumnHeaderMenu } from "./components/entity-table";
export type { ColumnDef, PanelConfig } from "./components/entity-table";
export { PanelHeader } from "./components/panel-header";
export type { PanelTab, BreadcrumbSegment } from "./components/panel-header";
export { PanelShell } from "./components/panel-shell";
export {
  PanelStackProvider,
  usePanelStack,
} from "./components/panel-stack-provider";
export type { PanelEntry } from "./components/panel-stack-provider";
export { PanelStackRenderer } from "./components/panel-stack-renderer";
