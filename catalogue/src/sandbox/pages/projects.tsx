// The list page — the screen the L2 bug was found on, and the one every
// manager app has most of.
//
// Covers: L2 (nav · h-12 PAGE_HEADER · content on the band's border line),
// L4 (two stacked h-9 bars), L5 (the one gap), L7 (widths), C1 (nothing
// right-aligned), C2 (em dashes), C3/C4/C5 (currency, dates, red negatives),
// C6 (truncate, never wrap).
import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import {
  EntityTable,
  ColourBadge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  fieldInput,
  PAGE_HEADER,
  PAGE_TITLE,
  SURFACE_CARD,
  BTN,
  BTN_PRIMARY,
  DELTA_NEG,
  type ColumnDef,
} from "../../../../src";
import {
  PROJECTS,
  STATUS_TONE,
  currency,
  percent,
  shortDate,
  DASH,
  type Project,
} from "../data";
import { type DataState } from "../controls";
import { RecordBody } from "./record";

const columns: ColumnDef<Project>[] = [
  {
    key: "jobRef",
    label: "Job ref",
    width: 90,
    locked: true,
    sortValue: (r) => Number(r.jobRef),
    render: (r) => <span className="tabular-nums">{r.jobRef}</span>,
  },
  {
    key: "name",
    label: "Project",
    width: 300,
    sortValue: (r) => r.name,
    // C6 — one line, truncate. The fixture has a name far too long for this
    // column precisely so the rule is visible rather than asserted.
    render: (r) => r.name,
  },
  {
    key: "client",
    label: "Client",
    width: 160,
    filterable: true,
    groupable: true,
    groupValue: (r) => r.client ?? DASH,
    sortValue: (r) => r.client ?? "",
    // C2 — absent is an em dash, never an empty cell.
    render: (r) => r.client ?? DASH,
  },
  {
    key: "status",
    label: "Status",
    width: 160,
    filterable: true,
    groupable: true,
    groupValue: (r) => r.status,
    sortValue: (r) => r.status,
    render: (r) => <ColourBadge label={r.status} tone={STATUS_TONE[r.status]} />,
  },
  {
    key: "targetMargin",
    label: "Target margin",
    width: 130,
    sortValue: (r) => r.targetMargin ?? -1,
    // C2 — a tender has no margin measured yet. Absent, so a dash.
    render: (r) => <span className="tabular-nums">{percent(r.targetMargin)}</span>,
  },
  {
    key: "grossProfit",
    label: "Gross profit",
    width: 130,
    sortValue: (r) => r.grossProfit ?? 0,
    // C5 — negative is red with a REAL minus sign; positive is plain ink.
    // Green for a positive figure is banned: this is data, not celebration.
    render: (r) => (
      <span className={`tabular-nums ${(r.grossProfit ?? 0) < 0 ? DELTA_NEG : ""}`}>
        {r.grossProfit === 0 ? DASH : currency(r.grossProfit)}
      </span>
    ),
  },
  {
    key: "wip",
    label: "WIP",
    width: 120,
    sortValue: (r) => r.wip ?? -1,
    render: (r) => <span className="tabular-nums">{currency(r.wip)}</span>,
  },
  {
    key: "startDate",
    label: "Start date",
    width: 130,
    sortValue: (r) => r.startDate,
    // C4 — DD MMM YYYY. Never 25/03/2027.
    render: (r) => shortDate(r.startDate),
  },
  {
    key: "leadSurveyor",
    label: "Lead surveyor",
    width: 150,
    filterable: true,
    groupable: true,
    groupValue: (r) => r.leadSurveyor,
    sortValue: (r) => r.leadSurveyor,
    render: (r) => r.leadSurveyor,
  },
];

