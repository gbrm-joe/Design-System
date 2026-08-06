/**
 * App-wide badge colour tones — pale, fully-filled pills for status and
 * category badges (DESIGN_SYSTEM.md → Badges).
 *
 * Each tone is a *literal* Tailwind class pair (pale background + readable
 * text) so Tailwind's source scanner picks the classes up — they are never
 * built up dynamically. Any screen that needs a coloured pill maps its value
 * to a `BadgeTone` here and renders it with the shared `ColourBadge`.
 */

export type BadgeTone =
  | "neutral"
  | "blue"
  | "amber"
  | "green"
  | "indigo"
  | "sky"
  | "teal"
  | "pink"
  | "violet"
  | "emerald"
  | "red";

/** Pale pill classes for each tone — background + text, no border. */
export const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-600",
  blue: "bg-blue-100 text-blue-800",
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
  indigo: "bg-indigo-100 text-indigo-800",
  sky: "bg-sky-100 text-sky-800",
  teal: "bg-teal-100 text-teal-800",
  pink: "bg-pink-100 text-pink-800",
  violet: "bg-violet-100 text-violet-800",
  emerald: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-800",
};

/** Stable tone hashed from a free-text label — consistent across the app, no
 *  maintenance as new values appear. Use for open-ended categories. */
const HASH_TONES: BadgeTone[] = [
  "indigo", "sky", "teal", "amber", "pink", "violet", "emerald", "red",
];

export function hashTone(name: string | null): BadgeTone {
  if (!name) return "neutral";
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return HASH_TONES[Math.abs(h) % HASH_TONES.length];
}
