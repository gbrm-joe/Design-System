// The sandbox's router — and the stand-in for `next/navigation`.
//
// The sandbox imports the REAL shipped components, and exactly one of them
// touches Next: PanelStackRenderer calls `usePathname` so it can close every
// open panel when the route changes. Vite aliases `next/navigation` to this
// file, so the shipped component gets a real, reactive pathname and that
// behaviour is genuinely demonstrated rather than stubbed out.
//
// If a component ever needs more of Next than this file can honestly provide,
// that is a signal the COMPONENT is too coupled to the framework — fix the
// component, not the shim.
import { useSyncExternalStore } from "react";

let path = "/projects";
const subscribers = new Set<() => void>();

function subscribe(fn: () => void) {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function navigate(next: string) {
  if (next === path) return;
  path = next;
  subscribers.forEach((fn) => fn());
}

/** The `next/navigation` export PanelStackRenderer imports. */
export function usePathname() {
  return useSyncExternalStore(
    subscribe,
    () => path,
    () => path,
  );
}

/** The link element handed to MainNav as `linkAs` — the sandbox's equivalent of
 *  next/link. MainNav supplies `href`; everything else is the nav's own. */
export function SandboxLink({
  href,
  onClick,
  ...rest
}: React.ComponentPropsWithoutRef<"a">) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (href) navigate(href);
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
