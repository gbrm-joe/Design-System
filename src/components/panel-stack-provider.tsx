"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PanelEntry {
  /** Unique key for this panel instance (e.g. "portfolio-8", "lease-42"). */
  id: string;
  /** Title shown in the panel header — text-sm, level with the app name in the
   *  nav beside it (HEADER_H's one centred line). */
  title: string;
  /** The breadcrumb PARENT — rendered inline BEFORE the title at text-sm
   *  (`Projects › The Swan`), muted and clickable: clicking it closes this
   *  panel, which is how a record gets back to the table it opened from. It is
   *  not a subtitle above the title; the name predates the breadcrumb decision
   *  and the old comment saying "above the title (text-xs)" misdescribed it,
   *  which is how the sandbox's first record shipped with no breadcrumb at all
   *  (2026-08-17). */
  subtitle?: string;
  /** Optional inline content rendered beside the title (e.g. badges, dates). */
  titleExtra?: ReactNode;
  /** Optional action controls in the header's right cluster. */
  headerActions?: ReactNode;
  /** The panel body content. */
  content: ReactNode;
  /** Optional width class override. Defaults to `PANEL_W` — full width less
   *  the main nav. There is no good reason to pass anything else. */
  widthClass?: string;
  /** Optional top offset (any CSS length, e.g. a var published by the parent
   *  panel). When set, this panel starts below that offset instead of at the top
   *  of the viewport, so the parent's header and tab bar stay visible and
   *  clickable beneath it. A nested panel also suppresses the stack backdrop and
   *  the dim overlay on the panel below. */
  topInset?: string;
  /** Slim header: title at text-sm in a shorter bar. For a nested panel, whose
   *  parent's header and tabs stay visible above it. */
  compactHeader?: boolean;
}

interface PanelStackContextValue {
  /** The current ordered stack (bottom → top). */
  stack: PanelEntry[];
  /** Push a panel onto the stack. If a panel with the same id exists, it is
   *  brought to the top rather than duplicated. */
  open: (entry: PanelEntry) => void;
  /** Close the topmost panel (default) or a specific panel by id. */
  close: (id?: string) => void;
  /** Close every panel in the stack. */
  closeAll: () => void;
  /** Replace the topmost panel in place — used for sibling navigation
   *  (Prev/Next) so a new panel isn't stacked per step. */
  replaceTop: (entry: PanelEntry) => void;
  /** Merge a partial into an existing panel by id without remounting content. */
  update: (id: string, partial: Partial<PanelEntry>) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const PanelStackContext = createContext<PanelStackContextValue | null>(null);

export function usePanelStack(): PanelStackContextValue {
  const ctx = useContext(PanelStackContext);
  if (!ctx) throw new Error("usePanelStack must be used inside <PanelStackProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function PanelStackProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<PanelEntry[]>([]);

  const open = useCallback((entry: PanelEntry) => {
    setStack((prev) => {
      // If already in stack, remove it first so it moves to the top.
      const filtered = prev.filter((p) => p.id !== entry.id);
      return [...filtered, entry];
    });
  }, []);

  const close = useCallback((id?: string) => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      if (id) return prev.filter((p) => p.id !== id);
      // LIFO — pop the topmost panel
      return prev.slice(0, -1);
    });
  }, []);

  const closeAll = useCallback(() => setStack([]), []);

  const replaceTop = useCallback((entry: PanelEntry) => {
    setStack((prev) => (prev.length === 0 ? [entry] : [...prev.slice(0, -1), entry]));
  }, []);

  const update = useCallback((id: string, partial: Partial<PanelEntry>) => {
    setStack((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  }, []);

  return (
    <PanelStackContext.Provider
      value={{ stack, open, close, closeAll, replaceTop, update }}
    >
      {children}
    </PanelStackContext.Provider>
  );
}
