// The Application system → Conventions. How a VALUE is written, wherever it
// appears — a table cell, a form field, a KPI tile or a printed report.
//
// Tokens govern colour and size, components govern shape, layout governs where
// the blocks sit. Conventions govern the last thing: what the reader actually
// sees in the cell. They were five bullets at the bottom of the rulebook and
// drifted accordingly, so they are numbered here (C1–C8) and drawn.
import {
  SURFACE_CARD,
  SURFACE_BAR,
  CARD_HEADER,
  FIELD_ROW,
  FIELD_ROW_LABEL,
  FIELD_ROW_VALUE,
  TAG,
  TAG_COLOR,
  BTN,
  BTN_DANGER,
  BTN_ICON_GHOST,
  DELTA_POS,
  DELTA_NEG,
  SECTION_LABEL,
} from "../../../src/design";
import { Section, Verdict, CoreRule, Trash, X, ChevronUp } from "../ui";

/** One numbered convention with its rendering underneath. */
function Rule({ n, title, note, children }: { n: number; title: string; note?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className={`${TAG} shrink-0 ${TAG_COLOR.neutral} tabular-nums`}>C{n}</span>
        <span className="text-xs font-semibold text-neutral-900">{title}</span>
      </div>
      {note && <p className="text-xs text-neutral-600">{note}</p>}
      {children}
    </div>
  );
}