export default function ProjectsPage({ state }: { state: DataState }) {
  const [rows, setRows] = useState(PROJECTS);
  const [adding, setAdding] = useState(false);

  return (
    <>
      {/* L2 — the band, imported. The title sits level with the app name in
          the nav beside it, and 16px in, on the same vertical line as the
          first column header below. Actions live at the right end of the same
          band; page content starts on its border line, no margin. */}
      <div className={PAGE_HEADER}>
        <h1 className={PAGE_TITLE}>Projects</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-panelgap">
        <EntityTable<Project>
          // Loading and empty are states of THIS screen, not screens of their
          // own: the band above and the table's two h-9 bars are identical in
          // all three, and only the body changes. Flip the devtools switch and
          // nothing may move.
          rows={state === "full" ? rows : []}
          loading={state === "loading"}
          columns={columns}
          defaultVisibleKeys={[
            "jobRef",
            "name",
            "client",
            "status",
            "targetMargin",
            "grossProfit",
            "wip",
          ]}
          storageKey="sandbox-projects"
          initialPanelId={null}
          searchText={(r) => `${r.jobRef} ${r.name} ${r.client ?? ""} ${r.leadSurveyor}`.toLowerCase()}
          searchPlaceholder="Search projects…"
          entityNoun={{ one: "project", many: "projects" }}
          defaultSort={{ key: "jobRef", dir: "asc" }}
          // The fixed slot order (L4): add action FIRST, then other actions.
          // Toggles never sit between action buttons — they go in `filters`.
          toolbar={
            <>
              <button type="button" className={BTN_PRIMARY} onClick={() => setAdding(true)}>
                <Plus className="h-3.5 w-3.5" />
                New Project
              </button>
              <button
                type="button"
                className={BTN}
                // A toast is how an action that finishes on its own reports
                // back — bottom centre, one line, no dialog to dismiss.
                onClick={() => toast.success("Export started — 74 projects")}
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </>
          }
          emptyMessage={
            <>
              <span>No projects yet.</span>
              {/* Empty says what is missing AND carries the action that fixes
                  it — a dashed box with a sentence in it is a dead end. */}
              <button type="button" className={BTN} onClick={() => setAdding(true)}>
                <Plus className="h-3.5 w-3.5" />
                New Project
              </button>
            </>
          }
          onDelete={async (ids) => {
            setRows((rs) => rs.filter((r) => !ids.includes(r.id)));
            return { ok: true, message: `${ids.length} deleted` };
          }}
          panel={{
            id: (r) => String(r.id),
            title: (r) => r.name,
            // A record opened FROM A TABLE always breadcrumbs back to it:
            // `Parent › Record`, the parent clickable and closing the panel.
            // A bare title with no way back is wrong. (`subtitle` IS the
            // breadcrumb parent — it renders inline before the title.)
            subtitle: () => "Projects",
            content: (r) => <RecordBody project={r} />,
          }}
        />
      </div>

      <NewProjectDialog
        open={adding}
        onOpenChange={setAdding}
        onCreate={(name) => {
          setAdding(false);
          toast.success(`${name || "Project"} created`);
        }}
      />
    </>
  );
}

/**
 * The add dialog — the one place a shadcn `Button` is allowed (footers), and
 * the one `text-lg` heading on screen (C7). Its fields are the SAME FormField
 * rows as the record, in ONE column: a dialog is not an excuse for a second
 * form language.
 */
function NewProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          {/* No size here — DialogTitle is text-lg by default and call sites
              never override it. */}
          <DialogTitle>New project</DialogTitle>
          <DialogDescription className="text-xs">
            The job ref is allocated on save.
          </DialogDescription>
        </DialogHeader>

        {/* The default w-40 label cell (L7). w-28 is for a TIGHT panel and this
            dialog is not one — at w-28 "Lead surveyor" truncates, which is a
            worse trade than 12px of value width. */}
        <div className={`${SURFACE_CARD} overflow-hidden`}>
          <FormField label="Project">
            <input
              autoFocus
              className={fieldInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Red Lion, Wakefield"
            />
          </FormField>
          <FormField label="Client">
            <select className={fieldInput} defaultValue="">
              <option value="">—</option>
              {["Marston's", "Greene King", "Star Pubs & Bars", "Admiral Taverns"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Lead surveyor">
            <select className={fieldInput} defaultValue="Joe Millson">
              {["Joe Millson", "Rachel Okonjo", "Tom Fairhurst", "Priya Nair"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>

        <DialogFooter>
          {/* NOTE (2026-08-17): `variant` is passed on BOTH, deliberately.
              Button's DEFAULT variant is `bg-primary` — a dark fill, which the
              rulebook bans outright in the apps — so a footer confirm written
              the obvious way (`<Button>Create</Button>`) ships the one shape
              the system forbids. EntityTable's delete dialog dodges it by
              being destructive; a plain confirm has no defined style at all.
              Logged for Joe in docs/plans/sandbox.md — a design call, not a
              typo to fix quietly. */}
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button variant="outline" onClick={() => onCreate(name)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
