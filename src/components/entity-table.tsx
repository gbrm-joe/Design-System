"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useDeferredValue,
  useRef,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Columns3,
  Layers,
  Trash2,
  X,
} from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { usePanelStack, type PanelEntry } from "./panel-stack-provider";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import type { ActionResult } from "../action-result";
import { cn } from "../utils";
import { BTN, BTN_ACTIVE, BTN_PRIMARY, BTN_DANGER, BTN_ICON_GHOST, FIELD, FIELD_SEARCH, CHIP, COUNT_PILL, SURFACE_BAR, SURFACE_CARD, SURFACE_EMPTY, SURFACE_MENU, MENU_ITEM, CHECKBOX, SKELETON } from "../design";

// ---------------------------------------------------------------------------
// A generic master-list table — the surveys-table chrome (toolbar, column
// header menus, drag-reorder, resize, grouping, totals, saved views, mobile
// cards, side-panel + ↑/↓ sibling navigation) made reusable across entities.
// Drives both the Contacts and Organisations screens. Adds multi-select with a
// guarded bulk delete (the elements-tab pattern): a select column, an action
// bar, and a confirmation dialog. Survey-specific bits (record-class / status
// segmented toggles) are intentionally dropped; pass an "Add" control via
// `toolbar`.
// ---------------------------------------------------------------------------

export interface ColumnDef<T> {
  key: string;
  label: string;
  /** Default relative width — normalised to a percentage of the table. */
  width: number;
  /** May be used as a grouping key. */
  groupable?: boolean;
  /** May be filtered via a value checklist. */
  filterable?: boolean;
  /** Cannot be hidden via the Columns menu. */
  locked?: boolean;
  /** Summed in per-group / footer totals. */
  aggregate?: "count";
  /** How that total renders. Defaults to a plain locale-formatted number with
   *  an em dash for zero. Give a column money or hours formatting here rather
   *  than forking the table. */
  renderTotal?: (value: number) => ReactNode;
  sortValue: (r: T) => string | number;
  /** Display string for grouping / filter options (filterable columns only). */
  groupValue?: (r: T) => string;
  render: (r: T) => ReactNode;
  cellClass?: (r: T) => string;
}

/** How a row opens as a side panel. */
export interface PanelConfig<T> {
  id: (r: T) => string;
  title: (r: T) => string;
  /** The breadcrumb PARENT, rendered inline before the title and closing the
   *  panel back to this table when clicked — e.g. `() => "Projects"`. A record
   *  opened from a table always has one. */
  subtitle?: (r: T) => string;
  /** Optional inline content rendered beside the title (e.g. an ID badge). */
  titleExtra?: (r: T) => ReactNode;
  content: (r: T) => ReactNode;
  /** Defaults to the full width beside the sidebar. */
  widthClass?: string;
}

const MIN_COL_PX = 56;
/** Relative weight reserved for the leading select column when selectable. */
const SELECT_WEIGHT = 26;

type Filters = Record<string, string[]>;

interface View {
  id: string;
  name: string;
  filters: Filters;
  groupBy: string | null;
  sortCol: string;
  sortDir: "asc" | "desc";
  visibleCols: string[];
}

// ---------------------------------------------------------------------------
// Column header menu — sort / group / filter
// ---------------------------------------------------------------------------