/** A small table specimen — the one place a column of figures is read. */
function MiniTable({ rows, right }: { rows: Array<[string, string]>; right?: boolean }) {
  return (
    <div className={`${SURFACE_CARD} max-w-md overflow-hidden ${right ? "opacity-60" : ""}`}>
      <table className="w-full border-collapse text-xs">
        <thead className={SURFACE_BAR}>
          <tr className="border-b border-neutral-200">
            <th className="h-9 px-3 text-left">
              <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-neutral-600 uppercase">
                Property <ChevronUp className="h-3 w-3" />
              </span>
            </th>
            <th className={`h-9 px-3 ${right ? "text-right" : "text-left"}`}>
              <span className="text-xs font-semibold tracking-wide text-neutral-600 uppercase">Passing rent</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, rent]) => (
            <tr key={name} className="border-b border-neutral-100 last:border-b-0">
              <td className="truncate px-3 py-1.5">{name}</td>
              <td className={`px-3 py-1.5 tabular-nums ${right ? "text-right" : ""}`}>{rent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A form row specimen. */
function MiniForm({ rows, right }: { rows: Array<[string, string]>; right?: boolean }) {
  return (
    <div className={`${SURFACE_CARD} max-w-md overflow-hidden ${right ? "opacity-60" : ""}`}>
      {rows.map(([label, value]) => (
        <div key={label} className={FIELD_ROW}>
          <span className={`w-32 ${FIELD_ROW_LABEL}`}><span className="truncate">{label}</span></span>
          <div className={FIELD_ROW_VALUE}>
            <span className={`w-full text-xs tabular-nums ${right ? "text-right" : ""}`}>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AppConventions() {
  return (
    <>
      <CoreRule>
        <span className="font-semibold">Conventions are what the reader actually sees in the cell.</span> They apply
        wherever a value appears — a table, a form, a KPI tile, a printed report — and they are the same in all three
        media. A screen can use every correct token, ship the right components and sit in the right layout, and still
        read wrong because a zero shows as <span className="font-mono text-[11px]">£0</span> or a date as{" "}
        <span className="font-mono text-[11px]">25/03/2027</span>.
      </CoreRule>

      <Section
        stack
        title="C1 — everything is LEFT-aligned"
        note="Nothing is ever right-aligned: not a figure, not a currency, not a total, not in a table, a form, a tile or a report. Figures still carry tabular-nums — that is what makes a column of them legible, and it always was; the alignment never did the work people thought it did. Right-aligning pushes a value away from the label or heading that names it, and leaves a ragged gap down the middle of every row."
      >
        <Rule n={1} title="Left, everywhere — with tabular-nums on figures">
          <div className="flex flex-col gap-3">
            <Verdict ok>left-aligned; the figure sits with its label</Verdict>
            <div className="flex flex-wrap gap-4">
              <MiniTable rows={[["12 King Street", "£1,234,000"], ["4 Mill Road", "£412,500"], ["Unit 7, Anchor Way", "—"]]} />
              <MiniForm rows={[["Passing rent", "£1,234,000"], ["ERV", "£1,410,500"], ["Service charge", "—"]]} />
            </div>
            <Verdict ok={false}>right-aligned — the value drifts away from what names it</Verdict>
            <div className="flex flex-wrap gap-4">
              <MiniTable right rows={[["12 King Street", "£1,234,000"], ["4 Mill Road", "£412,500"], ["Unit 7, Anchor Way", "—"]]} />
              <MiniForm right rows={[["Passing rent", "£1,234,000"], ["ERV", "£1,410,500"], ["Service charge", "—"]]} />
            </div>
          </div>
        </Rule>
      </Section>

      <Section stack title="C2–C5 — how a value is written">
        <Rule n={2} title="Zero and absent are an em dash" note="Never 0, never £0, never an empty cell. A dash says 'nothing here'; a zero says 'measured, and it is zero' — and they are different facts.">
          <div className="flex gap-4">
            <MiniTable rows={[["Unit 7, Anchor Way", "—"], ["Unit 8, Anchor Way", "£0"]]} />
            <div className="flex flex-col justify-center gap-1 text-xs">
              <div><span className="text-emerald-700">✓</span> — vacant, no rent passing</div>
              <div><span className="text-red-600">✗</span> £0 — reads as a measured nil</div>
            </div>
          </div>
        </Rule>

        <Rule n={3} title="Currency is £1,234 — formatted on blur" note="Thousands separated, no pence unless pence are the point. The field shows the raw number while you type and formats when you leave it.">
          <MiniForm rows={[["Passing rent", "£1,234,000"], ["Rent per sq ft", "£28.50"]]} />
        </Rule>

        <Rule n={4} title="Dates are DD MMM YYYY" note="25 Mar 2027. Never 25/03/2027 — an all-numeric date is ambiguous the moment anyone outside the UK reads it, and it sorts wrong by eye.">
          <div className="flex gap-4">
            <MiniForm rows={[["Next review", "25 Mar 2027"], ["Lease expiry", "24 Dec 2031"]]} />
            <div className="flex flex-col justify-center gap-1 text-xs">
              <div><span className="text-emerald-700">✓</span> 25 Mar 2027</div>
              <div><span className="text-red-600">✗</span> 25/03/2027 · 2027-03-25 · Mar 25, 2027</div>
            </div>
          </div>
        </Rule>

        <Rule n={5} title="Negatives are red with a REAL minus sign; positives are plain ink" note="−£1,234, using U+2212, not a hyphen. Green for a positive figure is banned — this is data, not celebration. And colour never carries meaning on its own: the minus sign does the work, the red only reinforces it.">
          <div className="flex flex-col gap-3">
            <div className={`${SURFACE_CARD} flex max-w-md items-center gap-4 px-3 py-2`}>
              <span className="text-xs text-neutral-500">Passing rent</span>
              <span className={DELTA_POS}>+4.2%</span>
              <span className="text-xs text-neutral-500">Capital value</span>
              <span className={DELTA_NEG}>−1.8%</span>
            </div>
            <div className="text-xs text-neutral-600">
              <span className="text-red-600">✗</span> <span className="text-xs text-emerald-600 tabular-nums">+4.2%</span> in green ·{" "}
              <span className="text-xs text-red-600 tabular-nums">-1.8%</span> with a hyphen instead of a minus
            </div>
          </div>
        </Rule>
      </Section>

      <Section stack title="C6–C8 — reading and reaching">
        <Rule n={6} title="A row is ONE line — truncate, never wrap" note="Every table cell and nav item truncates. A wrapping row breaks the h-9 rhythm and makes a list impossible to scan; the full value belongs in the record, not spilled across two lines of a list.">
          <div className="flex gap-4">
            <MiniTable rows={[["Unit 7, Anchor Way Industrial Estate, Bris…", "£412,500"]]} />
          </div>
        </Rule>

        <Rule n={7} title="ONE text-lg heading per panel — hierarchy by weight, not size" note="text-lg is the dialog title and nothing else. Inside a panel, a heavier weight or an uppercase SECTION_LABEL does the work a bigger font would do elsewhere. A fourth text size is banned.">
          <div className={`${SURFACE_CARD} max-w-md overflow-hidden`}>
            <div className={CARD_HEADER}>Financing</div>
            <div className="flex flex-col gap-1 p-3">
              <div className={SECTION_LABEL}>Senior debt</div>
              <div className="text-xs text-neutral-600">Weight and placement carry the hierarchy — every line here is text-xs.</div>
            </div>
          </div>
        </Rule>

        <Rule n={8} title="Icon-only buttons carry an aria-label; delete confirms; Escape closes the top-most layer" note="An icon with no accessible name is invisible to a screen reader and ambiguous to everyone else. Destructive actions always confirm in a centred Dialog — never inline, never on a single click.">
          <div className="flex items-center gap-3">
            <button className={BTN_ICON_GHOST} aria-label="Clear selection"><X /></button>
            <button className={BTN_DANGER}><Trash />Delete</button>
            <button className={BTN}>Cancel</button>
            <span className="text-xs text-neutral-500">aria-label="Clear selection" · Delete opens a confirm · Escape closes it</span>
          </div>
        </Rule>
      </Section>

      <Section stack title="Where these also apply">
        <p className="text-xs text-neutral-600">
          All eight hold on the <span className="font-medium">Print</span> pages too — a report is a table, so its
          figures are left-aligned and tabular, its zeros are em dashes and its dates are DD MMM YYYY. The
          <span className="font-medium"> Website</span> inherits C5 and C8. The only convention that is
          medium-specific is currency precision: a report may show pence where a screen would not.
        </p>
        <p className="text-xs text-neutral-600">
          <span className="font-medium">Guarded:</span> C1 — a <span className="font-mono text-[11px]">text-right</span>{" "}
          anywhere in an app's source now fails <span className="font-mono text-[11px]">check-design.sh</span>.
        </p>
      </Section>
    </>
  );
}
