/**
 * The shape a Server Action returns. Shared here because the components in
 * this package (EntityTable's delete, the panel save handlers) call app
 * actions and switch on the result — the CONTRACT is part of the system even
 * though the actions themselves stay in each app.
 *
 * A Server Action never throws for an *expected* failure (validation, a
 * constraint violation) — it returns `{ ok: false, error }`. Throwing is
 * reserved for genuinely unexpected faults.
 */
export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
