import { BADGE_TONE_CLASS, type BadgeTone } from "../badge-colours";
import { BADGE } from "../design";

/**
 * Pale, fully-filled status / category pill. Map a value to a `BadgeTone` via
 * `@/lib/badge-colours` and render it here. The single shared pill component
 * keeps every badge in the app visually identical.
 */
export function ColourBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`${BADGE} ${BADGE_TONE_CLASS[tone]}`}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}
