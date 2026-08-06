"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "../utils";
import { FIELD_ROW, FIELD_ROW_LABEL, FIELD_ROW_VALUE, TOOLTIP } from "../design";

/**
 * Horizontal field row — label in fixed-width left column, content on the right.
 * Used in all form panels across the application for a consistent layout.
 *
 * Put a transparent control (see `field-controls`) in `children`, never a
 * bordered `<input>` box — the cell border IS the field boundary.
 */
export function FormField({
  label,
  children,
  info,
  action,
  invalid = false,
  labelWidth = "w-40",
}: {
  label: string;
  children: React.ReactNode;
  /** Hover explanation for a field whose meaning isn't obvious from its label.
   *  Shown on an info icon beside the label, matching the KPI tiles. */
  info?: string;
  /** Optional icon-sized control pinned to the right of the label cell — for a
   *  one-tap action on the field itself (reset to default, clear). Keep it to an
   *  icon: the label column is fixed-width. */
  action?: React.ReactNode;
  /** Flag the row as a missing required field (red label + tint). */
  invalid?: boolean;
  /** Width class for the label column. Narrow it (e.g. `w-28`) in tight,
   *  short-labelled panels to give the value column more room. */
  labelWidth?: string;
}) {
  return (
    <div
      className={cn(
        FIELD_ROW,
        invalid && "border-red-200 ring-1 ring-inset ring-red-300",
      )}
    >
      <span
        className={cn(
          labelWidth,
          FIELD_ROW_LABEL,
          invalid && "border-red-200 bg-red-50 text-red-600",
        )}
      >
        <span className="truncate">
          {label}
          {invalid && " *"}
        </span>
        {info && <InfoTip text={info} />}
        {action && <span className="ml-auto flex shrink-0 items-center">{action}</span>}
      </span>
      <div className={FIELD_ROW_VALUE}>{children}</div>
    </div>
  );
}

/**
 * The info bubble on a field label — and the ONE way to hang help text off an
 * Info icon anywhere (toolbar help uses it too, with a bigger trigger/bubble).
 * Opens the instant you hover, and a click pins it open (click again, or
 * anywhere else, to dismiss) — the native `title` tooltip was too slow and
 * ignored clicks entirely.
 *
 * Positioned `fixed` off the icon's own rectangle rather than absolutely: these
 * rows sit inside `overflow-hidden` cards, which would otherwise clip the bubble.
 */
export function InfoTip({
  text,
  className = "shrink-0 cursor-pointer hover:text-neutral-700",
  iconClassName = "h-3 w-3",
  width = 288, // w-72
}: {
  text: React.ReactNode;
  className?: string;
  iconClassName?: string;
  width?: number;
}) {
  const [pinned, setPinned] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const ref = React.useRef<HTMLButtonElement>(null);
  const open = (pinned || hovered) && pos != null;

  function locate() {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      top: r.bottom + 6,
      left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
    });
  }

  // Click anywhere else dismisses a pinned bubble.
  React.useEffect(() => {
    if (!pinned) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPinned(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pinned]);

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label="What this means"
        className={className}
        onMouseEnter={() => { locate(); setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { locate(); setPinned((v) => !v); }}
      >
        <Info className={iconClassName} />
      </button>
      {open && (
        <span
          role="tooltip"
          style={{ top: pos.top, left: pos.left, width }}
          // The label cell sets nowrap/uppercase/tracking — reset all of it, or the
          // text runs on one line straight out of the bubble.
          className={`${TOOLTIP} fixed block normal-case tracking-normal whitespace-normal break-words`}
        >
          {text}
        </span>
      )}
    </>
  );
}
