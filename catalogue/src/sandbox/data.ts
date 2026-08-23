// The sandbox's fixtures.
//
// Deliberately awkward. A fixture of tidy short strings and tidy positive
// numbers proves nothing — the conventions (C1–C8) exist precisely for the
// cases below, so every one of them has to appear on screen:
//
//   C2  zero and absent are an em dash — so some values are null, and some are
//       a real, measured zero (different facts, drawn differently).
//   C3  currency formatting — figures span £0 to seven digits.
//   C4  dates as DD MMM YYYY — never all-numeric.
//   C5  negatives in red with a REAL minus sign — several margins are negative.
//   C6  one line, truncate never wrap — some project names are far too long
//       for their column, on purpose.
//
// Enough rows to make virtualisation and scrolling real.
import type { BadgeTone } from "../../../src";

export interface Project {
  id: number;
  jobRef: string;
  name: string;
  client: string | null;
  status: ProjectStatus;
  targetMargin: number | null;
  grossProfit: number | null;
  wip: number | null;
  startDate: string;
  leadSurveyor: string;
}

export type ProjectStatus =
  | "Won - In Progress"
  | "Won - Complete"
  | "Tender"
  | "On Hold"
  | "Lost";

export const STATUS_TONE: Record<ProjectStatus, BadgeTone> = {
  "Won - In Progress": "green",
  "Won - Complete": "blue",
  Tender: "amber",
  "On Hold": "neutral",
  Lost: "red",
};

const NAMES = [
  "York Hotel, St. Helens",
  "Little Pack Horse, Culcheth",
  "The Unicorn, Cronton",
  "Schedule of Condition",
  "Bulls Head, Lymm",
  "Mr Thomas's Chop House, Manchester",
  "New Bridge Inn, Mossley",
  "Goyt Inn, Whaley Bridge",
  "Red Lion, Wakefield",
  "The Old Plough, Sale",
  "Penrhos Arms, Anglesey",
  "Market Street, Standish",
  "The Little Pack Horse, Bewdley",
  "Woodlands Hotel, Bradford",
  "Boot & Shoe, Penrith",
  "Black Horse, Swainby",
  "The Mulberry Bush, Macclesfield",
  "The Swan, Wilmslow",
  "The Globe, Liverpool",
  // C6 — this one exists to be truncated. Every table has one.
  "Dilapidations assessment and schedule of condition, former brewery bottling plant, Ancoats, Manchester",
  "The Ship Inn, Fleetwood",
  "Kings Arms, Chorley",
  "The Bridge, Bakewell",
  "Rose & Crown, Ripon",
];

const CLIENTS = [
  "Marston's",
  "Greene King",
  "Star Pubs & Bars",
  "Admiral Taverns",
  "Punch Pubs",
  // C2 — absent, not zero. Renders as an em dash.
  null,
];

const SURVEYORS = [
  "Joe Millson",
  "Rachel Okonjo",
  "Tom Fairhurst",
  "Priya Nair",
  "Dan Whitmore",
];

const STATUSES: ProjectStatus[] = [
  "Won - In Progress",
  "Won - In Progress",
  "Won - In Progress",
  "Won - Complete",
  "Tender",
  "On Hold",
  "Lost",
];

/** Deterministic pseudo-random, so the sandbox looks the same every refresh —
 *  a table that reshuffles on reload is useless for spotting a layout change
 *  between two screenshots. */
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const PROJECTS: Project[] = Array.from({ length: 74 }, (_, i) => {
  const status = STATUSES[Math.floor(seeded(i, 1) * STATUSES.length)];
  const lost = status === "Lost";
  const r = seeded(i, 2);
  return {
    id: 3000 + i * 3,
    jobRef: String(3082 + i * 7),
    name: NAMES[i % NAMES.length],
    client: CLIENTS[Math.floor(seeded(i, 3) * CLIENTS.length)],
    status,
    // C2 — a tender has no margin measured yet (absent); some jobs really did
    // come in at exactly zero (measured). Both must be on screen.
    targetMargin: status === "Tender" ? null : Math.round(seeded(i, 4) * 60) / 2,
    // C5 — roughly one in five is negative, so the red minus sign is visible
    // in a real column rather than only in a swatch.
    grossProfit: lost ? 0 : Math.round((r - 0.22) * 240000),
    wip: lost ? null : Math.round(seeded(i, 5) * 90000),
    startDate: `${2024 + (i % 3)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(
      1 + (i % 27),
    ).padStart(2, "0")}`,
    leadSurveyor: SURVEYORS[i % SURVEYORS.length],
  };
});

