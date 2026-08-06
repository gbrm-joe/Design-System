// The Print system — A4 documents and reports generated from app data.
// Page geometry ships as @gbrm/design/print.css; element styling is the
// PRINT_* tokens rendered here.
import {
  GAP,
  PRINT_PAGE,
  PRINT_TITLE,
  PRINT_META,
  PRINT_SECTION,
  PRINT_LABEL,
  PRINT_TILE,
  PRINT_TABLE,
  PRINT_TH,
  PRINT_TD,
  PRINT_ROW_TOTAL,
  PRINT_FOOTER,
  CHART_SERIES,
} from "../../../src/design";
import { Spec, Section, CoreRule } from "../ui";

const rows = [
  ["12 King Street", "Retail", "25 Mar 2027", "£1,234,000"],
  ["Unit 4, Riverside Park", "Industrial", "01 Jan 2028", "£486,500"],
  ["Osborne House", "Office", "29 Sep 2026", "£912,750"],
] as const;

export default function PrintSystem() {
  return (
    <>
      <CoreRule>
        <span className="font-semibold">The core rule, translated to paper:</span> there is no interaction in print, so
        ink on white with hairline structure replaces interactive-white-on-grey. Fills never exceed neutral-100 —
        structure comes from rules, not grey bands. Three pt sizes: 9pt data, 12pt sections, 18pt title. A4 portrait,
        15mm margins, via <span className="font-mono text-[10px]">@gbrm/design/print.css</span>.
      </CoreRule>

      <Section
        title="Type"
        note="Three sizes in pt, no exceptions: 9pt data and labels, 12pt section headings (closed with a hairline), 18pt document title — once, page one, with the meta line under it."
      >
        <Spec name="PRINT_TITLE + PRINT_META">
          <div className="rounded border border-neutral-200 bg-white px-4 py-3">
            <div className={PRINT_TITLE}>Portfolio Rent Report</div>
            <div className={PRINT_META}>Property Manager · Q2 2026 · generated 05 Aug 2026</div>
          </div>
        </Spec>
        <Spec name="PRINT_SECTION">
          <div className="w-64 rounded border border-neutral-200 bg-white px-4 py-3">
            <div className={PRINT_SECTION}>Lease schedule</div>
          </div>
        </Spec>
        <Spec name="PRINT_LABEL (9pt like all data)">
          <div className="rounded border border-neutral-200 bg-white px-4 py-3">
            <div className={PRINT_LABEL}>Passing rent pa</div>
            <div className="text-[9pt] tabular-nums">£1,234,000</div>
          </div>
        </Spec>
      </Section>

      <Section
        title="Tables and figures"
        note="Hairline row dividers only — no vertical rules, no zebra. Column headers uppercase muted over a mid-weight rule; totals close with a heavy rule. Headline figures sit in bordered, unfilled boxes (the toner rule). Zero = em dash; negatives red with a real minus."
      >
        <Spec name="PRINT_TABLE / _TH / _TD / _ROW_TOTAL">
          <div className={`${PRINT_PAGE} w-[26rem] rounded border border-neutral-200 p-4`}>
            <table className={PRINT_TABLE}>
              <thead>
                <tr>
                  <th className={PRINT_TH}>Property</th>
                  <th className={PRINT_TH}>Use</th>
                  <th className={PRINT_TH}>Next review</th>
                  <th className={PRINT_TH}>Rent pa</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([name, use, review, rent]) => (
                  <tr key={name}>
                    <td className={PRINT_TD}>{name}</td>
                    <td className={PRINT_TD}>{use}</td>
                    <td className={PRINT_TD}>{review}</td>
                    <td className={`${PRINT_TD} tabular-nums`}>{rent}</td>
                  </tr>
                ))}
                <tr className={PRINT_ROW_TOTAL}>
                  <td className="px-2 py-1" colSpan={3}>Total</td>
                  <td className="px-2 py-1 tabular-nums">£2,633,250</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Spec>
        <Spec name="PRINT_TILE (bordered, never filled)">
          <div className={`flex w-96 ${GAP} rounded border border-neutral-200 bg-white p-3`}>
            {[
              ["Passing rent", "£2,633,250"],
              ["ERV", "£2,890,000"],
              ["Vacancy", "—"],
            ].map(([label, value]) => (
              <div key={label} className={`${PRINT_TILE} flex-1`}>
                <div className={PRINT_LABEL}>{label}</div>
                <div className="text-[9pt] font-semibold tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </Spec>
        <Spec name="PRINT_FOOTER">
          <div className="w-96 rounded border border-neutral-200 bg-white px-4 py-3">
            <div className={PRINT_FOOTER}>
              <span>Portfolio Rent Report</span>
              <span>Page 2 of 7</span>
            </div>
          </div>
        </Spec>
      </Section>

      <Section
        title="Page anatomy"
        note="An A4 page at reduced scale: title + meta, figure band, section, table, running footer. Every table/chart block carries PRINT_AVOID_BREAK; a new top-level section may force PRINT_PAGE_BREAK. Charts use CHART_SERIES unchanged — the palette is validated on white."
      >
        <Spec name="A4 portrait, 15mm margins (print.css)">
          <div className={`${PRINT_PAGE} flex aspect-[210/297] w-[24rem] flex-col rounded border border-neutral-300 p-7 shadow-sm`}>
            <div className={PRINT_TITLE}>Portfolio Rent Report</div>
            <div className={PRINT_META}>Property Manager · Q2 2026 · generated 05 Aug 2026</div>
            <div className={`mt-4 flex ${GAP}`}>
              {[
                ["Passing rent", "£2,633,250"],
                ["ERV", "£2,890,000"],
                ["WAULT", "6.2 yrs"],
              ].map(([label, value]) => (
                <div key={label} className={`${PRINT_TILE} flex-1`}>
                  <div className={PRINT_LABEL}>{label}</div>
                  <div className="text-[9pt] font-semibold tabular-nums">{value}</div>
                </div>
              ))}
            </div>
            <div className={`${PRINT_SECTION} mt-5`}>Lease schedule</div>
            <table className={`${PRINT_TABLE} mt-2`}>
              <thead>
                <tr>
                  <th className={PRINT_TH}>Property</th>
                  <th className={PRINT_TH}>Rent pa</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([name, , , rent]) => (
                  <tr key={name}>
                    <td className={PRINT_TD}>{name}</td>
                    <td className={`${PRINT_TD} tabular-nums`}>{rent}</td>
                  </tr>
                ))}
                <tr className={PRINT_ROW_TOTAL}>
                  <td className="px-2 py-1">Total</td>
                  <td className="px-2 py-1 tabular-nums">£2,633,250</td>
                </tr>
              </tbody>
            </table>
            <div className={`${PRINT_SECTION} mt-5`}>Rent by use</div>
            <div className="mt-2 flex items-end gap-3">
              {[52, 30, 40].map((h, i) => (
                <div key={i} className="w-10 rounded-t-sm" style={{ height: h, background: CHART_SERIES[i] }} />
              ))}
            </div>
            <div className={`${PRINT_FOOTER} mt-auto`}>
              <span>Portfolio Rent Report</span>
              <span>Page 1 of 7</span>
            </div>
          </div>
        </Spec>
      </Section>
    </>
  );
}
