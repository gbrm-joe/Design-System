// The record — what a row opens into.
//
// Covers L1 (fields in ONE column, on the LEFT, ~a third wide, charts and KPIs
// right), L3 (side nav down the left, h-9 sub-header, no horizontal tabs) and
// L7 (the fixed widths). Built from the real PanelLayout, PanelNav and
// FormField, so the shape here IS the shape apps get.
import { useState } from "react";
import {
  PanelLayout,
  FormField,
  fieldInput,
  TILE,
  SURFACE_CARD,
  CARD_HEADER,
  SECTION_LABEL,
  GAP,
  BTN,
  DELTA_NEG,
  type PanelNavGroup,
} from "../../../../src";
import { currency, percent, shortDate, DASH, type Project } from "../data";
import { ProfitChart } from "./chart";

const NAV: PanelNavGroup[] = [
  // NOTE (2026-08-16): MainNavGroup makes `label` optional — "a header above
  // the top item is noise" — but PanelNavGroup requires it, so the first group
  // here has to invent one. L8 says both navs obey the same rules. Found by
  // building this page; logged in docs/plans/sandbox.md.
  { label: "Project", items: [{ id: "overview", label: "Overview" }, { id: "scope", label: "Scope" }] },
  {
    label: "Commercial",
    items: [
      { id: "fees", label: "Fees", badge: 4 },
      { id: "costs", label: "Costs", badge: 12 },
      { id: "invoices", label: "Invoices", badge: 3 },
      { id: "variations", label: "Variations", soon: true },
    ],
  },
  {
    label: "Delivery",
    items: [
      { id: "tasks", label: "Tasks", badge: 8 },
      { id: "timesheets", label: "Timesheets" },
      { id: "documents", label: "Documents" },
    ],
  },
];

export function RecordBody({ project }: { project: Project }) {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  return (
    // L3 — a record navigates DOWN its own left column. A horizontal tab strip
    // is banned: it is a different navigation model and reads as a different
    // application.
    <PanelLayout
      groups={NAV}
      activeId={active}
      onSelect={setActive}
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed((c) => !c)}
      subHeaderLeft={
        <span className="px-1 text-xs text-neutral-500">
          Job {project.jobRef} · started {shortDate(project.startDate)}
        </span>
      }
      subHeaderRight={
        <button type="button" className={BTN}>
          Save
        </button>
      }
    >
      {active === "overview" ? (
        <Overview project={project} />
      ) : (
        <div className={`${SURFACE_CARD} p-4 text-xs text-neutral-500`}>
          The <span className="font-medium text-neutral-700">{active}</span> section. Every
          section is a side-nav entry, never a heading inside the form block (L1).
        </div>
      )}
    </PanelLayout>
  );
}

function Overview({ project }: { project: Project }) {
  const negative = (project.grossProfit ?? 0) < 0;
  return (
    // L1 — fields LEFT in one column at ~w-1/3; the remaining two thirds carry
    // the figures the record exists to show. One column, never two; full width
    // with nothing beside it is equally wrong.
    <div className={`flex ${GAP}`}>
      <div className="w-1/3 shrink-0">
        {/* One compact block, no sub-headers inside it. */}
        <div className={`${SURFACE_CARD} overflow-hidden`}>
          <FormField label="Project">
            <input className={fieldInput} defaultValue={project.name} />
          </FormField>
          <FormField label="Job ref">
            <input className={`${fieldInput} tabular-nums`} defaultValue={project.jobRef} />
          </FormField>
          <FormField label="Client">
            <input className={fieldInput} defaultValue={project.client ?? ""} placeholder={DASH} />
          </FormField>
          <FormField label="Status">
            <select className={fieldInput} defaultValue={project.status}>
              {["Won - In Progress", "Won - Complete", "Tender", "On Hold", "Lost"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Lead surveyor">
            <input className={fieldInput} defaultValue={project.leadSurveyor} />
          </FormField>
          <FormField
            label="Target margin"
            info="The margin the job was priced to achieve, before variations."
          >
            <input
              className={`${fieldInput} tabular-nums`}
              defaultValue={project.targetMargin ?? ""}
              placeholder={DASH}
            />
          </FormField>
          <FormField label="Start date">
            <input className={fieldInput} defaultValue={shortDate(project.startDate)} />
          </FormField>
        </div>
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${GAP}`}>
        {/* L6 — ONE band of equal-width grey tiles. Grey because they are
            read-only: white is for what you can edit or click. No per-tile
            accent colours, and never split across two rows. */}
        <div className={`flex ${GAP}`}>
          <Tile label="Gross profit" value={project.grossProfit === 0 ? DASH : currency(project.grossProfit)} negative={negative} />
          <Tile label="WIP" value={currency(project.wip)} />
          <Tile label="Target margin" value={percent(project.targetMargin)} />
          <Tile label="Invoiced" value={currency((project.grossProfit ?? 0) * 2)} />
        </div>

        <div className={SURFACE_CARD}>
          <div className={CARD_HEADER}>Profit by month</div>
          <div className="p-3">
            <ProfitChart seed={project.id} />
          </div>
        </div>

        <div className={SURFACE_CARD}>
          <div className={CARD_HEADER}>Recent activity</div>
          <div className="divide-y divide-neutral-100">
            {[
              ["Fee note 3 issued", "12 Aug 2026"],
              ["Variation 2 approved", "04 Aug 2026"],
              ["Site visit — structural", "28 Jul 2026"],
            ].map(([what, when]) => (
              <div key={what} className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="truncate text-neutral-700">{what}</span>
                <span className="shrink-0 text-neutral-400">{when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className={`${TILE} flex-1`}>
      <p className={SECTION_LABEL}>{label}</p>
      {/* C5 — the minus sign does the work; the red reinforces it. */}
      <p className={`text-sm tabular-nums ${negative ? DELTA_NEG : "text-neutral-900"}`}>{value}</p>
    </div>
  );
}