export function ColumnHeaderMenu({
  label,
  sortActive,
  sortDir,
  onSort,
  filterOptions,
  filterValues,
  onFilter,
  groupActive,
  onToggleGroup,
}: {
  label: string;
  sortActive: boolean;
  sortDir: "asc" | "desc";
  onSort: (dir: "asc" | "desc") => void;
  filterOptions: string[] | null;
  filterValues: string[];
  onFilter: ((v: string[]) => void) | null;
  groupActive: boolean;
  onToggleGroup: (() => void) | null;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filterActive = filterValues.length > 0;
  const anyActive = sortActive || filterActive || groupActive;
  const shownOptions = useMemo(
    () =>
      (filterOptions ?? []).filter((o) =>
        o.toLowerCase().includes(search.toLowerCase()),
      ),
    [filterOptions, search],
  );

  function toggle(v: string) {
    if (!onFilter) return;
    onFilter(
      filterValues.includes(v)
        ? filterValues.filter((x) => x !== v)
        : [...filterValues, v],
    );
  }

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs font-semibold uppercase tracking-wide text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900"
      >
        <span>{label}</span>
        {sortActive &&
          (sortDir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          ))}
        {anyActive && !sortActive && (
          <span className="h-1 w-1 rounded-full bg-neutral-900" />
        )}
      </button>

      {open && (
        <div
          className={`${SURFACE_MENU} absolute top-full left-0 mt-1 w-56 text-neutral-700`}
        >
          <button
            type="button"
            onClick={() => {
              onSort("asc");
              setOpen(false);
            }}
            className={`${MENU_ITEM} ${
              sortActive && sortDir === "asc" ? "font-medium text-neutral-900" : ""
            }`}
          >
            <ChevronUp className="h-3 w-3" /> Sort ascending
          </button>
          <button
            type="button"
            onClick={() => {
              onSort("desc");
              setOpen(false);
            }}
            className={`${MENU_ITEM} ${
              sortActive && sortDir === "desc"
                ? "font-medium text-neutral-900"
                : ""
            }`}
          >
            <ChevronDown className="h-3 w-3" /> Sort descending
          </button>

          {onToggleGroup && (
            <>
              <div className="my-1 border-t border-neutral-100" />
              <button
                type="button"
                onClick={() => {
                  onToggleGroup();
                  setOpen(false);
                }}
                className={`${MENU_ITEM} ${
                  groupActive ? "font-medium text-neutral-900" : ""
                }`}
              >
                <Layers className="h-3 w-3" />
                {groupActive ? "Ungroup" : `Group by ${label.toLowerCase()}`}
              </button>
            </>
          )}

          {onFilter && filterOptions && (
            <>
              <div className="my-1 border-t border-neutral-100" />
              <div className="px-2 py-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                    Filter
                  </p>
                  {filterActive && (
                    <button
                      type="button"
                      onClick={() => onFilter([])}
                      className="text-[10px] text-neutral-400 hover:text-neutral-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search values…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${FIELD} mb-1`}
                />
                <div className="max-h-48 overflow-y-auto">
                  {shownOptions.length === 0 ? (
                    <p className="px-1 py-1 text-xs text-neutral-400">No values</p>
                  ) : (
                    shownOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-xs normal-case hover:bg-neutral-50"
                      >
                        <input
                          type="checkbox"
                          checked={filterValues.includes(opt)}
                          onChange={() => toggle(opt)}
                          className={CHECKBOX}
                        />
                        <span className="truncate text-neutral-700">{opt}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Views dropdown
// ---------------------------------------------------------------------------

function ViewsDropdown({
  views,
  activeViewId,
  onApply,
  onDelete,
  onSave,
}: {
  views: View[];
  activeViewId: string | null;
  onApply: (view: View) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSave() {
    const n = name.trim();
    if (!n) return;
    onSave(n);
    setName("");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        // Active view: same white surface, the dark border marks the state —
        // dark fills are not a button style (Joe, 2026-08-04).
        className={activeViewId ? BTN_ACTIVE : BTN}
      >
        <Bookmark className="h-3.5 w-3.5" />
        Views
        {views.length > 0 && (
          <span className={COUNT_PILL}>
            {views.length}
          </span>
        )}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {open && (
        <div className={`${SURFACE_MENU} absolute left-0 top-full mt-1 w-56`}>
          {views.length === 0 ? (
            <p className="px-3 py-2 text-xs text-neutral-400">
              No saved views yet.
            </p>
          ) : (
            <>
              {views.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    onApply(v);
                    setOpen(false);
                  }}
                  className={cn(MENU_ITEM, "group cursor-pointer justify-between",
                    v.id === activeViewId ? "font-semibold text-neutral-900" : "text-neutral-700")}
                >
                  <span className="truncate">{v.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(v.id);
                    }}
                    className="ml-2 shrink-0 text-neutral-400 opacity-0 hover:text-neutral-700 group-hover:opacity-100"
                    aria-label={`Delete view ${v.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="my-1 border-t border-neutral-100" />
            </>
          )}
          <div className="px-3 py-1.5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
              Save current view as
            </p>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="View name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                className={`${FIELD} flex-1`}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!name.trim()}
                className={`${BTN} disabled:opacity-40`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Columns dropdown
// ---------------------------------------------------------------------------

function ColumnsDropdown({
  columns,
  visibleCols,
  onToggle,
}: {
  columns: { key: string; label: string; locked?: boolean }[];
  visibleCols: string[];
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={BTN}
      >
        <Columns3 className="h-3.5 w-3.5" />
        Columns
        <span className={COUNT_PILL}>
          {visibleCols.length}
        </span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {open && (
        <div className={`${SURFACE_MENU} absolute left-0 top-full mt-1 w-52`}>
          {columns.map((c) => {
            const checked = visibleCols.includes(c.key);
            return (
              <label
                key={c.key}
                className={cn(MENU_ITEM, c.locked ? "cursor-default" : "cursor-pointer")}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={c.locked}
                  onChange={() => onToggle(c.key)}
                  className={`${CHECKBOX} disabled:opacity-50`}
                />
                <span className="text-neutral-700">{c.label}</span>
                {c.locked && (
                  <span className="ml-auto text-[10px] text-neutral-400">Fixed</span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Entity table
// ---------------------------------------------------------------------------

export function EntityTable<T extends { id: K }, K extends string | number = number>({
  rows: data,
  columns,
  defaultVisibleKeys,
  storageKey,
  initialPanelId,
  searchText,
  searchPlaceholder = "Search…",
  entityNoun = { one: "record", many: "records" },
  toolbar,
  filters: filterControls,
  panel,
  onRowClick,
  defaultSort,
  onDelete,
  deleteVerb = "Delete",
  selectionActions,
  loading = false,
  emptyMessage,
}: {
  rows: T[];
  columns: ColumnDef<T>[];
  defaultVisibleKeys: string[];
  /** localStorage namespace for this table's views / columns / widths. */
  storageKey: string;
  initialPanelId: string | null;
  /** A lowercased haystack for the free-text search box. */
  searchText: (r: T) => string;
  searchPlaceholder?: string;
  entityNoun?: { one: string; many: string };
  /** Section-specific ACTION BUTTONS — rendered FIRST (top-left) in the
   *  table's toolbar bar. The add/new action leads (BTN_PRIMARY); further
   *  actions follow in BTN. Never put toggles/filters here — use `filters`. */
  toolbar?: ReactNode;
  /** Display toggles and filters (e.g. a "Show sample" checkbox) — rendered
   *  with the display controls, after Views / Columns, never between action
   *  buttons. Style as BTN-classed labels so they read as controls. */
  filters?: ReactNode;
  /** Row → read side-panel (with ↑/↓ sibling nav). Omit when using `onRowClick`. */
  panel?: PanelConfig<T>;
  /** Custom row-click handler (e.g. open an edit form). Takes precedence over `panel`. */
  onRowClick?: (r: T) => void;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  /** When set, rows are multi-selectable and a guarded bulk delete is offered. */
  onDelete?: (ids: K[]) => Promise<ActionResult>;
  /** Verb for the delete control + dialog (e.g. "Delete", "Archive"). */
  deleteVerb?: string;
  /** Extra buttons for the selection pill (e.g. "Copy to…"), rendered before
   *  Delete. `clear` empties the selection. */
  selectionActions?: (ids: K[], clear: () => void) => ReactNode;
  /** Data hasn't arrived yet. The chrome stays: toolbar and column headers
   *  render as normal and only the body becomes SKELETON bars, in the same
   *  columns at the same row height, so nothing moves when the rows land. */
  loading?: boolean;
  /** What an empty table says, and the control that fixes it (e.g. the add
   *  button). Defaults to "No {many} found." */
  emptyMessage?: ReactNode;
}) {
  const { open } = usePanelStack();
  const selectable = !!onDelete;

  const columnMap = useMemo(
    () => Object.fromEntries(columns.map((c) => [c.key, c])) as Record<string, ColumnDef<T>>,
    [columns],
  );
  const filterable = useMemo(() => columns.filter((c) => c.filterable), [columns]);
  const isColKey = (v: unknown): v is string =>
    typeof v === "string" && v in columnMap;

  const VIEWS_KEY = `${storageKey}-views`;
  const COLS_KEY = `${storageKey}-columns`;
  const WIDTHS_KEY = `${storageKey}-widths`;

  function emptyFilters(): Filters {
    const f: Filters = {};
    for (const c of filterable) f[c.key] = [];
    return f;
  }

  const firstSortKey = defaultSort?.key ?? columns[0]?.key ?? "";

  const [query, setQuery] = useState("");
  // The input is driven by `query` (instant), but the expensive filter/sort/row
  // render reads the deferred value, so typing never blocks on re-rendering the
  // whole table — React renders the filtered rows at a lower priority.
  const deferredQuery = useDeferredValue(query);
  const [sortCol, setSortCol] = useState<string>(firstSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSort?.dir ?? "asc");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [visibleCols, setVisibleCols] = useState<string[]>(defaultVisibleKeys);
  const [views, setViews] = useState<View[]>([]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [colWeight, setColWeight] = useState<Record<string, number>>(
    () => Object.fromEntries(columns.map((c) => [c.key, c.width])),
  );
  // Multi-select.
  const [selected, setSelected] = useState<Set<K>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const widthsLoaded = useRef(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [dragCol, setDragCol] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // The scroll container needs a bounded height for row virtualisation, but a
  // fixed cap (the old 78dvh) left the table floating short of the viewport.
  // Measure where the table actually starts and let it run to the bottom of
  // the browser, less a small inset. max-height only — short tables stay
  // content-height. Recomputed on resize.
  const [maxH, setMaxH] = useState<number | null>(null);
  useEffect(() => {
    const compute = () => {
      const el = desktopScrollRef.current?.offsetParent ? desktopScrollRef.current : mobileScrollRef.current;
      if (!el) return;
      setMaxH(Math.max(240, window.innerHeight - el.getBoundingClientRect().top - 4));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  const scrollMaxH = maxH != null ? { maxHeight: maxH } : undefined;

  // Load persisted views / columns / widths after mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    widthsLoaded.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = JSON.parse(localStorage.getItem(VIEWS_KEY) ?? "[]") as unknown[];
      if (Array.isArray(raw)) {
        const loaded = raw
          .map((v): View | null => {
            if (!v || typeof v !== "object") return null;
            const o = v as Record<string, unknown>;
            const cols = Array.isArray(o.visibleCols)
              ? (o.visibleCols.filter(isColKey) as string[])
              : defaultVisibleKeys;
            return {
              id: String(o.id),
              name: String(o.name),
              filters: { ...emptyFilters(), ...(o.filters as Filters) },
              groupBy: isColKey(o.groupBy) ? (o.groupBy as string) : null,
              sortCol: isColKey(o.sortCol) ? (o.sortCol as string) : firstSortKey,
              sortDir: o.sortDir === "desc" ? "desc" : "asc",
              visibleCols: cols.length > 0 ? cols : defaultVisibleKeys,
            };
          })
          .filter((v): v is View => v !== null);
        setViews(loaded);
      }
    } catch {
      /* ignore */
    }
    try {
      const raw = JSON.parse(localStorage.getItem(COLS_KEY) ?? "null");
      if (Array.isArray(raw)) {
        const cols = raw.filter(isColKey) as string[];
        if (cols.length > 0) setVisibleCols(cols);
      }
    } catch {
      /* ignore */
    }
    try {
      const raw = JSON.parse(localStorage.getItem(WIDTHS_KEY) ?? "null");
      if (raw && typeof raw === "object") {
        setColWeight((prev) => {
          const next = { ...prev };
          for (const c of columns) {
            const w = (raw as Record<string, unknown>)[c.key];
            if (typeof w === "number" && w > 0) next[c.key] = w;
          }
          return next;
        });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!widthsLoaded.current || typeof window === "undefined") return;
    localStorage.setItem(WIDTHS_KEY, JSON.stringify(colWeight));
  }, [colWeight, WIDTHS_KEY]);

  function persistCols(cols: string[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(COLS_KEY, JSON.stringify(cols));
    }
  }

  function saveViews(next: View[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEWS_KEY, JSON.stringify(next));
    }
  }

  // ── Panel ────────────────────────────────────────────────────────────────
  // buildPanel is only reached in panel mode (callers guard on `panel`).
  // No prev/next/close in the header (Joe, 2026-08-04) — the table is the way
  // between records; Escape / backdrop / breadcrumb close.
  function buildPanel(p: PanelConfig<T>, row: T): PanelEntry {
    return {
      id: p.id(row),
      widthClass: p.widthClass ?? "w-full desk:w-[calc(100%-var(--sidebar-w))]",
      title: p.title(row),
      subtitle: p.subtitle?.(row),
      titleExtra: p.titleExtra?.(row),
      content: p.content(row),
    };
  }

  function openRow(row: T) {
    if (onRowClick) {
      onRowClick(row);
      return;
    }
    if (!panel) return;
    open(buildPanel(panel, row));
  }

  // Deep link — ?panel=ID opens that row's panel on load.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !initialPanelId || !panel) return;
    deepLinked.current = true;
    const target = data.find((r) => String(r.id) === initialPanelId);
    if (target) openRow(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPanelId, data]);

  // ── Visible columns ──────────────────────────────────────────────────────
  const visibleColDefs = useMemo(
    () => visibleCols.map((k) => columnMap[k]).filter(Boolean),
    [visibleCols, columnMap],
  );

  function toggleColumn(key: string) {
    const col = columnMap[key];
    if (col?.locked) return;
    setVisibleCols((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      persistCols(next);
      return next;
    });
    if (visibleCols.includes(key)) {
      if (groupBy === key) setGroupBy(null);
      if (sortCol === key) setSortCol(firstSortKey);
    }
    setActiveViewId(null);
  }

  function reorderColumn(from: string, to: string) {
    if (from === to) return;
    setVisibleCols((prev) => {
      const next = prev.filter((k) => k !== from);
      const idx = next.indexOf(to);
      if (idx === -1) return prev;
      next.splice(idx, 0, from);
      persistCols(next);
      return next;
    });
    setActiveViewId(null);
  }

  // ── Column widths ────────────────────────────────────────────────────────
  const { colPct, selectColPct } = useMemo(() => {
    const dataTotal = visibleColDefs.reduce(
      (s, c) => s + (colWeight[c.key] ?? c.width),
      0,
    );
    const total = dataTotal + (selectable ? SELECT_WEIGHT : 0);
    const pct: Record<string, number> = {};
    for (const c of visibleColDefs) {
      pct[c.key] = total > 0 ? ((colWeight[c.key] ?? c.width) / total) * 100 : 0;
    }
    return {
      colPct: pct,
      selectColPct: total > 0 && selectable ? (SELECT_WEIGHT / total) * 100 : 0,
    };
  }, [visibleColDefs, colWeight, selectable]);

  function handleResizeMouseDown(
    index: number,
    e: React.MouseEvent<HTMLDivElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();
    const a = visibleColDefs[index];
    const b = visibleColDefs[index + 1];
    const table = tableRef.current;
    if (!a || !b || !table) return;

    const tableWidth = table.offsetWidth;
    const total = visibleColDefs.reduce(
      (s, c) => s + (colWeight[c.key] ?? c.width),
      0,
    );
    const wA = colWeight[a.key] ?? a.width;
    const wB = colWeight[b.key] ?? b.width;
    const pair = wA + wB;
    const minWeight = (MIN_COL_PX / tableWidth) * total;
    const startX = e.clientX;

    function onMove(ev: MouseEvent) {
      const deltaWeight = ((ev.clientX - startX) / tableWidth) * total;
      let newA = wA + deltaWeight;
      newA = Math.max(minWeight, Math.min(pair - minWeight, newA));
      setColWeight((prev) => ({ ...prev, [a.key]: newA, [b.key]: pair - newA }));
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.classList.remove("is-col-resizing");
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.classList.add("is-col-resizing");
  }

  // ── Filter options ───────────────────────────────────────────────────────
  const filterOptions = useMemo(() => {
    const o: Record<string, string[]> = {};
    for (const c of filterable) {
      o[c.key] = [...new Set(data.map((r) => c.groupValue!(r)))].sort((a, b) =>
        a.localeCompare(b, "en-GB", { sensitivity: "base" }),
      );
    }
    return o;
  }, [data, filterable]);

  function setFilter(key: string, v: string[]) {
    setFilters((f) => ({ ...f, [key]: v }));
    setActiveViewId(null);
  }
  function applySort(col: string, dir: "asc" | "desc") {
    setSortCol(col);
    setSortDir(dir);
    setActiveViewId(null);
  }
  function toggleGroup(key: string) {
    setGroupBy((g) => (g === key ? null : key));
    setCollapsed(new Set());
    setActiveViewId(null);
  }
  function toggleCollapsed(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // ── Views ────────────────────────────────────────────────────────────────
  function applyView(v: View) {
    setFilters({ ...emptyFilters(), ...v.filters });
    setGroupBy(v.groupBy);
    setSortCol(v.sortCol);
    setSortDir(v.sortDir);
    const cols = v.visibleCols.filter(isColKey);
    setVisibleCols(cols.length > 0 ? cols : defaultVisibleKeys);
    persistCols(cols.length > 0 ? cols : defaultVisibleKeys);
    setCollapsed(new Set());
    setActiveViewId(v.id);
  }
  function saveView(name: string) {
    const v: View = {
      id: crypto.randomUUID(),
      name,
      filters,
      groupBy,
      sortCol,
      sortDir,
      visibleCols,
    };
    const updated = [...views, v];
    setViews(updated);
    saveViews(updated);
    setActiveViewId(v.id);
  }
  function deleteView(id: string) {
    const updated = views.filter((v) => v.id !== id);
    setViews(updated);
    saveViews(updated);
    if (activeViewId === id) setActiveViewId(null);
  }

  // ── Derived rows ─────────────────────────────────────────────────────────
  const rows = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    let list = data.filter((r) => {
      for (const c of filterable) {
        const sel = filters[c.key];
        if (sel && sel.length > 0 && !sel.includes(c.groupValue!(r))) return false;
      }
      if (!q) return true;
      return searchText(r).toLowerCase().includes(q);
    });

    const col = columnMap[sortCol];
    if (col) {
      list = [...list].sort((a, b) => {
        let av = col.sortValue(a);
        let bv = col.sortValue(b);
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, deferredQuery, filters, sortCol, sortDir, columnMap, filterable]);

  type Totals = Record<string, number>;
  function totalsFor(list: T[]): Totals {
    const t: Totals = {};
    for (const c of columns) {
      if (!c.aggregate) continue;
      t[c.key] = list.reduce((acc, r) => acc + Number(c.sortValue(r)), 0);
    }
    return t;
  }

  const grouped = useMemo(() => {
    if (!groupBy) return null;
    const col = columnMap[groupBy];
    if (!col) return null;
    const map = new Map<string, T[]>();
    for (const r of rows) {
      const key = col.groupValue!(r);
      const list = map.get(key);
      if (list) list.push(r);
      else map.set(key, [r]);
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "en-GB", { sensitivity: "base" }))
      .map(([key, groupRows]) => ({
        key,
        rows: groupRows,
        totals: totalsFor(groupRows),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, groupBy, columnMap]);

  const totals = useMemo(() => totalsFor(rows), [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayOrder = useMemo(
    () => (grouped ? grouped.flatMap((g) => g.rows) : rows),
    [grouped, rows],
  );

  // ── Virtualisation ─────────────────────────────────────────────────────────
  // At a few thousand rows, rendering every <tr> (or mobile card) on each filter
  // keystroke stalls the main thread. Render only the rows in view. The desktop
  // table flattens groups + rows into one list so a single virtualizer drives
  // both grouped and flat modes; the mobile cards virtualise the flat `rows`.
  // Both lists are always mounted (CSS toggles which shows), so virtualising
  // both keeps the hidden one from re-rendering thousands of nodes too.
  type FlatItem =
    | { kind: "group"; key: string; totals: Totals; count: number }
    | { kind: "data"; row: T };
  const flatItems = useMemo<FlatItem[]>(() => {
    if (!grouped) return rows.map((row) => ({ kind: "data", row }));
    const items: FlatItem[] = [];
    for (const g of grouped) {
      items.push({ kind: "group", key: g.key, totals: g.totals, count: g.rows.length });
      if (!collapsed.has(g.key)) {
        for (const row of g.rows) items.push({ kind: "data", row });
      }
    }
    return items;
  }, [grouped, rows, collapsed]);

  const rowVirtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => desktopScrollRef.current,
    estimateSize: () => 33,
    overscan: 18,
  });
  const mobileVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => mobileScrollRef.current,
    estimateSize: () => 132,
    overscan: 8,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const padTop = virtualRows.length ? virtualRows[0].start : 0;
  const padBottom = virtualRows.length
    ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
    : 0;

  // ── Selection ──────────────────────────────────────────────────────────────
  const allSelected =
    displayOrder.length > 0 && displayOrder.every((r) => selected.has(r.id));
  const someSelected =
    !allSelected && displayOrder.some((r) => selected.has(r.id));

  function toggleSelected(id: K) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    setSelected(allSelected ? new Set() : new Set(displayOrder.map((r) => r.id)));
  }

  async function handleDelete() {
    if (!onDelete) return;
    const ids = [...selected];
    if (ids.length === 0) return;
    setDeleting(true);
    const res = await onDelete(ids);
    setDeleting(false);
    if (res.ok) {
      setSelected(new Set());
      setConfirmOpen(false);
      toast.success(
        `${ids.length} ${ids.length === 1 ? entityNoun.one : entityNoun.many} ${deleteVerb.toLowerCase()}d.`,
      );
    } else {
      toast.error(res.error);
    }
  }

  // ── Render helpers ───────────────────────────────────────────────────────
  const totalCols = visibleColDefs.length + (selectable ? 1 : 0);

  function dataRow(r: T, vIndex?: number) {
    return (
      <tr
        key={r.id}
        data-index={vIndex}
        ref={vIndex === undefined ? undefined : rowVirtualizer.measureElement}
        onClick={() => openRow(r)}
        className={`cursor-pointer border-b border-neutral-100 ${
          selected.has(r.id) ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-neutral-50"
        }`}
      >
        {selectable && (
          <td
            className="px-3 py-1.5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={selected.has(r.id)}
              onChange={() => toggleSelected(r.id)}
              aria-label="Select row"
              className={`${CHECKBOX} align-middle`}
            />
          </td>
        )}
        {visibleColDefs.map((c) => (
          <td
            key={c.key}
            className={`truncate px-3 py-1.5 text-left ${c.cellClass?.(r) ?? ""}`}
          >
            {c.render(r)}
          </td>
        ))}
      </tr>
    );
  }

  function groupHeaderRow(
    item: Extract<FlatItem, { kind: "group" }>,
    vIndex: number,
  ) {
    const isCollapsed = collapsed.has(item.key);
    return (
      <tr
        key={`group-${item.key}`}
        data-index={vIndex}
        ref={rowVirtualizer.measureElement}
        onClick={() => toggleCollapsed(item.key)}
        className="cursor-pointer border-y border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
      >
        {selectable && <td className="px-3 py-1.5" />}
        {spanRow(
          <span className="inline-flex items-center gap-1.5">
            <ChevronRight
              className={`h-3 w-3 text-neutral-500 transition-transform ${
                isCollapsed ? "" : "rotate-90"
              }`}
            />
            <span className="text-xs font-semibold text-neutral-800">
              {item.key}
            </span>
            <span className="text-xs text-neutral-400">({item.count})</span>
          </span>,
          item.totals,
          "text-xs font-medium text-neutral-700",
        )}
      </tr>
    );
  }

  function spanRow(leading: ReactNode, rowTotals: Totals, cellClassName: string) {
    const firstAgg = visibleColDefs.findIndex((c) => c.aggregate);
    const labelSpan =
      firstAgg === -1 ? visibleColDefs.length : Math.max(1, firstAgg);
    const cells: ReactNode[] = [
      <td
        key="__label"
        colSpan={labelSpan}
        className={`truncate px-3 py-1.5 ${cellClassName}`}
      >
        {leading}
      </td>,
    ];
    for (let i = labelSpan; i < visibleColDefs.length; i++) {
      const c = visibleColDefs[i];
      cells.push(
        c.aggregate ? (
          <td
            key={c.key}
            className={`truncate px-3 py-1.5 text-left ${cellClassName}`}
          >
            {c.renderTotal
              ? c.renderTotal(rowTotals[c.key] ?? 0)
              : rowTotals[c.key]
                ? rowTotals[c.key].toLocaleString("en-GB")
                : "—"}
          </td>
        ) : (
          <td key={c.key} className="px-3 py-1.5" />
        ),
      );
    }
    return cells;
  }

  const groupByLabel = groupBy ? columnMap[groupBy]?.label : null;
  // First column reads as the card title on mobile; the next few become rows.
  const mobileTitleCol = visibleColDefs[0];
  const mobileDetailCols = visibleColDefs.slice(1, 5);

  return (
    // flex+gap, not space-y: the mobile toolbar row is display:none on
    // desktop, and space-y would still hand its margin to the table card,
    // breaking the flush top alignment with the sidebar border.
    <div className="flex flex-col gap-panelgap">
      {/* ── Mobile toolbar — the desktop toolbar lives inside the table card,
          which is desk-only, so actions + search get a slim row here. ── */}
      <div className="flex flex-wrap items-center gap-panelgap desk:hidden">
        {toolbar}
        {filterControls}
        <div className="relative w-full sm:w-auto sm:min-w-48 sm:flex-1">
          <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={FIELD_SEARCH}
          />
        </div>
      </div>

      {/* ── Desktop table ────────────────────────────────────────────────── */}
      <div
        ref={desktopScrollRef}
        className={`hidden max-h-[78dvh] overflow-auto ${SURFACE_CARD} desk:block`}
        style={scrollMaxH}
      >
        {/* ── Table toolbar bar — part of the table chrome: same height and
            grey as the column header row directly below. One fixed order on
            EVERY table, left-packed: actions (add first, dark) → search →
            Views → Columns → grouped-by. When rows are selected it swaps in
            place to the selection actions so the table never shifts. ── */}
        <div className={`sticky top-0 z-20 flex h-9 items-center gap-panelgap border-b border-neutral-200 ${SURFACE_BAR} px-panelgap`}>
          {selectable && selected.size > 0 ? (
            <>
              <span className="pl-1.5 pr-1.5 text-xs font-medium tabular-nums text-neutral-700">
                {selected.size} {selected.size === 1 ? entityNoun.one : entityNoun.many} selected
              </span>
              {selectionActions?.([...selected], () => setSelected(new Set()))}
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className={BTN_DANGER}
              >
                <Trash2 className="h-3.5 w-3.5" /> {deleteVerb}
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                title="Clear selection"
                className={BTN_ICON_GHOST}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              {toolbar}
              <ViewsDropdown
                views={views}
                activeViewId={activeViewId}
                onApply={applyView}
                onDelete={deleteView}
                onSave={saveView}
              />
              <ColumnsDropdown
                columns={columns}
                visibleCols={visibleCols}
                onToggle={toggleColumn}
              />
              {groupByLabel && (
                // CHIP with the right padding tightened for the clear button.
                <div className={cn(CHIP, "pl-2.5 pr-1")}>
                  <Layers className="h-3 w-3" />
                  <span>
                    Grouped by{" "}
                    <span className="font-medium text-neutral-900">{groupByLabel}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setGroupBy(null);
                      setCollapsed(new Set());
                      setActiveViewId(null);
                    }}
                    aria-label="Clear grouping"
                    className="inline-flex h-4 w-4 items-center justify-center rounded text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filterControls}
              {/* Search sits alone at the right end — never mixed in with the buttons. */}
              <div className="relative ml-auto w-64">
                <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={FIELD_SEARCH}
                />
              </div>
            </>
          )}
        </div>
        <table ref={tableRef} className="w-full table-fixed border-collapse text-xs">
          <colgroup>
            {selectable && <col style={{ width: `${selectColPct}%` }} />}
            {visibleColDefs.map((c) => (
              <col key={c.key} style={{ width: `${colPct[c.key] ?? 0}%` }} />
            ))}
          </colgroup>
          {/* top-9: sticks directly beneath the h-9 toolbar bar. */}
          <thead className={`sticky top-9 z-10 ${SURFACE_BAR} shadow-[0_1px_0_0_#e5e7eb]`}>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {selectable && (
                <th className="h-9 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                    className={`${CHECKBOX} align-middle`}
                  />
                </th>
              )}
              {visibleColDefs.map((c, i) => (
                <th
                  key={c.key}
                  draggable
                  onDragStart={(e) => {
                    setDragCol(c.key);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    if (!dragCol || dragCol === c.key) return;
                    e.preventDefault();
                    setDragOverCol(c.key);
                  }}
                  onDragLeave={() =>
                    setDragOverCol((d) => (d === c.key ? null : d))
                  }
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragCol) reorderColumn(dragCol, c.key);
                    setDragCol(null);
                    setDragOverCol(null);
                  }}
                  onDragEnd={() => {
                    setDragCol(null);
                    setDragOverCol(null);
                  }}
                  className={`relative h-9 cursor-grab px-3 text-left ${dragCol === c.key ? "opacity-40" : ""}`}
                >
                  {dragOverCol === c.key && (
                    <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-0.5 bg-neutral-900" />
                  )}
                  <div className="flex items-center">
                    <ColumnHeaderMenu
                      label={c.label}
                      sortActive={sortCol === c.key}
                      sortDir={sortDir}
                      onSort={(dir) => applySort(c.key, dir)}
                      filterOptions={c.filterable ? filterOptions[c.key] : null}
                      filterValues={filters[c.key] ?? []}
                      onFilter={c.filterable ? (v) => setFilter(c.key, v) : null}
                      groupActive={groupBy === c.key}
                      onToggleGroup={c.groupable ? () => toggleGroup(c.key) : null}
                    />
                  </div>
                  {i < visibleColDefs.length - 1 && (
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(i, e)}
                      onClick={(e) => e.stopPropagation()}
                      role="separator"
                      aria-label={`Resize ${c.label} column`}
                      className="group absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize select-none"
                    >
                      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-transparent transition-colors group-hover:bg-neutral-400" />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // The shape that is coming, in the columns it is coming into —
              // never a spinner over a blank body (DESIGN_SYSTEM.md → Loading
              // and empty). Widths vary a little so it reads as data rather
              // than as a striped pattern.
              // As many rows as the table will actually show, measured from the
              // same height the virtualiser scrolls in: two h-9 bars off the
              // top, the totals bar off the bottom, 29px a row. A fixed dozen
              // leaves the card half-height and it jumps taller the moment the
              // data lands, which is the very thing the rule is about.
              Array.from({ length: Math.max(6, Math.floor(((maxH ?? 400) - 72 - 29) / 29)) }, (_, i) => (
                <tr key={i} className="border-b border-neutral-100" aria-hidden>
                  {selectable && (
                    <td className="px-3 py-1.5">
                      <span className={`${SKELETON} block h-3.5 w-3.5`} />
                    </td>
                  )}
                  {visibleColDefs.map((c, j) => (
                    <td key={c.key} className="px-3 py-1.5">
                      <span
                        className={`${SKELETON} block h-3`}
                        style={{ width: `${[92, 70, 84, 58, 76][(i + j) % 5]}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : flatItems.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="p-panelgap">
                  <div className={`${SURFACE_EMPTY} flex flex-col items-center gap-2 py-6`}>
                    {emptyMessage ?? `No ${entityNoun.many} found.`}
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {padTop > 0 && (
                  <tr aria-hidden>
                    <td colSpan={totalCols} style={{ height: padTop }} className="p-0" />
                  </tr>
                )}
                {virtualRows.map((vr) => {
                  const item = flatItems[vr.index];
                  return item.kind === "group"
                    ? groupHeaderRow(item, vr.index)
                    : dataRow(item.row, vr.index);
                })}
                {padBottom > 0 && (
                  <tr aria-hidden>
                    <td colSpan={totalCols} style={{ height: padBottom }} className="p-0" />
                  </tr>
                )}
              </>
            )}
          </tbody>
          {loading ? (
            // The totals bar is part of the shape that is coming, so it holds
            // its 28px while loading rather than appearing under the rows and
            // shunting them up when the data lands.
            <tfoot className={`sticky bottom-0 z-10 ${SURFACE_BAR} shadow-[0_-1px_0_0_#d4d4d4]`} aria-hidden>
              <tr>
                <td colSpan={totalCols} className="px-3 py-1.5">
                  <span className={`${SKELETON} block h-3 w-32`} />
                </td>
              </tr>
            </tfoot>
          ) : rows.length > 0 ? (
            // Sticky totals: always visible without scrolling to the end.
            // Chrome grey like the header row (non-editable = never white);
            // the shadow draws the top rule (borders don't survive sticky).
            <tfoot className={`sticky bottom-0 z-10 ${SURFACE_BAR} shadow-[0_-1px_0_0_#d4d4d4]`}>
              <tr>
                {selectable && <td className="px-3 py-1.5" />}
                {spanRow(
                  <>
                    Total
                    <span className="ml-1 font-normal text-neutral-500">
                      ({rows.length}{" "}
                      {rows.length === 1 ? entityNoun.one : entityNoun.many})
                    </span>
                  </>,
                  totals,
                  "text-xs font-semibold text-neutral-900",
                )}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      {/* ── Mobile cards ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col gap-3 desk:hidden" aria-hidden>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={cn(SURFACE_CARD, "flex flex-col gap-2 p-3")}>
              <span className={`${SKELETON} h-3 w-2/3`} />
              <span className={`${SKELETON} h-3 w-1/3`} />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className={`${SURFACE_EMPTY} flex flex-col items-center gap-2 p-6 desk:hidden`}>
          {emptyMessage ?? `No ${entityNoun.many} found.`}
        </div>
      ) : (
        <div ref={mobileScrollRef} className="max-h-[78dvh] overflow-auto desk:hidden" style={scrollMaxH}>
          <div
            style={{ height: mobileVirtualizer.getTotalSize(), position: "relative" }}
          >
            {mobileVirtualizer.getVirtualItems().map((vr) => {
              const r = rows[vr.index];
              return (
                <div
                  key={r.id}
                  data-index={vr.index}
                  ref={mobileVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${vr.start}px)`,
                  }}
                  className="pb-3"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openRow(r)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openRow(r);
                      }
                    }}
                    className={cn(SURFACE_CARD, "p-3", selected.has(r.id) && "border-blue-300 bg-blue-50")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-neutral-900">
                        {mobileTitleCol?.render(r)}
                      </div>
                      {selectable && (
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelected(r.id)}
                          aria-label="Select row"
                          className={`${CHECKBOX} mt-0.5 shrink-0`}
                        />
                      )}
                    </div>
                    <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
                      {mobileDetailCols.map((c) => (
                        <div key={c.key}>
                          <dt className="text-xs text-neutral-500">{c.label}</dt>
                          <dd className="truncate text-neutral-800">{c.render(r)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Bulk delete confirmation ─────────────────────────────────────── */}
      {selectable && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {deleteVerb} {selected.size}{" "}
                {selected.size === 1 ? entityNoun.one : entityNoun.many}?
              </DialogTitle>
              <DialogDescription>
                {selected.size === 1 ? "It is" : "They are"} removed from the list
                but kept in the database, so {selected.size === 1 ? "it" : "they"}{" "}
                can be restored.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? `${deleteVerb.replace(/e$/, "")}ing…`
                  : `${deleteVerb} ${selected.size === 1 ? entityNoun.one : entityNoun.many}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
