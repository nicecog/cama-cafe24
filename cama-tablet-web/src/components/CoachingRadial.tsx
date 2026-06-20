import type { CoachingCategory } from "../types/dashboard";

type Props = { items: CoachingCategory[] };

const colors = ["#38bdf8", "#f472b6", "#a3e635", "#fbbf24", "#c084fc"];

export default function CoachingRadial({ items }: Props) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
      {items.map((item, i) => {
        const pct = Math.min(100, Math.max(0, item.progress));
        const color = colors[i % colors.length];
        return (
          <div key={item.categoryCd} style={{ textAlign: "center", width: 100 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: `conic-gradient(${color} ${pct * 3.6}deg, #1e293b 0)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {pct}%
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 13 }}>{item.categoryNm}</div>
          </div>
        );
      })}
    </div>
  );
}
