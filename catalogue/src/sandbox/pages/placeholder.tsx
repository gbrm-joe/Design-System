// A route that has its band but not its content yet.
//
// It still gets the real PAGE_HEADER: the point of the sandbox is that EVERY
// page in it is a real page. An empty state is drawn with SURFACE_EMPTY (the
// dashed frame), not left blank — a blank content area tells you nothing about
// whether the band above it is right.
import { PAGE_HEADER, PAGE_TITLE, SURFACE_EMPTY, BTN } from "../../../../src";

export default function PlaceholderPage({
  title,
  onGo,
}: {
  title: string;
  onGo: (href: string) => void;
}) {
  return (
    <>
      <div className={PAGE_HEADER}>
        <h1 className={PAGE_TITLE}>{title}</h1>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-panelgap">
        <div className={`${SURFACE_EMPTY} flex h-full flex-col items-center justify-center gap-2`}>
          <p className="text-xs text-neutral-500">
            No sandbox content for {title} yet — the band above it is real.
          </p>
          <div className="flex gap-panelgap">
            <button type="button" className={BTN} onClick={() => onGo("/projects")}>
              Projects
            </button>
            <button type="button" className={BTN} onClick={() => onGo("/dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
