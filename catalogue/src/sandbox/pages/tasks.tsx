// The second list page — because one table can be right by accident.
//
// It carries what the projects table doesn't: the toolbar's `filters` slot (a
// toggle NEVER sits between the action buttons — L4's fixed slot order), a
// totals footer off an aggregated column, and a negative that is a count of
// days rather than money (C5 holds either way).
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  EntityTable,
  ColourBadge,
  PAGE_HEADER,
  PAGE_TITLE,
  BTN,
  BTN_ACTIVE,
  BTN_PRIMARY,
  CHECKBOX,
  DELTA_NEG,
  type ColumnDef,
} from "../../../../src";
import { TASKS, TASK_TONE, shortDate, DASH, type Task } from "../data";
import { type DataState } from "../controls";

const columns: ColumnDef<Task>[] = [
  {
    key: "ref",
    label: "Ref",
    width: 80,
    locked: true,
    sortValue: (r) => r.ref,
    render: (r) => <span className="tabular-nums">{r.ref}</span>,
  },
  {
    key: "title",
    label: "Task",
    width: 320,
    sortValue: (r) => r.title,
    render: (r) => r.title,
  },
  {
    key: "project",
    label: "Project",
    width: 220,
    filterable: true,
    groupable: true,
    groupValue: (r) => r.project,
    sortValue: (r) => r.project,
    render: (r) => r.project,
  },
  {
    key: "assignee",
    label: "Assignee",
    width: 140,
    filterable: true,
    groupable: true,
    groupValue: (r) => r.assignee ?? "Unassigned",
    sortValue: (r) => r.assignee ?? "",
    // C2 — unassigned is absent. An em dash, never an empty cell.
    render: (r) => r.assignee ?? DASH,
  },
  {
    key: "status",
    label: "Status",
    width: 130,
    filterable: true,
    groupable: true,
    groupValue: (r) => r.status,
    sortValue: (r) => r.status,
    render: (r) => <ColourBadge label={r.status} tone={TASK_TONE[r.status]} />,
  },
  {
    key: "due",
    label: "Due",
    width: 120,
    sortValue: (r) => r.due ?? "",
    // C4 — DD MMM YYYY; C2 — a done task has nothing due.
    render: (r) => shortDate(r.due),
  },
  {
    key: "daysLeft",
    label: "Days left",
    width: 110,
    sortValue: (r) => r.daysLeft ?? 0,
    // C5 — the minus sign does the work and the red reinforces it. It is the
    // same rule for a count as for money: −6 days is overdue.
    //
    // NOTE (2026-08-17): due TODAY is a measured zero, and C2 as written says
    // "zero and absent are an em dash. Never 0" — while its own next sentence
    // says a zero and a dash are different facts. Both readings are in one
    // paragraph. Following the headline here (dash), because the date column
    // beside it already says "today"; logged for Joe in docs/plans/sandbox.md.
    render: (r) =>
      r.daysLeft == null || r.daysLeft === 0 ? (
        DASH
      ) : (
        <span className={`tabular-nums ${r.daysLeft < 0 ? DELTA_NEG : ""}`}>
          {r.daysLeft < 0 ? `−${Math.abs(r.daysLeft)}` : r.daysLeft}
        </span>
      ),
  },
  {
    key: "hours",
    label: "Hours",
    width: 100,
    aggregate: "count",
    renderTotal: (v) => (v === 0 ? DASH : `${v.toLocaleString("en-GB")} h`),
    sortValue: (r) => r.hours,
    // C2 — a real, measured zero is still nothing to show.
    render: (r) => <span className="tabular-nums">{r.hours === 0 ? DASH : `${r.hours} h`}</span>,
  },
];

export default function TasksPage({ state }: { state: DataState }) {
  const [showDone, setShowDone] = useState(false);
  const [rows, setRows] = useState(TASKS);

  const visible = rows.filter((t) => showDone || !t.done);

  return (
    <>
      <div className={PAGE_HEADER}>
        <h1 className={PAGE_TITLE}>Tasks</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-panelgap">
        <EntityTable<Task>
          rows={state === "empty" || state === "loading" ? [] : visible}
          loading={state === "loading"}
          columns={columns}
          defaultVisibleKeys={["ref", "title", "project", "assignee", "status", "due", "daysLeft", "hours"]}
          storageKey="sandbox-tasks"
          initialPanelId={null}
          searchText={(r) => `${r.ref} ${r.title} ${r.project} ${r.assignee ?? ""}`.toLowerCase()}
          searchPlaceholder="Search tasks…"
          entityNoun={{ one: "task", many: "tasks" }}
          defaultSort={{ key: "due", dir: "asc" }}
          // Action buttons only, add action first.
          toolbar={
            <button type="button" className={BTN_PRIMARY} onClick={() => toast.success("Task added")}>
              <Plus className="h-3.5 w-3.5" />
              New Task
            </button>
          }
          // The toggle lives HERE, after Views/Columns — never between the
          // action buttons. A BTN-classed label, so it reads as a control.
          filters={
            <label className={`${showDone ? BTN_ACTIVE : BTN} cursor-pointer`}>
              <input
                type="checkbox"
                checked={showDone}
                onChange={(e) => setShowDone(e.target.checked)}
                className={CHECKBOX}
              />
              Show done
            </label>
          }
          emptyMessage={
            <>
              <span>Nothing to do — no tasks on this filter.</span>
              {/* The way out of empty is an action, not a sentence. */}
              <button type="button" className={BTN} onClick={() => toast.success("Task added")}>
                <Plus className="h-3.5 w-3.5" />
                New Task
              </button>
            </>
          }
          onDelete={async (ids) => {
            setRows((rs) => rs.filter((r) => !ids.includes(r.id)));
            return { ok: true, message: `${ids.length} deleted` };
          }}
        />
      </div>
    </>
  );
}