// ── Tasks ──────────────────────────────────────────────────────────────────
// A second entity, on purpose: one table can be right by accident. This one
// carries the cases the projects table doesn't — a completed flag behind a
// toolbar TOGGLE (which must sit in `filters`, never between the action
// buttons), a countable column for the totals footer, and days-overdue, where
// the negative is a count rather than money.

export interface Task {
  id: number;
  ref: string;
  title: string;
  project: string;
  assignee: string | null;
  status: TaskStatus;
  due: string | null;
  /** Negative = overdue by that many days. Null = nothing due. */
  daysLeft: number | null;
  hours: number;
  done: boolean;
}

export type TaskStatus = "To do" | "In progress" | "Blocked" | "Done";

export const TASK_TONE: Record<TaskStatus, BadgeTone> = {
  "To do": "neutral",
  "In progress": "blue",
  Blocked: "red",
  Done: "green",
};

const TASK_TITLES = [
  "Measure survey — first floor",
  "Draft schedule of condition",
  "Chase client for access",
  "Issue fee note",
  "Review contractor quote",
  "Site visit — roof",
  "Prepare dilapidations response and supporting photographic schedule for the tenant's surveyor",
  "Update programme",
  "Check party wall notices",
  "Close out snagging list",
];

const TASK_STATUSES: TaskStatus[] = [
  "To do",
  "In progress",
  "In progress",
  "Blocked",
  "Done",
  "Done",
];

/** The fixture's "today". Fixed, not `new Date()` — a sandbox whose figures
 *  drift with the clock is useless for comparing two screenshots. */
const TODAY = new Date("2026-08-17T00:00:00Z");

function dueDate(daysLeft: number): string {
  const d = new Date(TODAY.getTime() + daysLeft * 86400000);
  return d.toISOString().slice(0, 10);
}

export const TASKS: Task[] = Array.from({ length: 46 }, (_, i) => {
  const status = TASK_STATUSES[Math.floor(seeded(i, 11) * TASK_STATUSES.length)];
  const done = status === "Done";
  // Roughly a third are overdue, so the red minus is visible in a real column.
  const daysLeft = done ? null : Math.round((seeded(i, 12) - 0.35) * 40);
  return {
    id: 8000 + i * 2,
    ref: `T-${1200 + i * 3}`,
    title: TASK_TITLES[i % TASK_TITLES.length],
    project: NAMES[i % NAMES.length],
    // C2 — unassigned is absent, not "None".
    assignee: seeded(i, 13) > 0.85 ? null : SURVEYORS[i % SURVEYORS.length],
    status,
    // The date and the countdown are the SAME fact written two ways, so they
    // are derived from one number. Two independently random columns that
    // contradict each other is the kind of fixture that trains people to stop
    // reading the screen.
    due: daysLeft == null ? null : dueDate(daysLeft),
    daysLeft,
    hours: Math.round(seeded(i, 14) * 16),
    done,
  };
});

// ── Conventions, applied ───────────────────────────────────────────────────
// These live here rather than in each page: how a value is WRITTEN is C1–C8,
// and a sandbox that formats its figures three different ways is not a
// reference rendering of anything.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** C2 — zero and absent are an em dash. Note that a MEASURED zero is passed
 *  through by the callers that mean it; this handles absent. */
export const DASH = "—";

/** C3 — `£1,234`, thousands separated, no pence unless pence are the point.
 *  C5 — negatives carry a REAL minus sign (U+2212), never a hyphen. */
export function currency(n: number | null | undefined): string {
  if (n == null) return DASH;
  const abs = Math.abs(n).toLocaleString("en-GB", { maximumFractionDigits: 0 });
  return `${n < 0 ? "−" : ""}£${abs}`;
}

/** C4 — `25 Mar 2027`. Never all-numeric: ambiguous the moment anyone outside
 *  the UK reads it. */
export function shortDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function percent(n: number | null | undefined): string {
  if (n == null) return DASH;
  return `${n.toFixed(1)}%`;
}
