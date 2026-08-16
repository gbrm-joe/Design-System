// The list page — the screen the L2 bug was found on, and the one every
// manager app has most of.
//
// Covers: L2 (nav · h-12 PAGE_HEADER · content on the band's border line),
// L4 (two stacked h-9 bars), L5 (the one gap), L7 (widths), C1 (nothing
// right-aligned), C2 (em dashes), C3/C4/C5 (currency, dates, red negatives),
// C6 (truncate, never wrap).
import { useState } from "react";
import { Plus, Download } from "lucide-react";
import {
  EntityTable,
  ColourBadge,
  PAGE_HEADER,
  PAGE_TITLE,
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

export default function ProjectsPage() {
  const [rows, setRows] = useState(PROJECTS);

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
          rows={rows}
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
              <button type="button" className={BTN_PRIMARY}>
                <Plus className="h-3.5 w-3.5" />
                New Project
              </button>
              <button type="button" className={BTN}>
                <Download className="h-3.5 w-3.5" />
                Export
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
            // A bare title with no way back is wrong. (`subtitle` is the
            // breadcrumb parent — it renders inline before the title, not,
            // as its own doc comment claims, above it.)
            subtitle: () => "Projects",
            content: (r) => <RecordBody project={r} />,
          }}
        />
      </div>
    </>
  );
}
