// Charts in the sandbox reuse the catalogue's own GroupedBarChart — the same
// one the Tokens page draws. It already obeys the chart rules: horizontal
// gridlines only, one y-axis, 12px CHART_INK text, CHART_SERIES in fixed
// order, a 2px white gap between adjacent fills, and a legend whenever there
// are two or more series.
//
// Critically it measures its container and draws at 1:1 — twelve pixels means
// twelve real pixels. An SVG with a viewBox stretched to fill its card scales
// the text and the hairlines with it, which is exactly how the catalogue's own
// axis labels once ended up rendering at 14 and 18px.
import { GroupedBarChart } from "../../ui";
import { currency } from "../data";

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 4.271 + salt * 91.7) * 9137.13;
  return x - Math.floor(x);
}

export function ProfitChart({ seed }: { seed: number }) {
  const data = MONTHS.map((label, i) => ({
    label,
    a: Math.round(seeded(seed + i, 1) * 34000) + 4000,
    b: Math.round(seeded(seed + i, 2) * 26000) + 2000,
  }));
  return (
    <GroupedBarChart
      data={data}
      max={40000}
      ticks={[0, 10000, 20000, 30000, 40000]}
      fmt={(v) => currency(v)}
      series={["Fees", "Costs"]}
    />
  );
}
